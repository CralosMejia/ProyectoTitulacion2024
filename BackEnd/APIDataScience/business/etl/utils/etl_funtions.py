# import traceback
import pandas as pd
from sqlalchemy import text

def extract_load_function(ses_db_pacifico, ses_db_etls, table_name_extraction:str, table_name_load:str):
    """
    Extracts the information from a table in a specific database and stores it in another table in another database.
    
    Args:
    ses_db_pacifico (connection): connection on DB.
    ses_db_etls (connection): connection on DB.
    table_name_extraction (str): name of table source.
    table_name_load(str): name of table destiny.
    """
    try:

        #extract data of table and save on data frame
        table_extract_df =pd.read_sql(f'SELECT * FROM {table_name_extraction}', con=ses_db_pacifico)

        #if doesn't exist data on table  
        if table_extract_df is not None:
            ses_db_etls.connect().execute(text(f'TRUNCATE TABLE {table_name_load}'))
            table_extract_df.to_sql(table_name_load,ses_db_etls,if_exists="append",index=False)
            print(f"Data saved on {table_name_load}")
        
    except ValueError as e:
        raise TypeError(f"An error occurred in the extraction of data from the {table_name_extraction} table. error: {e}")
    finally:
        ses_db_etls.dispose()
        ses_db_pacifico.dispose()

def exists_date_in_df(date, df):
    """
    Checks if a given date exists in a DataFrame.

    Args:
    date (str o Timestamp): The date to be verified.
    df (DataFrame): The DataFrame on which the verification will be performed.

    Returns:
    bool: True if the date exists in the DataFrame, False otherwise.
    """
    # Converts the date to Timestamp type if it is a string
    if isinstance(date, str):
        date = pd.to_datetime(date)

    # Checks if the date exists in the DataFrame
    existe = date in df['fecha'].values

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