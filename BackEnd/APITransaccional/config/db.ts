// const { Sequelize } = require('sequelize');
import {Sequelize} from 'sequelize'


export const PacificoDB:Sequelize = new Sequelize('RestaurantePacifico', 'root', '0997927874', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})


export const DataScienceDB:Sequelize = new Sequelize('DataSciencePacificoDB', 'root', '0997927874', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})


