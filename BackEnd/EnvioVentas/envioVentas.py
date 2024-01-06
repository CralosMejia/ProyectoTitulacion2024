import json
import os
import pandas as pd
import locale
from datetime import datetime, timedelta
import random
import calendar
import requests

# Establecer el locale en español
locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8')

# Directorio donde están los archivos Excel
directory = 'C:/Users/Carlos Mejia/Desktop/UDLA/ProyectoTita/datos/datosXlsVentas/nuevos'
sent_directory = 'C:/Users/Carlos Mejia/Desktop/UDLA/ProyectoTita/datos/datosXlsVentas/enviados'


# Lista de nombres para excluir
excluded_names = ['DOMICILIO.', 'DOMICILIO...', 'DOMICILIO....', 'DOMICILIO.....', 'DOMICILIO.......', 'DOMICILIO', 
                  'CONSUMO DE ALIMENTOS', 'SERVICIOS PRESTADOS USFQ', 'TRANSPORTE', 'PERSONAL DE SERVICIO', 
                  'DESCORCHE', 'DIEFERENCIA BEBIDA', 'DESAYUNO 4', 'DESAYUNO 5', 'DESAYUNO 6', 'DESAYUNO 7','MEDIA JARRA JUGO','JUGO PEQUENO','JARRA DE JUGO','JARRA DE IMPERIAL','CONTENEDOR','SOPA','SEGUNDO','MERIENDA']

# Función para dividir una cantidad total de forma aleatoria entre un número de partes
def split_randomly(total, parts):
    random_parts = [0] * parts
    for i in range(total):
        random_parts[random.randint(0, parts - 1)] += 1
    return random_parts

def get_week_start_end_dates(year, month):
    num_days = calendar.monthrange(year, month)[1]
    month_start = datetime(year, month, 1)

    # Encontrar el domingo anterior al inicio del mes
    days_to_previous_sunday = month_start.weekday() + 1  # Días hasta el domingo anterior
    first_sunday = month_start - timedelta(days=days_to_previous_sunday)

    # Calcular el inicio del mes siguiente
    if month == 12:
        next_month_start = datetime(year + 1, 1, 1)
    else:
        next_month_start = datetime(year, month + 1, 1)

    weeks = []
    current_start = first_sunday
    while current_start < next_month_start:
        current_end = current_start + timedelta(days=6)
        weeks.append([current_start, min(current_end, next_month_start - timedelta(days=1))])
        current_start = current_end + timedelta(days=1)

    return weeks

def corregir_codificacion(cadena):
    if isinstance(cadena, str):
        try:
            return cadena.encode('latin-1').decode('utf-8')
        except UnicodeEncodeError:
            return cadena
    return cadena

# Lista para almacenar los datos de todos los archivos
all_data = []

# Recorrer cada archivo en el directorio
for filename in os.listdir(directory):
    if filename.endswith(".xls") or filename.endswith(".xlsx"):
        # Construir la ruta completa al archivo
        file_path = os.path.join(directory, filename)

        # Leer el archivo Excel
        df = pd.read_excel(file_path, usecols=['nomart', 'cantid', 'preuni', 'totren'])


        # Extraer el mes y el año del nombre del archivo
        month_year = filename.split('.')[0]
        month, year = month_year.split('-')
        month_number = datetime.strptime(month, '%B').month
        year_number = int(year)

        # Obtener las fechas de inicio y fin para cada semana del mes
        week_dates = get_week_start_end_dates(year_number, month_number)

        # Dividir la cantidad y asignar fechas de inicio y fin de la semana
        for _, row in df.iterrows():
            cantid = row['cantid']
            split_cantidades = split_randomly(cantid, len(week_dates))
            for i, cantidad in enumerate(split_cantidades):
                if cantidad > 0:
                    new_row = row.copy()
                    new_row['cantid'] = cantidad
                    new_row['totren'] = cantidad * row['preuni']
                    new_row['fecha_inicio_semana'] = week_dates[i][0]
                    new_row['fecha_fin_semana'] = week_dates[i][1]
                    all_data.append(new_row)


# Crear DataFrame final con los datos divididos
final_df = pd.DataFrame(all_data)

if not final_df.empty:
    # # Excluir los nombres en la lista 'excluded_names'
    final_df = final_df[~final_df['nomart'].isin(excluded_names)]
    final_df = final_df.rename(columns={'nomart':'nombre_plato'})
    final_df = final_df.rename(columns={'preuni':'precio_unitario'})
    final_df = final_df.rename(columns={'cantid':'cantidad'})
    final_df = final_df.rename(columns={'totren':'precio_total'})
    final_df['fecha_inicio_semana'] = pd.to_datetime(final_df['fecha_inicio_semana']).dt.strftime('%Y-%m-%d')
    final_df['fecha_fin_semana'] = pd.to_datetime(final_df['fecha_fin_semana']).dt.strftime('%Y-%m-%d')


    # Convertir el DataFrame a JSON
    data_json = json.loads(final_df.to_json(orient='records', date_format='iso'))

    # URL de la API a la que quieres enviar los datos
    api_url = 'http://localhost:3000/api/common/ventas/loadVentas'

    # Enviar el JSON a la API
    response = requests.post(api_url, json=data_json)
    if response.status_code == 200:
        print("Datos enviados con éxito.")
        for filename in os.listdir(directory):
            if filename.endswith(".xls") or filename.endswith(".xlsx"):
                os.rename(file_path, os.path.join(sent_directory, filename))


    else:
        print("Error al enviar datos:", response.status_code, response.text)

else:
    print('No hay datos')

