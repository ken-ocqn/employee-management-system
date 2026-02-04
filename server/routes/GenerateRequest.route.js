import express from 'express'
import { HandleAllGenerateRequest, HandleCreateGenerateRequest, HandleDeleteRequest, HandleGenerateRequest, HandleGetRequestsByEmployee, HandleUpdateRequestByEmployee, HandleUpdateRequestByHR, HandleUpdateAttachment } from '../controllers/GenerateRequest.controller.js'
import { VerifyEmployeeToken, VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { upload } from '../utils/s3Config.js'

const router = express.Router()


router.post("/create-request", VerifyEmployeeToken, HandleCreateGenerateRequest)

router.get("/my-requests", VerifyEmployeeToken, HandleGetRequestsByEmployee)

router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllGenerateRequest)

router.get("/:requestID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleGenerateRequest)

router.patch("/update-request-content", VerifyEmployeeToken, HandleUpdateRequestByEmployee)

router.post("/update-request-status", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateRequestByHR)

router.post("/update-attachment/:requestID", VerifyhHRToken, RoleAuthorization("HR-Admin"), upload.single('file'), HandleUpdateAttachment)

router.delete("/delete-request/:requestID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteRequest)

export default router



