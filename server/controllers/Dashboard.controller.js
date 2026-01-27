import mongoose from "mongoose"
import { Employee } from "../models/Employee.model.js"
import { Department } from "../models/Department.model.js"
import { Leave } from "../models/Leave.model.js"
import { Salary } from "../models/Salary.model.js"
import { Notice } from "../models/Notice.model.js"
import { GenerateRequest } from "../models/GenerateRequest.model.js"
import { Balance } from "../models/Balance.model.js"

export const HandleHRDashboard = async (req, res) => {
    try {
        const employeesTotal = await Employee.countDocuments({ organizationID: req.ORGID })
        const departments = await Department.countDocuments({ organizationID: req.ORGID })
        const leavesTotal = await Leave.countDocuments({ organizationID: req.ORGID })
        const requests = await GenerateRequest.countDocuments({ organizationID: req.ORGID })
        const balance = await Balance.find({ organizationID: req.ORGID })
        const notices = await Notice.find({ organizationID: req.ORGID }).sort({ createdAt: -1 }).limit(10).populate("createdby", "firstname lastname")

        // Enhanced Data
        const employeeStatusBreakdown = await Employee.aggregate([
            { $match: { organizationID: new mongoose.Types.ObjectId(req.ORGID) } },
            { $group: { _id: "$employmentstatus", count: { $sum: 1 } } }
        ])

        const leaveTypeBreakdown = await Leave.aggregate([
            { $match: { organizationID: new mongoose.Types.ObjectId(req.ORGID) } },
            { $group: { _id: "$leaveType", count: { $sum: 1 } } }
        ])

        return res.status(200).json({
            success: true,
            data: {
                employees: employeesTotal,
                departments: departments,
                leaves: leavesTotal,
                requests: requests,
                balance: balance,
                notices: notices,
                stats: {
                    employmentStatus: employeeStatusBreakdown,
                    leaveTypes: leaveTypeBreakdown
                }
            }
        })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}