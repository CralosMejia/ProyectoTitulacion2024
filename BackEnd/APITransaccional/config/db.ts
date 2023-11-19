// const { Sequelize } = require('sequelize');
import {Sequelize} from 'sequelize'


const sequelizePacifico:Sequelize = new Sequelize('RestaurantePacifico', 'root', '0997927874', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})


const sequelizeDataScience:Sequelize = new Sequelize('DataSciencePacificoDB', 'root', '0997927874', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})


