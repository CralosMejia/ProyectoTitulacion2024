from jproperties import Properties

configs = Properties()

with open('.env', 'rb') as config_file:
    configs.load(config_file) 


def getProperty(nameProperty):
    return configs.get(nameProperty)[0]