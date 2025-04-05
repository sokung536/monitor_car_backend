import express from "express"
import bodyParser from "body-parser"
import authRoutes from "./routes/authRoutes.js" // ใช้ `import` แทน `require`
import db from "./database/db.js" // ใช้ `import` แทน `require`
import config from "./config/config.js" //
import { authenticateToken } from "./controllers/authController.js"

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Connect to Database
db
	.getConnection()
	.then(() => console.log("Connected to MySQL"))
	.catch((err) => console.error("Database connection failed:", err))

// Routes
app.use("/api", authRoutes)

// Default Route
app.get("/", (req, res) => {
	res.send("Welcome to the API")
})

// 404 Handler
app.use((req, res) => {
	res.status(404).send({ message: "Route not found" })
})

// ตัวอย่างเส้นทาง API
app.post("/api/register", (req, res) => {
	res.status(201).json({ message: "User registered successfully" })
})

// ตัวอย่างเส้นทาง API
app.post("/api/login", (req, res) => {
	res.status(201).json({ message: "User registered successfully" })
})
// Start the server

app.get("/api/protected", authenticateToken, (req, res) => {
	res.json({ message: "This is protected data", user: req.user })
})

app.listen(config.app.port, () => {
	console.log(`Server is running on http://localhost:${config.app.port}`)
})
