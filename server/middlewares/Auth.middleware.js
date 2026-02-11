import jwt from 'jsonwebtoken'
import { TokenBlacklist } from "../models/TokenBlacklist.model.js"

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

// Middleware that accepts either Employee or HR token
export const VerifyEitherToken = async (req, res, next) => {
    const hrToken = req.cookies.HRtoken
    const empToken = req.cookies.EMtoken

    // Try HR token first
    if (hrToken) {
        try {
            const isBlacklisted = await TokenBlacklist.findOne({ token: hrToken })
            if (isBlacklisted) {
                res.clearCookie("HRtoken")
                return res.status(401).json({ success: false, message: "Session expired, please login again", gologin: true })
            }

            const decoded = jwt.verify(hrToken, process.env.JWT_SECRET)
            if (decoded) {
                req.HRid = decoded.HRid
                req.ORGID = decoded.ORGID
                req.Role = decoded.HRrole
                req.userType = 'HR'
                return next()
            }
        } catch (error) {
            // HR token invalid, try employee token
        }
    }

    // Try Employee token
    if (empToken) {
        try {
            const decoded = jwt.verify(empToken, process.env.JWT_SECRET)
            if (decoded) {
                req.EMid = decoded.EMid
                req.EMrole = decoded.EMrole
                req.ORGID = decoded.ORGID
                req.userType = 'Employee'
                return next()
            }
        } catch (error) {
            // Employee token also invalid
        }
    }

    // No valid token found
    return res.status(401).json({ success: false, message: "Unauthorized access", gologin: true })
}

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