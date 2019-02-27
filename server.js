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
const secret = process.env.JWT_SECRET;

const server = express();
const db = knex(knexConfig.development);

server.use(helmet());
server.use(cors());
server.use(morgan('dev'));
server.use(express.json());

// ================================ Generate Token
function generateToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		dept: user.department,
	};
	const options = {
		expiresIn: '1d',
	};
	return jwt.sign(payload, secret, options);
}

server.get('/', (req, res) => {
	res.send('Sanity Check');
});

server.post('/api/register', async (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 8);
	user.password = hash;
	console.log(user);
	if (user.username && user.password && user.department) {
		try {
			const result = await db('users').insert(user);
			res.status(201).json({ message: 'Successfully created user', result });
		} catch {
			res.status(400).json({ message: 'unable to process' });
		}
	} else {
		res.status(404).json({
			message: 'Make sure username, password, and department are included',
		});
	}
});

server.post('/api/login', async (req, res) => {
	let { username, password } = req.body;

	const user = await db('users')
		.where('username', username)
		.first();
	if (user && bcrypt.compareSync(password, user.password)) {
		try {
			const token = generateToken(user);
			res.status(200).json({ message: `Welcome ${user.username}!`, token });
		} catch {
			res.status(404).json({ message: 'unable to find that user' });
		}
	} else {
		res.status(500).json({ message: 'login server issue' });
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
