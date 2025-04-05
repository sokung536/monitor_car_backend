import jwt from "jsonwebtoken"

const token = (req, res, next) => {
	const token = req.headers["authorization"]
	if (!token) {
		return res.status(403).json({ message: "No token provided" })
	}
	try {
		const decoded = jwt.verify(token, "secret_key") // ใช้ secret key
		req.user = decoded // เพิ่มข้อมูลผู้ใช้ใน request object
		next() // เรียก middleware ถัดไป
	} catch (error) {
		res.status(401).json({ message: "Invalid token" })
	}
}

export default token
