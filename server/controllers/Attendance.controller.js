import { Attendance } from "../models/Attendance.model.js"
import { Employee } from "../models/Employee.model.js"

export const HandleInitializeAttendance = async (req, res) => {
    try {
        const { employeeID } = req.body

        if (!employeeID) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const employee = await Employee.findOne({ _id: employeeID, organizationID: req.ORGID })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" })
        }

        // Check if employee has an attendance reference
        if (employee.attendance) {
            // Verify if the attendance record actually exists
            const existingAttendance = await Attendance.findById(employee.attendance)

            if (existingAttendance) {
                // Attendance record exists, return it
                return res.status(200).json({ success: true, message: "Attendance Log already exists", data: existingAttendance })
            } else {
                // Stale reference - attendance ID exists but record doesn't
                // Clear the stale reference so we can create a new one
                console.log(`Removing stale attendance reference ${employee.attendance} for employee ${employeeID}`)
                employee.attendance = null
            }
        }

        // Create new attendance record
        const currentdate = new Date().toISOString().split("T")[0]
        const attendancelog = {
            logdate: currentdate,
            logstatus: "Not Specified"
        }

        const newAttendance = await Attendance.create({
            employee: employeeID,
            status: "Not Specified",
            organizationID: req.ORGID
        })

        newAttendance.attendancelog.push(attendancelog)
        employee.attendance = newAttendance._id

        await employee.save()
        await newAttendance.save()

        return res.status(200).json({ success: true, message: "Attendance Log Initialized Successfully", data: newAttendance })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}

export const HandleAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ organizationID: req.ORGID })
            .populate({
                path: "employee",
                select: "firstname lastname department",
                populate: {
                    path: "department",
                    select: "name"
                }
            })
        return res.status(200).json({ success: true, message: "All attendance records retrieved successfully", data: attendance })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}

export const HandleAttendance = async (req, res) => {
    try {
        const { attendanceID } = req.params

        if (!attendanceID) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID }).populate("employee", "firstname lastname department")

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance not found" })
        }

        return res.status(200).json({ success: true, message: "Attendance record retrieved successfully", data: attendance })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}

export const HandleUpdateAttendance = async (req, res) => {
    try {
        const { attendanceID, status, currentdate } = req.body

        const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID })

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance not found" })
        }

        const FindDate = attendance.attendancelog.find((item) => item.logdate.toISOString().split("T")[0] === currentdate)

        if (!FindDate) {
            const newLog = {
                logdate: currentdate,
                logstatus: status
            }
            attendance.attendancelog.push(newLog)
        }
        else {
            FindDate.logstatus = status
        }

        await attendance.save()
        return res.status(200).json({ success: true, message: "Attendance status updated successfully", data: attendance })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}

export const HandleDeleteAttendance = async (req, res) => {
    try {
        const { attendanceID } = req.params
        const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID })

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance not found" })
        }

        const employee = await Employee.findById(attendance.employee)
        employee.attendance = null

        await employee.save()
        await attendance.deleteOne()

        return res.status(200).json({ success: true, message: "Attendance record deleted successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}

export const HandleAttendanceLogin = async (req, res) => {
    try {
        const { attendanceID, latitude, longitude, accuracy, address } = req.body

        if (!attendanceID || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ success: false, message: "Attendance ID and GPS coordinates are required" })
        }

        const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID })

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance not found" })
        }

        const currentdate = new Date().toISOString().split("T")[0]
        const currentTime = new Date()

        // Find today's log entry
        const todayLog = attendance.attendancelog.find((item) => item.logdate.toISOString().split("T")[0] === currentdate)

        if (todayLog) {
            // Update existing log
            if (todayLog.loginTime) {
                return res.status(400).json({ success: false, message: "Already logged in today" })
            }
            todayLog.logstatus = "Present"
            todayLog.loginTime = currentTime
            todayLog.loginLocation = {
                latitude,
                longitude,
                accuracy: accuracy || null,
                address: address || null
            }
        } else {
            // Create new log entry
            const newLog = {
                logdate: currentdate,
                logstatus: "Present",
                loginTime: currentTime,
                loginLocation: {
                    latitude,
                    longitude,
                    accuracy: accuracy || null,
                    address: address || null
                }
            }
            attendance.attendancelog.push(newLog)
        }

        attendance.status = "Present"
        await attendance.save()

        return res.status(200).json({ success: true, message: "Attendance login successful", data: attendance })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}

export const HandleAttendanceLogout = async (req, res) => {
    try {
        const { attendanceID, latitude, longitude, accuracy, address } = req.body

        if (!attendanceID || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ success: false, message: "Attendance ID and GPS coordinates are required" })
        }

        const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID })

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance not found" })
        }

        const currentdate = new Date().toISOString().split("T")[0]
        const currentTime = new Date()

        // Find today's log entry
        const todayLog = attendance.attendancelog.find((item) => item.logdate.toISOString().split("T")[0] === currentdate)

        if (!todayLog) {
            return res.status(400).json({ success: false, message: "No login record found for today" })
        }

        if (!todayLog.loginTime) {
            return res.status(400).json({ success: false, message: "Please login first before logging out" })
        }

        if (todayLog.logoutTime) {
            return res.status(400).json({ success: false, message: "Already logged out today" })
        }

        todayLog.logoutTime = currentTime
        todayLog.logoutLocation = {
            latitude,
            longitude,
            accuracy: accuracy || null,
            address: address || null
        }

        await attendance.save()

        return res.status(200).json({ success: true, message: "Attendance logout successful", data: attendance })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}