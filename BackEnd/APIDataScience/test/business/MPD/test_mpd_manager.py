import unittest
from app.business.MPD.mpd_Manager import MPD_Manager

class TestMPDManager(unittest.TestCase):

    def test_run_etl(self):
        mpd_manager = MPD_Manager()
        try:
            mpd_manager.run_etl()
            # Incluye aquí más afirmaciones según sea necesario
        except Exception as e:
            self.fail(f"run_etl method raised an exception: {e}")

if __name__ == '__main__':
    unittest.main()
