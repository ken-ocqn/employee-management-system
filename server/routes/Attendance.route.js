import express from 'express'
import { HandleInitializeAttendance, HandleAllAttendance, HandleAttendance, HandleUpdateAttendance, HandleDeleteAttendance, HandleAttendanceLogin, HandleAttendanceLogout } from '../controllers/Attendance.controller.js'
import { VerifyEmployeeToken, VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'

const router = express.Router()

router.post("/initialize-attendance", VerifyEmployeeToken, HandleInitializeAttendance)

router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllAttendance)

router.get("/:attendanceID", VerifyEmployeeToken, HandleAttendance)

router.patch("/update-attendance", VerifyEmployeeToken, HandleUpdateAttendance)

router.delete("/delete-attendance/:attendanceID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteAttendance)

router.post("/login", VerifyEmployeeToken, HandleAttendanceLogin)

router.post("/logout", VerifyEmployeeToken, HandleAttendanceLogout)

export default router