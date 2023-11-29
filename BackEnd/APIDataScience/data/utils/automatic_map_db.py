import os
import subprocess
from sqlalchemy import create_engine

def generate_all_models(database_url, output_file):
    # Conectar a la base de datos para verificar la conexión (opcional)
    engine = create_engine(database_url)
    engine.connect().close()

    # Asegurarse de que el directorio de salida existe
    output_dir = os.path.dirname(output_file)
    os.makedirs(output_dir, exist_ok=True)

    # Ejecutar sqlacodegen para la base de datos completa
    command = f'sqlacodegen "{database_url}"'
    with open(output_file, 'w') as file:
        subprocess.run(command, shell=True, check=True, stdout=file)

# Configuración
DATABASE_URL = 'mysql+pymysql://root:0997927874@localhost/DataSciencePacificoDB'
OUTPUT_DIR = '../Models/DataScienceDBModels.py'

# Ejecutar el script
generate_all_models(DATABASE_URL, OUTPUT_DIR)
