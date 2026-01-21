import express from 'express'
import { HandleGetOrganizationDetails, HandleUpdateDefaultLeaveCredits } from '../controllers/Organization.controller.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'

const router = express.Router()

router.get("/", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleGetOrganizationDetails)
router.patch("/leave-credits", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateDefaultLeaveCredits)

export default router
