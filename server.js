// yarn add express helmet morgan cors knex bcryptjs jsonwebtoken dotenv
// yarn add nodemon --dev
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const server = express();
const db = knex(knexConfig.development);

server.use(helmet());
server.use(cors());
server.use(morgan('dev'));
server.use(express.json());

server.get('/', (req, res) => {
	res.send('Sanity Check');
});

module.exports = server;
