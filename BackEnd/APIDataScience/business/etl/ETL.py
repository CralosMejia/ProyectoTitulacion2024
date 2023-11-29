import time

from business.etl.load.loads import *
from business.etl.transform.transformations import *
from business.etl.utils.etl_funtions import extract_load_function
from data.GenericRepository import GenericRepository
from data.Models.DataScienceDBModels import Dimfecha, Hechosdemandaproducto,Hechosventaplato,Hechosestadopedido


class ETL:
    def __init__(self, con_db_etls, con_db_pacifico, con_db_data_science):
        self.con_db_etls = con_db_etls
        self.con_db_pacifico = con_db_pacifico
        self.con_db_data_science = con_db_data_science


    def run(self):
        """
        Consolidates each of the activities of the ETL.
        """
        ses_db_etls = self.con_db_etls.get_session()
        ses_db_pacifico = self.con_db_pacifico.get_session()
        ses_db_data_science = self.con_db_data_science.get_session()
        try:
            self._run_extractions(ses_db_pacifico, ses_db_etls)
            self._run_transformations(ses_db_etls)
            self._run_loads(ses_db_etls, ses_db_data_science)
            self._clean_data_science_db()
        except ValueError as e:
            raise TypeError(f"An error occurred while trying to run ETL of Demand prediction module. ERROR: {e}")
        finally:
            self.con_db_etls.close_session(ses_db_etls)
            self.con_db_pacifico.close_session(ses_db_pacifico)
            self.con_db_data_science.close_session(ses_db_data_science)

    def _run_loads(self, ses_db_etls, ses_db_data_science):
        """
            load all data necesary to train the model

            Args:
            ses_db_pacifico (connection): connection on DB.
            ses_db_etls (connection): connection on DB.
            """
        t0 = time.perf_counter()
        print("Start load")

        load_fecha_dim(ses_db_etls, ses_db_data_science, 'fecha_etl_tra', 'dimfecha')
        load_plato_dim(ses_db_etls, ses_db_data_science, 'platos_etl_tra', 'dimplato')
        load_unidad_medida_dim(ses_db_etls, ses_db_data_science, 'peso_etl_tra', 'dimunidadmedida')
        load_producto_dim(ses_db_etls, ses_db_data_science, 'productosbodega_etl_tra', 'dimproducto')
        load_venta_platos_facts(ses_db_etls, ses_db_data_science, 'ventas_etl_tra', 'hechosventaplatos')
        load_demanda_producto_facts(ses_db_etls, ses_db_data_science, 'demanda_etl_tra', 'hechosdemandaproducto')

        t1 = time.perf_counter()
        print(f"End load in {t1 - t0} sec")

    def _run_transformations(self, ses_db_etls):
        """
        Transforms all necessary information

        Args:
        ses_db_pacifico (connection): connection on DB.
        ses_db_etls (connection): connection on DB.
        """
        t0 = time.perf_counter()
        print("Start transformations")

        transform_fechas_ventas(ses_db_etls)
        transform_ventas(ses_db_etls)
        transform_platos(ses_db_etls)
        transform_peso(ses_db_etls)
        transform_ingredientes_plato(ses_db_etls)
        transform_producto_bodega(ses_db_etls)
        transform_demanda(ses_db_etls)

        t1 = time.perf_counter()
        print(f"End transformations in {t1 - t0} sec")

    def _run_extractions(self, ses_db_pacifico, ses_db_etls):
        """
        extracts all the information from each of the tables

        Args:
        ses_db_pacifico (connection): connection on DB.
        ses_db_etls (connection): connection on DB.
        """
        t0 = time.perf_counter()
        print("Start extractions")
        extract_load_function(ses_db_pacifico, ses_db_etls, "Platos", "platos_etl_ext")
        extract_load_function(ses_db_pacifico, ses_db_etls, "Ventas", "ventas_etl_ext")
        extract_load_function(ses_db_pacifico, ses_db_etls, "ConversionPeso", "conversionpeso_etl_ext")
        extract_load_function(ses_db_pacifico, ses_db_etls, "IngredientesPorPlato", "ingredientesporplato_etl_ext")
        extract_load_function(ses_db_pacifico, ses_db_etls, "Peso", "peso_etl_ext")
        extract_load_function(ses_db_pacifico, ses_db_etls, "ProductosBodega", "productosbodega_etl_ext")
        t1 = time.perf_counter()
        print(f"End extractions in {t1 - t0} sec")

    def _clean_data_science_db(self):

        ses_db_data_science = self.con_db_data_science.get_session()

        repo_fecha = GenericRepository(ses_db_data_science, Dimfecha)
        repo_demanda = GenericRepository(ses_db_data_science, Hechosdemandaproducto)
        repo_venta_platos = GenericRepository(ses_db_data_science, Hechosventaplato)
        repo_estado_pedido = GenericRepository(ses_db_data_science, Hechosestadopedido)

        # Eliminar fechas no usadas
        self._eliminar_fechas_no_usadas(repo_fecha,repo_demanda, repo_venta_platos,repo_estado_pedido)

        # Eliminar registros en HechosDemandaProducto con cantidad_predicha pero sin cantidad_real
        self._eliminar_demanda_sin_real(repo_demanda)

        # Cerrar la sesión
        self.con_db_data_science.close_session(ses_db_data_science)

    def _eliminar_fechas_no_usadas(self, repo_fecha, repo_demanda, repo_venta_platos, repo_estado_pedido):
        # Obtener todos los fecha_id
        fechas = repo_fecha.get_all()
        fecha_ids = [fecha.fecha_id for fecha in fechas]

        # Verificar cada fecha_id en las otras tablas
        for fecha_id in fecha_ids:
            if not repo_demanda.get_all_by_field('fecha_id', fecha_id) and \
               not repo_venta_platos.get_all_by_field('fecha_id', fecha_id) and \
               not repo_estado_pedido.get_all_by_field('fecha_id', fecha_id):
                repo_fecha.delete(fecha_id)

    def _eliminar_demanda_sin_real(self, repo_demanda):
        # Obtener todas las demandas
        demandas = repo_demanda.get_all()

        for demanda in demandas:
            # Verificar si hay valores en cantidad_predicha_modelo_1 o cantidad_predicha_modelo_2 pero no en cantidad_real
            if (demanda.cantidad_predicha_modelo_1 != 0 and demanda.cantidad_predicha_modelo_2 != 0) and (
                    demanda.cantidad_real == 0 or demanda.cantidad_real is None):
                repo_demanda.delete(demanda.demanda_id)
