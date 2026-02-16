import { Department } from "../models/Department.model.js"
import { Employee } from "../models/Employee.model.js"
import { Organization } from "../models/Organization.model.js"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "../utils/s3EmployeePhotoConfig.js"

export const HandleAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ organizationID: req.ORGID }).populate("department", "name").select("firstname lastname email contactnumber designation employmentstatus startdate evaluationdate regularizationdate sss philhealth tin pagibig permanentaddress presentaddress birthdate birthplace department attendance notice salary leaverequest generaterequest isverified leaveCredits photo")
        return res.status(200).json({ success: true, data: employees, type: "AllEmployees" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}

export const HandleAllEmployeesIDS = async (req, res) => {
    try {
        const employees = await Employee.find({ organizationID: req.ORGID }).populate("department", "name").select("firstname lastname department")
        return res.status(200).json({ success: true, data: employees, type: "AllEmployeesIDS" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}

export const HandleEmployeeByHR = async (req, res) => {
    try {
        const { employeeId } = req.params
        const employee = await Employee.findOne({ _id: employeeId, organizationID: req.ORGID }).select("firstname lastname email contactnumber designation employmentstatus startdate evaluationdate regularizationdate sss philhealth tin pagibig permanentaddress presentaddress birthdate birthplace department attendance notice salary leaverequest generaterequest leaveCredits photo")

        if (!employee) {
            return res.status(404).json({ success: false, message: "employee not found" })
        }

        return res.status(200).json({ success: true, data: employee, type: "GetEmployee" })
    }
    catch (error) {
        return res.status(404).json({ success: false, error: error, message: "employee not found" })
    }
}

export const HandleEmployeeByEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({ _id: req.EMid, organizationID: req.ORGID }).select("firstname lastname email contactnumber designation employmentstatus startdate evaluationdate regularizationdate sss philhealth tin pagibig permanentaddress presentaddress birthdate birthplace department attendance notice salary leaverequest generaterequest leaveCredits photo")

        if (!employee) {
            return res.status(404).json({ success: false, message: "employee not found" })
        }

        return res.json({ success: true, message: "Employee Data Fetched Successfully", data: employee, type: "EmployeeProfile" })

    } catch (error) {
        return res.json({ success: false, message: "Internal Server Error", error: error, type: "EmployeeProfile" })
    }
}

export const HandleEmployeeUpdate = async (req, res) => {
    try {
        const { employeeId, updatedEmployee } = req.body

        const checkeemployee = await Employee.findById(employeeId)

        if (!checkeemployee) {
            return res.status(404).json({ success: false, message: "employee not found" })
        }

        const employee = await Employee.findByIdAndUpdate(employeeId, updatedEmployee, { new: true }).select("firstname lastname email contactnumber designation employmentstatus startdate evaluationdate regularizationdate sss philhealth tin pagibig permanentaddress presentaddress birthdate birthplace department leaveCredits photo")
        console.log("Employee updated successfullly:", employee.firstname, employee.lastname)
        return res.status(200).json({ success: true, data: employee, type: "EmployeeUpdate" })

    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}

export const HandleEmployeeDelete = async (req, res) => {
    try {
        const { employeeId } = req.params
        const employee = await Employee.findOne({ _id: employeeId })

        if (!employee) {
            return res.status(404).json({ success: false, message: "employee not found" })
        }

        // Delete employee photo from S3 if exists
        if (employee.photo) {
            try {
                // Extract S3 key from photo URL
                const photoUrl = new URL(employee.photo)
                const photoKey = photoUrl.pathname.substring(1) // Remove leading slash

                const deleteParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: photoKey,
                }

                await s3.send(new DeleteObjectCommand(deleteParams))
                console.log(`Deleted photo from S3: ${photoKey}`)
            } catch (s3Error) {
                // Log error but don't block employee deletion
                console.error("Error deleting photo from S3:", s3Error)
            }
        }

        const department = await Department.findById(employee.department)

        if (department) {
            department.employees.splice(department.employees.indexOf(employeeId), 1)
            await department.save()
        }

        const organization = await Organization.findById(employee.organizationID)

        if (!organization) {
            return res.status(404).json({ success: false, message: "organization not found" })
        }

        organization.employees.splice(organization.employees.indexOf(employeeId), 1)

        await organization.save()
        await employee.deleteOne()

        return res.status(200).json({ success: true, message: "Employee deleted successfully", type: "EmployeeDelete" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}

export const HandleEmployeePhotoUpload = async (req, res) => {
    try {
        const { employeeId } = req.params

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No photo file provided" })
        }

        const employee = await Employee.findOne({ _id: employeeId, organizationID: req.ORGID })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" })
        }

        // Delete old photo from S3 if exists
        if (employee.photo) {
            try {
                const photoUrl = new URL(employee.photo)
                const photoKey = photoUrl.pathname.substring(1)

                const deleteParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: photoKey,
                }

                await s3.send(new DeleteObjectCommand(deleteParams))
                console.log(`Deleted old photo from S3: ${photoKey}`)
            } catch (s3Error) {
                console.error("Error deleting old photo from S3:", s3Error)
            }
        }

        // Update employee with new photo URL
        const photoUrl = req.file.location
        employee.photo = photoUrl
        await employee.save()

        return res.status(200).json({
            success: true,
            message: "Photo uploaded successfully",
            data: { photo: photoUrl },
            type: "PhotoUpload"
        })
    } catch (error) {
        console.error("Error uploading photo:", error)
        return res.status(500).json({ success: false, error: error.message, message: "Internal server error" })
    }
}

export const HandleEmployeePhotoDelete = async (req, res) => {
    try {
        const { employeeId } = req.params

        const employee = await Employee.findOne({ _id: employeeId, organizationID: req.ORGID })

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" })
        }

        if (!employee.photo) {
            return res.status(400).json({ success: false, message: "Employee has no photo to delete" })
        }

        // Delete photo from S3
        try {
            const photoUrl = new URL(employee.photo)
            const photoKey = photoUrl.pathname.substring(1)

            const deleteParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: photoKey,
            }

            await s3.send(new DeleteObjectCommand(deleteParams))
            console.log(`Deleted photo from S3: ${photoKey}`)
        } catch (s3Error) {
            console.error("Error deleting photo from S3:", s3Error)
            return res.status(500).json({ success: false, message: "Failed to delete photo from S3" })
        }

        // Remove photo URL from employee record
        employee.photo = undefined
        await employee.save()

        return res.status(200).json({
            success: true,
            message: "Photo deleted successfully",
            type: "PhotoDelete"
        })
    } catch (error) {
        console.error("Error deleting photo:", error)
        return res.status(500).json({ success: false, error: error.message, message: "Internal server error" })
    }
}
