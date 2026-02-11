import express from "express"
import { HandleCreateNotice, HandleAllNotice, HandleNotice, HandleDeleteNotice, HandleGetNoticeAttachment, HandleGetEmployeeNotices } from "../controllers/Notice.controller.js"
import { VerifyhHRToken, VerifyEmployeeToken, VerifyEitherToken } from "../middlewares/Auth.middleware.js"
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"
import { uploadNoticeAttachment } from "../utils/s3NoticeConfig.js"

const router = express.Router()

// HR Admin routes
router.post("/create-notice", VerifyhHRToken, RoleAuthorization("HR-Admin"), uploadNoticeAttachment.single('attachment'), HandleCreateNotice)

router.get("/all/", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllNotice)

router.get("/:noticeID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleNotice)

router.delete("/delete-notice/:noticeID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteNotice)

// Employee routes
router.get("/employee/my-notices", VerifyEmployeeToken, HandleGetEmployeeNotices)

// Shared routes (both HR and Employee can access)
router.get("/attachment/:noticeID", VerifyEitherToken, HandleGetNoticeAttachment)


export default router