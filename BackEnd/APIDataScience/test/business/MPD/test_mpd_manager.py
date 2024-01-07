from fastapi.testclient import TestClient
import pytest
from dependency_injector.wiring import Provide, inject

from app.business.MPD.mpd_Manager import MPD_Manager
from main import create_app  # Asegúrate de importar correctamente tu función create_app
from app.business.etl.ETL import ETL
from app.business.ia.IAManager import IAManager
from unittest.mock import Mock

@pytest.fixture
def app_with_client():
    app = create_app()
    with TestClient(app) as test_client:
        yield app, test_client  # Devuelve tanto la app como el client

@pytest.fixture
def mpd_manager_mock():
    etl_mock = Mock(spec=ETL)
    ia_manager_mock = Mock(spec=IAManager)
    mpd_manager = MPD_Manager(etl=etl_mock, ia_manager=ia_manager_mock, con_db_data_science=None)
    return mpd_manager

def test_run_etl(app_with_client, mpd_manager_mock):
    app, client = app_with_client
    app.container.mpd_manager.override(mpd_manager_mock)
    response = client.get("/mpd/runEtl")
    assert response.status_code == 200
    assert response.text == 'The ETL process has been successfully executed.'
    mpd_manager_mock.run_etl.assert_called_once()

def test_train_model(app_with_client, mpd_manager_mock):
    app, client = app_with_client
    app.container.mpd_manager.override(mpd_manager_mock)
    response = client.get("/mpd/trainModel")
    assert response.status_code == 200
    assert response.text == 'OK'
    mpd_manager_mock.train_model_to_predict_demand.assert_called_once()

def test_forecast_demand(app_with_client, mpd_manager_mock):
    app, client = app_with_client
    app.container.mpd_manager.override(mpd_manager_mock)
    response = client.get("/mpd/forcast")
    assert response.status_code == 200
    assert response.text == 'OK'
    mpd_manager_mock.predict_demand.assert_called_once()
