import { Employee } from "../models/Employee.model.js"
import { HumanResources } from "../models/HR.model.js"
import { Leave } from "../models/Leave.model.js"


export const HandleCreateLeave = async (req, res) => {
    try {
        const { employeeID, startdate, enddate, title, reason, leaveType } = req.body

        if (!employeeID || !startdate || !enddate || !title || !reason || !leaveType) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const employee = await Employee.findOne({ _id: employeeID, organizationID: req.ORGID })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" })
        }

        const checkleave = await Leave.findOne({
            employee: employeeID,
            startdate: new Date(startdate),
            enddate: new Date(enddate)
        })


        if (checkleave) {
            return res.status(400).json({ success: false, message: "Leave record already exists for this employee" })
        }

        const start = new Date(startdate)
        const end = new Date(enddate)
        const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1

        if (dayCount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid date range" })
        }

        // Credit check
        if (leaveType !== "Unpaid") {
            const creditField = leaveType.charAt(0).toLowerCase() + leaveType.slice(1) + "Leave"
            if (employee.leaveCredits[creditField] < dayCount) {
                return res.status(400).json({ success: false, message: `Insufficient ${leaveType} leave credits. Available: ${employee.leaveCredits[creditField]}` })
            }
        }

        const leave = await Leave.create({
            employee: employeeID,
            startdate: start,
            enddate: end,
            title,
            reason,
            leaveType,
            dayCount,
            organizationID: req.ORGID
        })

        employee.leaverequest.push(leave._id)
        await employee.save()

        return res.status(200).json({ success: true, message: "Leave request created successfully", data: leave })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ organizationID: req.ORGID }).populate("employee approvedby", "firstname lastname department")
        return res.status(200).json({ success: true, message: "All leave records retrieved successfully", data: leaves })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const HandleLeave = async (req, res) => {
    try {
        const { leaveID } = req.params
        const leave = await Leave.findOne({ _id: leaveID, organizationID: req.ORGID }).populate("employee approvedby", "firstname lastname department")

        if (!leave) {
            return res.status(404).json({ success: false, message: "Leave record not found" })
        }

        return res.status(200).json({ success: true, message: "Leave record retrieved successfully", data: leave })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const HandleUpdateLeaveByEmployee = async (req, res) => {
    try {
        const { leaveID, startdate, enddate, title, reason } = req.body

        if (!leaveID || !startdate || !enddate || !title || !reason) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const leave = await Leave.findOne({ _id: leaveID, organizationID: req.ORGID })

        if (!leave) {
            return res.status(404).json({ success: false, message: "Leave record not found" })
        }

        leave.startdate = new Date(startdate)
        leave.enddate = new Date(enddate)
        leave.title = title
        leave.reason = reason

        await leave.save()

        return res.status(200).json({ success: true, message: "Leave record updated successfully", data: leave })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const HandleUpdateLeavebyHR = async (req, res) => {
    try {
        const { leaveID } = req.params
        const { status } = req.body
        const HRID = req.HRid

        if (!leaveID || !status || !HRID) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const leave = await Leave.findOne({ _id: leaveID, organizationID: req.ORGID })
        const HR = await HumanResources.findById(HRID)

        if (!leave) {
            return res.status(404).json({ success: false, message: "Leave record not found" })
        }

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR not found" })
        }

        const oldStatus = leave.status
        leave.status = status
        leave.approvedby = HRID

        await leave.save()

        // Handle credit deduction/restoration
        if (leave.leaveType !== "Unpaid") {
            const employee = await Employee.findById(leave.employee)
            const creditField = leave.leaveType.charAt(0).toLowerCase() + leave.leaveType.slice(1) + "Leave"

            if (status === "Approved" && oldStatus !== "Approved") {
                employee.leaveCredits[creditField] -= leave.dayCount
                await employee.save()
            } else if (status !== "Approved" && oldStatus === "Approved") {
                employee.leaveCredits[creditField] += leave.dayCount
                await employee.save()
            }
        }

        return res.status(200).json({ success: true, message: "Leave record updated successfully", data: leave })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const HandleGetLeavesByEmployee = async (req, res) => {
    try {
        const leaves = await Leave.find({ employee: req.EMid, organizationID: req.ORGID }).populate("employee approvedby", "firstname lastname department")
        return res.status(200).json({ success: true, message: "Employee leave records retrieved successfully", data: leaves })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const HandleDeleteLeave = async (req, res) => {
    try {
        const { leaveID } = req.params
        const leave = await Leave.findOne({ _id: leaveID, organizationID: req.ORGID })

        if (!leave) {
            return res.status(404).json({ success: false, message: "Leave record not found" })
        }

        const employee = await Employee.findById(leave.employee)
        const index = employee.leaverequest.indexOf(leaveID)
        employee.leaverequest.splice(index, 1)

        // Restore credits if an approved leave is deleted
        if (leave.status === "Approved" && leave.leaveType !== "Unpaid") {
            const creditField = leave.leaveType.charAt(0).toLowerCase() + leave.leaveType.slice(1) + "Leave"
            employee.leaveCredits[creditField] += leave.dayCount
        }

        await employee.save()
        await leave.deleteOne()

        return res.status(200).json({ success: true, message: "Leave record deleted successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}