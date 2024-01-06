import pandas as pd
from sqlalchemy import text
from sqlalchemy.orm import Session



def extract_load_function(ses_db_pacifico: Session, ses_db_etls: Session, table_name_extraction: str,
                          table_name_load: str):
    """
    Extracts the information from a table in a specific database and stores it in another table in another database.

    Args:
    ses_db_pacifico (Session): session on DB Pacifico.
    ses_db_etls (Session): session on DB ETLS.
    table_name_extraction (str): name of table source.
    table_name_load(str): name of table destiny.
    """
    try:
        # Utiliza el motor asociado a la sesión para Pandas
        engine_pacifico = ses_db_pacifico.bind
        engine_etls = ses_db_etls.bind

        # Extrae datos de la tabla y los guarda en un DataFrame
        table_extract_df = pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=engine_pacifico)

        # Si hay datos en la tabla
        if not table_extract_df.empty:
            # Truncar la tabla antes de cargar nuevos datos
            with engine_etls.connect() as connection:
                connection.execute(text(f'TRUNCATE TABLE {table_name_load}'))

            # Cargar datos en la tabla de destino
            table_extract_df.to_sql(table_name_load, con=engine_etls, if_exists="append", index=False)
            print(f"Data saved on {table_name_load}")

    except ValueError as e:
        raise TypeError(
            f"An error occurred in the extraction of data from the {table_name_extraction} table. Error: {e}")


def exists_date_in_df(date, df):
    """
    Checks if a given date exists in a DataFrame.

    Args:
    date (str o Timestamp): The date to be verified.
    df (DataFrame): The DataFrame on which the verification will be performed.

    Returns:
    bool: True if the date exists in the DataFrame, False otherwise.
    """
    if df.empty:
        return False

    df_fechas = df['fecha']

    # Check if the date exists in the 'fecha' column of the DataFrame
    existe = any(date == str(fecha) for fecha in df_fechas)

    return existe

def exists_value_in_df_by_column(name_column,value_column, df):
    """
    validates whether a record exists based on a column and the value passed to it

    Args:
    name_column (str o Timestamp): the name of the column
    value_column: The value to be verified.
    df (DataFrame): The DataFrame on which the verification will be performed.

    Returns:
    bool: True if the date exists in the DataFrame, False otherwise.
    """



    # Checks if the date exists in the DataFrame
    result = value_column in df[name_column].values

    return result

def exists_row_in_df(df, values):
    """
    validates if that row already exists in the df

    Args:
    df (DataFrame): The DataFrame on which the verification will be performed.
    values (dict): A list of values to be verified.

    Returns:
    bool: True if the date exists in the DataFrame, False otherwise.
    """
    if df.empty:
        return False
    # Inicializa un filtro vacío
    filter = pd.Series(True, index=df.index)

    # Aplica el filtro para cada valor en la lista
    for row, value in values:
        filter = filter & (df[row] == value)

    # Verifica si no hay coincidencias en el filtro
    result =  filter.any()

    return result

def get_value_in_df_by_list(df, target_column, filter_list):
    """
    Returns the first value of the target column where other columns match the given filters.

    Args:
    df (pd.DataFrame): DataFrame where to perform the search.
    filter_list (list): List of tuples with column names and values to filter.
    target_column (str): Name of the column from which to return the value.

    Returns:
    value: The first value in the target column that matches the filters or None if there is no match.
    """
    # Converting the list of tuples into a dictionary
    filtros = dict(filter_list)

    # Apply filters to the DataFrame
    for row, value in filter_list:
        df = df[df[row] == value]

    # If there are rows that match the filters, returns the first value found in the target column.
    if not df.empty:
        return df.iloc[0][target_column]
    else:
        # If there is no match, return None
        return 1

def find_peso_id_by_ingredienteid(producto_bodega_id, producto_bodega_df):
    """
        extracts the symbol unit by searching for id

        Args:
        producto_bodega_id (int): index of producto bodega
        producto_bodega_df (DataFrame): set of data to be searched

        Returns:
        symbol: str.
    """
    return \
    producto_bodega_df.loc[producto_bodega_df['producto_bodega_id'] == producto_bodega_id, 'peso_proveedor_id'].iloc[
        0]


def find_value_by_two_ids(id1, columna_id1, id2, columna_id2, columna_objetivo, df):
    """
    Busca en un DataFrame un par de identificadores en dos columnas distintas y devuelve el valor
    de una tercera columna asociada a esos identificadores.

    Args:
    id1 (int o str): El valor a buscar en la primera columna.
    columna_id1 (str): El nombre de la primera columna a buscar.
    id2 (int o str): El valor a buscar en la segunda columna.
    columna_id2 (str): El nombre de la segunda columna a buscar.
    columna_objetivo (str): El nombre de la columna de la cual se desea obtener el valor.
    df (pd.DataFrame): El DataFrame donde se realizará la búsqueda.

    Returns:
    valor_objetivo (str o int): El valor encontrado en la columna objetivo.
    """
    if id1 == id2:
        return 1

    filtro = (df[columna_id1] == id1) & (df[columna_id2] == id2)
    resultados = df.loc[filtro, columna_objetivo]

    if not resultados.empty:
        return resultados.iloc[0]
    else:
        return None


def get_id_by_dates(date, fecha_df,name_id):
    """
        Gets the ID corresponding to a combined date range in a DataFrame.

        Args:
        date1 (str or Timestamp): The start date of the date range.
        date2 (str or Timestamp): The end date of the date range.
        fecha_df (DataFrame): The DataFrame in which the date range will be searched.

        Returns:
        int: The ID corresponding to the date range or None if not found.
        """
    # Converts the date to Timestamp type if it is a string
    # Converts the date to Timestamp type if it is a string
    if isinstance(date, str):
        date = pd.Timestamp(date)

    # Calculate the week number and year from the date
    semana = date.isocalendar()[1]
    anio = date.year

    # Finds the row that matches the week and year in the DataFrame
    fila = fecha_df[(fecha_df['semana'] == semana) & (fecha_df['anio'] == anio)]

    # If a row was found, returns the corresponding ID
    if not fila.empty:
        return fila.iloc[0][name_id]

    # If no row was found, returns None
    return None

def update_value_by_filters(df, filters, column_name, new_value):
    """
    Actualiza un registro si existe en el DataFrame, o lo agrega si no existe.

    Args:
    df (DataFrame): El DataFrame en el que se realizará la actualización o inserción.
    filters (list): Una lista de filtros en formato de tuplas (columna, valor).
    column_name (str): El nombre de la columna que se actualizará.
    new_value: El nuevo valor que se asignará a la columna.

    Returns:
    DataFrame: El DataFrame actualizado.
    """
    if df.empty:
        return df

    # Inicializa un filtro vacío
    filter_condition = pd.Series(True, index=df.index)

    # Aplica el filtro para cada tupla (columna, valor) en la lista de filtros
    for columna, valor in filters:
        filter_condition = filter_condition & (df[columna] == valor)

    # Verifica si hay coincidencias en el filtro
    if filter_condition.any():
        # Si existe al menos una fila que cumple con la condición, actualiza el registro
        df.loc[filter_condition, column_name] = new_value

    return df
