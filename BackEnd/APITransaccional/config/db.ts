// const { Sequelize } = require('sequelize');
import {Sequelize} from 'sequelize'
import dotenv from 'dotenv';

dotenv.config();
const host:string = process.env.HOST || '';
const pass:string = process.env.PASSWORD || '';
const user:string = process.env.USER || '';

const dbPacifico:string = process.env.DBPACIFICO || '';
const dbDataScience:string = process.env.DBDATASCIENCE || '';




export const PacificoDB:Sequelize = new Sequelize(dbPacifico, user, pass, {
    host: host,
    dialect: 'mysql',
    logging: false
})


export const DataScienceDB:Sequelize = new Sequelize(dbDataScience, user, pass, {
    host: host,
    dialect: 'mysql',
    logging: false
})


