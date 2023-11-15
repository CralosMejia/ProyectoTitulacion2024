import pandas as pd


def extract_day(date):
    """
        extracts the day from a date in int format
        
        Args:
        date (date): date

        Returns:
        int: day.
    """
    return int(date.day)


def extract_month(date):
    """
        extracts the month from a date in int format
        
        Args:
        date (date): date

        Returns:
        int: month.
    """
    return int(date.month)


def extract_year(date):
    """
        extracts the year from a date in int format
        
        Args:
        date (date): date

        Returns:
        int: year.
    """
    return int(date.year)


def find_factura_date(factura_id, factura_df):
    """
        extracts date from a data frame
        
        Args:
        factura_id (int): index of factura
        factura_df (DataFrame): set of data to be searched

        Returns:
        date: date.
    """
    return factura_df.loc[factura_df['factura_id'] == factura_id, 'fecha'].iloc[0]


def find_factura_monto_total(factura_id, factura_df):
    """
        extracts monto total from a data frame

        Args:
        factura_id (int): index of factura
        factura_df (DataFrame): set of data to be searched

        Returns:
        int: monto total.
    """
    return factura_df.loc[factura_df['factura_id'] == factura_id, 'monto_total'].iloc[0]


def find_peso_unidad(peso_id, peso_df):
    """
        extracts the weight unit by searching for id
        
        Args:
        peso_id (int): index of peso
        peso_df (DataFrame): set of data to be searched

        Returns:
        symbol: str.
    """
    return peso_df.loc[peso_df['peso_id'] == peso_id, 'unidad'].iloc[0]


def find_peso_simbolo(peso_id, peso_df):
    """
        extracts the symbol unit by searching for id
        
        Args:
        peso_id (int): index of peso
        peso_df (DataFrame): set of data to be searched

        Returns:
        symbol: str.
    """
    return peso_df.loc[peso_df['peso_id'] == peso_id, 'simbolo'].iloc[0]


def find_peso_simbolo_by_ingredienteid(producto_bodega_id, producto_bodega_df):
    """
        extracts the symbol unit by searching for id
        
        Args:
        producto_bodega_id (int): index of producto bodega
        producto_bodega_df (DataFrame): set of data to be searched

        Returns:
        symbol: str.
    """
    return producto_bodega_df.loc[producto_bodega_df['producto_bodega_id'] == producto_bodega_id, 'simbolo_peso'].iloc[
        0]


def get_all_products_by_plato_id(plato_id, ingrediente_plato_df):
    """
        extracts the all products unit by searching for id
        
        Args:
        plato_id (int): index of plato
        ingrediente_plato_df (DataFrame): set of data to be searched

        Returns:
        All_products: DataFrame.
    """
    return ingrediente_plato_df.loc[ingrediente_plato_df['plato_id'] == plato_id]


def get_id_by_date(date, fecha_df):
    """
    Gets the ID corresponding to a date in a DataFrame.

    Args:
    date (str o Timestamp): The date searched for in the DataFrame.
    fecha_df (DataFrame): The DataFrame in which the date will be searched.

    Returns:
    int: The ID corresponding to the date or None if not found.
    """
    # Converts the date to Timestamp type if it is a string
    if isinstance(date, str):
        date = pd.to_datetime(date)

    # Finds the row that matches the date in the DataFrame
    fila = fecha_df[fecha_df['fecha'] == date]

    # If a row was found, returns the corresponding ID
    if not fila.empty:
        return fila.iloc[0]['fecha_factura_ETL_TRA_id']

    # If no row was found, returns None
    return None

