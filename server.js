// yarn add express sqlite3 helmet morgan cors knex bcryptjs jsonwebtoken dotenv
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
const { restricted } = require('./middleware/middleware');

const server = express();
const db = knex(knexConfig.development);

server.use(helmet());
server.use(cors());
server.use(morgan('dev'));
server.use(express.json());

server.get('/', (req, res) => {
	res.send('Sanity Check');
});

server.post('/api/register', async (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 8);
	user.password = hash;
	console.log(user);

	try {
		console.log('try', user);
		const user = await db('users').insert(user);
		res.status(201).json({ message: 'Successfully created user', user });
	} catch {
		res.status(400).json({ message: 'unable to process' });
	}
});

server.get('/api/users', async (req, res) => {
	try {
		const users = await db('users');
		res.status(200).json({ message: 'Success', users });
	} catch {
		res.status(500).json({ message: 'Unexpected error' });
	}
});

module.exports = server;
