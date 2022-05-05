//! only for database connection

const db = require("oracledb")
let connection

async function startConn() {
	const connectString =
		"(DESCRIPTION = (LOAD_BALANCE = ON)(ADDRESS = (PROTOCOL = TCP)(HOST = LOCALHOST)(PORT = 1521))(ADDRESS = (PROT0COL = TCP)(HOST = server2)(PORT = 1521))(CONNECT_DATA = (SERVICE_NAME = XE)(FAILOVER_MODE = (TYPE=SELECT)(METHOD=BASIC))))"
	try {
		connection = await db.getConnection({
			user: "system",
			password: "root",
			tns: connectString,
		})
		console.warn("Connection Started!")
	} catch (err) {
		console.error(err)
	}
}

async function execute(query) {
	try {
		return await connection.execute(query)
	} catch (err) {
		console.error(err)
	}
}

async function stopConn() {
	if (connection) {
		try {
			await connection.close()
			console.warn("Connection Stopped!")
		} catch (err) {
			console.error(err)
		}
	}
}

module.exports = {
	startConn,
	execute,
	stopConn,
}
