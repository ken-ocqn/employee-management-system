import express from 'express'
import { HandleAllLeaves, HandleCreateLeave, HandleDeleteLeave, HandleGetLeavesByEmployee, HandleLeave, HandleUpdateLeaveByEmployee, HandleUpdateLeavebyHR } from '../controllers/Leave.controller.js'
import { VerifyEmployeeToken, VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'


const router = express.Router()

router.post("/create-leave", VerifyEmployeeToken, HandleCreateLeave)
router.get("/my-leaves", VerifyEmployeeToken, HandleGetLeavesByEmployee)

router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllLeaves)

router.get("/:leaveID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleLeave)

router.patch("/employee-update-leave", VerifyEmployeeToken, HandleUpdateLeaveByEmployee)

router.patch("/hr/update/:leaveID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateLeavebyHR)

router.delete("/delete-leave/:leaveID", VerifyEmployeeToken, HandleDeleteLeave)

export default router