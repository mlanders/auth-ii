module.exports = {
	development: {
		client: 'sqlite3',
		connection: {
			filename: './database.db3',
		},
		useNullAsDefault: true,
	},
	production: {
		client: 'sqlite3',
		useNullAsDefault: true,
		connection: {
			filename: './data/shoutouts.db3',
		},
		pool: {
			afterCreate: (conn, done) => {
				conn.run('PRAGMA foreign_keys = ON', done);
			},
		},
		migrations: {
			directory: './migrations',
			tableName: 'knex_migrations',
		},
	},
};
