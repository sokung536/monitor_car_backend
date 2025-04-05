import db from "../database/db.js" // ใช้ import แทน require
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const secretKey = "cbca7c47d48613ad4b028ca6f8c9704834df796a59a419a5b5814b5c9d43ba92"

// ฟังก์ชันสำหรับสมัครสมาชิก
export const register = async (req, res) => {
	console.log("AuthController Register")
	const { firstName, lastName, email, password } = req.body
	try {
		const hashedPassword = await bcrypt.hash(password, 10) // เข้ารหัสรหัสผ่าน
		await db.execute("INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)", [firstName, lastName, email, hashedPassword])
		res.status(201).json({ message: "User registered successfully" })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Error registering user" })
	}
}

export const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		return res.status(400).json({ message: "Email and password are required" })
	}

	try {
		const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email])
		if (users.length === 0) {
			return res.status(401).json({ message: "Invalid email or password" })
		}

		const user = users[0]
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid email or password" })
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			secretKey, // ใช้ environment variable สำหรับ secret_key
			{ expiresIn: "1h" }
		)

		await db.execute("UPDATE users SET token = ? WHERE id = ?", [token, user.id])

		res.json({ token })
	} catch (error) {
		console.error("AuthController Login Error:", error)
		res.status(500).json({ message: "Error logging in" })
	}
}

export const logout = async (req, res) => {
	const { id } = req.body
	if (!id) {
		return res.status(400).json({ message: "user Id are required" })
	}

	try {
		const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [id])
		if (users.length === 0) {
			return res.status(401).json({ message: "Invalid user id" })
		}

		const user = users[0]
		if (user.id) {
			await db.execute("UPDATE users SET token = '' WHERE id = ?", [user.id])
		}

		res.status(200).json({ message: "Logout Suscess!" })
	} catch (error) {
		console.error("AuthController Login Error:", error)
		res.status(500).json({ message: "Error logging in" })
	}
}

export const authenticateToken = (req, res) => {
	const token = req.headers["authorization"]
	if (!token) return res.status(401).json({ message: "No token provided" })

	jwt.verify(token, secretKey, async (err, user) => {
		if (err) return res.status(403).json({ message: "Invalid token" })

		if (!user.id) {
			return res.status(res.status(403).json({ message: "Invalid token" }))
		}
		const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [user.id])
		const userLogin = users[0]
		if (userLogin) {
			if (userLogin.token === token) {
				return res.status(200).json({ id: userLogin.id, firstName: userLogin.firstName, lastName: userLogin.lastName, email: userLogin.email })
			}
			return res.status(403).json({ message: "Invalid token" })
		}
		return res.status(403).json({ message: "Invalid token" })
	})
}
