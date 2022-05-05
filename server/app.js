const db = require("./db")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const PORT = 3005

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(PORT, () => {
	console.log(`Listening on Port ${PORT}`)
})

app.post("/api/getData", async (req, res) => {
	const query = req.body.query
	console.log(`query string :- ${query}`)
	await db.startConn()
	const result = await db.execute(query)
	// console.log(result)
	res.send(result)
	await db.stopConn()
})
