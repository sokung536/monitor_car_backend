import express from "express"
import { register, login, authenticateToken, logout } from "../controllers/authController.js" // นำเข้า register และ login

const router = express.Router()

// ใช้งานฟังก์ชัน register และ login จาก authController.js
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/authenticateToken", authenticateToken)

export default router // ใช้ `export default` แทน `module.exports`
