# DatabaseContainer con proveedores de sesiones
from dependency_injector import providers, containers


from app.business.MPD.mpd_Manager import MPD_Manager
from app.business.common.logServices import LoggerServices
from app.business.etl.ETL import ETL
from app.business.ia.IAManager import IAManager
from config.DB.DatabaseConnection import DatabaseConnection


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(packages=["app.presentation.controller.etls_controller","jobs.mpd_Jobs","app.presentation.controller.ia_controller","main"])
    config = providers.Configuration()

    etls_engine = providers.Singleton(DatabaseConnection, connection_string=config.etls_connection_string)
    pacifico_engine = providers.Singleton(DatabaseConnection, connection_string=config.pacifico_connection_string)
    data_science_engine = providers.Singleton(DatabaseConnection, connection_string=config.data_science_connection_string)

    logger = providers.Factory(
        LoggerServices,
        con_db_pacifico=pacifico_engine
    )

    etl = providers.Factory(
        ETL,
        con_db_etls=etls_engine,
        con_db_pacifico=pacifico_engine,
        con_db_data_science=data_science_engine,
        logger=logger
    )

    ia_manager = providers.Singleton(
        IAManager,
        con_db_data_science=data_science_engine,
        logger=logger
    )

    mpd_manager = providers.Factory(
        MPD_Manager,
        etl=etl,
        ia_manager=ia_manager,
        con_db_data_science=data_science_engine
    )
