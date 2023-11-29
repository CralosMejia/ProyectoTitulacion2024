

class send_exception(Exception):

    def __init__(self, mensaje):
        super().__init__(mensaje)