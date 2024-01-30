import time

from dependency_injector.wiring import inject
from sqlalchemy import delete

from app.business.common.logServices import LoggerServices
from app.business.etl.load.loads import load_fecha_dim, load_plato_dim, load_unidad_medida_dim, load_producto_dim, \
    load_venta_platos_facts, load_demanda_producto_facts
from app.business.etl.transform.transformations import *
from app.business.etl.utils.etl_funtions import extract_load_function
from app.data.GenericRepository import GenericRepository
from app.data.Models.DataScienceDBModels import Dimfecha, Hechosdemandaproducto,Hechosventaplato


class ETL:
    @inject
    def __init__(self,logger:LoggerServices, con_db_etls, con_db_pacifico, con_db_data_science):
        self.con_db_etls = con_db_etls
        self.con_db_pacifico = con_db_pacifico
        self.con_db_data_science = con_db_data_science
        self.log=logger


    def run(self):
        """
        Consolidates each of the activities of the ETL.
        """
        t0 = time.perf_counter()
        print('etl process started')
        self.log.addLog('etl process started','ApiDatasicence','Módulo prediccion de demanda')
        ses_db_etls = self.con_db_etls.get_session()
        ses_db_pacifico = self.con_db_pacifico.get_session()
        ses_db_data_science = self.con_db_data_science.get_session()
        try:
            self._run_extractions(ses_db_pacifico, ses_db_etls)
            self._run_transformations(ses_db_etls,ses_db_data_science)
            self._run_loads(ses_db_etls, ses_db_data_science)
            self._clean_data_science_db()
            t1 = time.perf_counter()
            print(f'etl process finished in {t1 - t0} sec')
            self.log.addLog(f'etl process finished in {t1 - t0} sec','ApiDatasicence','Módulo prediccion de demanda')

        except ValueError as e:
            print(f"An error occurred while trying to run ETL of Demand prediction module. ERROR: {e}")
            self.log.addLog('An error occurred while trying to run ETL of Demand prediction module. ERROR: {e}','ApiDatasicence','Módulo prediccion de demanda')

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
        try:
            t0 = time.perf_counter()
            print("loading process has started")
            self.log.addLog('loading process has started', 'ApiDatasicence', 'Módulo prediccion de demanda')

            load_fecha_dim(ses_db_etls, ses_db_data_science, 'fecha_etl_tra', 'dimfecha')
            load_plato_dim(ses_db_etls, ses_db_data_science, 'platos_etl_tra', 'dimplato')
            load_unidad_medida_dim(ses_db_etls, ses_db_data_science, 'peso_etl_tra', 'dimunidadmedida')
            load_producto_dim(ses_db_etls, ses_db_data_science, 'productosbodega_etl_tra', 'dimproducto')
            load_venta_platos_facts(ses_db_etls, ses_db_data_science, 'ventas_etl_tra', 'hechosventaplatos')
            load_demanda_producto_facts(ses_db_etls, ses_db_data_science, 'demanda_etl_tra', 'hechosdemandaproducto')

            t1 = time.perf_counter()
            print(f"loading process has finished in: {t1 - t0} sec")
            self.log.addLog(f'loading process has finished in: {t1 - t0} sec', 'ApiDatasicence', 'Módulo prediccion de demanda')


        except ValueError as e:
            print(f"{e}")
            self.log.addLog(f'an error occurred in the loading process ', 'ApiDatasicence', 'Módulo prediccion de demanda')


    def _run_transformations(self, ses_db_etls,ses_db_data_science):
        """
        Transforms all necessary information

        Args:
        ses_db_pacifico (connection): connection on DB.
        ses_db_etls (connection): connection on DB.
        """

        try:
            t0 = time.perf_counter()
            print("transformations process has started")
            self.log.addLog('transformations process has started', 'ApiDatasicence', 'Módulo prediccion de demanda')


            transform_fechas_ventas(ses_db_etls,ses_db_data_science)
            transform_ventas(ses_db_etls,ses_db_data_science)
            transform_platos(ses_db_etls)
            transform_peso(ses_db_etls)
            transform_ingredientes_plato(ses_db_etls)
            transform_producto_bodega(ses_db_etls)
            transform_demanda(ses_db_etls)

            t1 = time.perf_counter()
            print(f"transformations process has finished in: {t1 - t0} sec")
            self.log.addLog(f'transformations process has finished in: {t1 - t0} sec', 'ApiDatasicence', 'Módulo prediccion de demanda')

        except ValueError as e:
            self.log.addLog(f'an error occurred in the transformations process ', 'ApiDatasicence', 'Módulo prediccion de demanda')
            raise TypeError(f"{e}")


    def _run_extractions(self, ses_db_pacifico, ses_db_etls):
        """
        extracts all the information from each of the tables

        Args:
        ses_db_pacifico (connection): connection on DB.
        ses_db_etls (connection): connection on DB.
        """
        try:
            t0 = time.perf_counter()
            print("extractions process has started")
            self.log.addLog('extractions process has started', 'ApiDatasicence', 'Módulo prediccion de demanda')

            extract_load_function(ses_db_pacifico, ses_db_etls, "Platos", "platos_etl_ext")
            extract_load_function(ses_db_pacifico, ses_db_etls, "Ventas", "ventas_etl_ext")
            extract_load_function(ses_db_pacifico, ses_db_etls, "ConversionPeso", "conversionpeso_etl_ext")
            extract_load_function(ses_db_pacifico, ses_db_etls, "IngredientesPorPlato", "ingredientesporplato_etl_ext")
            extract_load_function(ses_db_pacifico, ses_db_etls, "Peso", "peso_etl_ext")
            extract_load_function(ses_db_pacifico, ses_db_etls, "ProductosBodega", "productosbodega_etl_ext")
            t1 = time.perf_counter()
            print(f"extractions process has finished in: {t1 - t0} sec")
            self.log.addLog(f'extractions process has finished in: {t1 - t0} sec', 'ApiDatasicence', 'Módulo prediccion de demanda')

        except ValueError as e:
            self.log.addLog(f'an error occurred in the extractions process ', 'ApiDatasicence', 'Módulo prediccion de demanda')
            raise TypeError(f"an error occurred in the extractions process: {e}")

    def _clean_data_science_db(self):
        t0 = time.perf_counter()
        print("cleaning process has started")
        ses_db_data_science = self.con_db_data_science.get_session()
        try:
            self.log.addLog('cleaning process has started', 'ApiDatasicence', 'Módulo prediccion de demanda')

            # Paso 1: Obtener la última fecha con datos relevantes
            subquery = ses_db_data_science.query(func.max(Dimfecha.fecha_id)).join(Hechosdemandaproducto,
                                                                       Dimfecha.fecha_id == Hechosdemandaproducto.fecha_id).filter(
                Hechosdemandaproducto.cantidad_predicha_modelo_1 != 0,
                Hechosdemandaproducto.cantidad_predicha_modelo_2 != 0,
                Hechosdemandaproducto.cantidad_real != 0).scalar()

            if subquery is None:
                self.log.addLog(f'There are no records to clean.', 'ApiDatasicence','Módulo prediccion de demanda')
                print(f"There are no records to clean.")
                return


            # Paso 2: Eliminar registros a partir de esa fecha en HechosDemandaProducto y HechosVentaPlatos
            delete_demanda = delete(Hechosdemandaproducto).where(Hechosdemandaproducto.fecha_id >= subquery)
            delete_ventas = delete(Hechosventaplato).where(Hechosventaplato.fecha_id >= subquery)

            # Paso 3: Eliminar las fechas en DimFecha
            delete_fechas = delete(Dimfecha).where(Dimfecha.fecha_id >= subquery)

            ses_db_data_science.execute(delete_demanda)
            ses_db_data_science.execute(delete_ventas)
            ses_db_data_science.execute(delete_fechas)
            ses_db_data_science.commit()


            t1 = time.perf_counter()
            print(f"cleaning process has finished in: {t1 - t0} sec")
            self.log.addLog(f'cleaning process has finished in: {t1 - t0} sec', 'ApiDatasicence','Módulo prediccion de demanda')

        except ValueError as e:
            self.log.addLog(f'An error occurred while cleaning the DataSciene Db.', 'ApiDatasicence','Módulo prediccion de demanda')
            raise TypeError(f"An error occurred while cleaning the DataSciene Db.: {e}")
        finally:
            self.con_db_data_science.close_session(ses_db_data_science)





