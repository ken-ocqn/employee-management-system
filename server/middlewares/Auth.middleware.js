import jwt from 'jsonwebtoken'

export const VerifyEmployeeToken = (req, res, next) => {
    const token = req.cookies.EMtoken
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized access", gologin: true })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            res.clearCookie("EMtoken")
            return res.status(403).json({ success: false, message: "unauthenticated employee", gologin: true })
        }
        req.EMid = decoded.EMid
        req.EMrole = decoded.EMrole
        req.ORGID = decoded.ORGID
        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error", error: error })
    }
}

import { TokenBlacklist } from "../models/TokenBlacklist.model.js"

export const VerifyhHRToken = async (req, res, next) => {
    const token = req.cookies.HRtoken
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized access", gologin: true })
    }
    try {
        const isBlacklisted = await TokenBlacklist.findOne({ token })
        if (isBlacklisted) {
            res.clearCookie("HRtoken")
            return res.status(401).json({ success: false, message: "Session expired, please login again", gologin: true })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            res.clearCookie("HRtoken")
            return res.status(403).json({ success: false, message: "unauthenticated employee", gologin: true })
        }
        req.HRid = decoded.HRid
        req.ORGID = decoded.ORGID
        req.Role = decoded.HRrole
        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error", error: error })
    }
}