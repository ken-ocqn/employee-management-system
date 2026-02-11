import { Department } from "../models/Department.model.js"
import { Employee } from "../models/Employee.model.js"
import { HumanResources } from "../models/HR.model.js"
import { Notice } from "../models/Notice.model.js"
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3 } from "../utils/s3NoticeConfig.js"

export const HandleCreateNotice = async (req, res) => {
    try {
        const { title, content, audience, department, employee } = req.body
        const HRID = req.HRid
        const departmentID = department
        const employeeID = employee

        if (audience === "Department-Specific") {

            if (!title || !content || !audience || !departmentID || !HRID) {
                return res.status(400).json({ success: false, message: "All fields must be provided" })
            }

            const department = await Department.findById(departmentID)

            if (!department) {
                return res.status(404).json({ success: false, message: "Department not found" })
            }

            const checknotice = await Notice.findOne({
                title: title,
                content: content,
                audience: audience,
                department: departmentID,
                createdby: HRID
            })

            if (checknotice) {
                return res.status(400).json({ success: false, message: "Specific Notice Record Already Exists" })
            }

            const notice = await Notice.create({
                title: title,
                content: content,
                audience: audience,
                department: departmentID,
                createdby: HRID,
                organizationID: req.ORGID,
                attachmentUrl: req.file ? req.file.location : null,
                attachmentName: req.file ? req.file.originalname : null,
                attachmentType: req.file ? req.file.mimetype : null
            })

            department.notice.push(notice._id)
            await department.save()

            return res.status(200).json({ success: true, message: "Specific Notice Created Successfully", data: notice })
        }

        if (audience === "Employee-Specific") {
            if (!title || !content || !audience || !employeeID || !HRID) {
                return res.status(400).json({ success: false, message: "All fields must be provided" })
            }

            const employee = await Employee.findById(employeeID)

            if (!employee) {
                return res.status(404).json({ success: false, message: "Employee not found" })
            }

            const checknotice = await Notice.findOne({
                title: title,
                content: content,
                audience: audience,
                employee: employeeID,
                createdby: HRID
            })

            if (checknotice) {
                return res.status(400).json({ success: false, message: "Specific Notice Record Already Exists" })
            }

            const notice = await Notice.create({
                title: title,
                content: content,
                audience: audience,
                employee: employeeID,
                createdby: HRID,
                organizationID: req.ORGID,
                attachmentUrl: req.file ? req.file.location : null,
                attachmentName: req.file ? req.file.originalname : null,
                attachmentType: req.file ? req.file.mimetype : null
            })

            employee.notice.push(notice._id)
            await employee.save()

            return res.status(200).json({ success: true, message: "Specific Notice Created Successfully", data: notice })
        }

    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}


export const HandleAllNotice = async (req, res) => {
    try {
        const notices = await Notice.find({ organizationID: req.ORGID }).populate("employee department createdby", "firstname lastname department name description")
        const data = {
            department_notices: [],
            employee_notices: []
        }
        for (let index = 0; index < notices.length; index++) {
            if (notices[index].department) {
                data.department_notices.push(notices[index])
            }
            else if (notices[index].employee) {
                data.employee_notices.push(notices[index])
            }
        }

        return res.status(200).json({ success: true, message: "All notice records retrieved successfully", data: data })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}

export const HandleNotice = async (req, res) => {
    try {
        const { noticeID } = req.params

        const notice = await Notice.findOne({ _id: noticeID, organizationID: req.ORGID })

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" })
        }

        await notice.populate("employee department createdby", "firstname lastname department name description")
        return res.status(200).json({ success: true, message: "Notice record retrieved successfully", data: notice })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}


export const HandleDeleteNotice = async (req, res) => {
    try {
        const { noticeID } = req.params

        const notice = await Notice.findById(noticeID)

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice Record Not Found" })
        }

        if (notice.employee) {
            const employee = await Employee.findById(notice.employee)
            employee.notice.splice(employee.notice.indexOf(noticeID), 1)

            // Delete S3 file if exists
            if (notice.attachmentUrl) {
                try {
                    const key = notice.attachmentUrl.split('.com/')[1];
                    const deleteCommand = new DeleteObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: key
                    });
                    await s3.send(deleteCommand);
                } catch (s3Error) {
                    console.error('Error deleting S3 file:', s3Error);
                    // Continue with notice deletion even if S3 deletion fails
                }
            }

            await employee.save()
            await notice.deleteOne()

            return res.status(200).json({ success: true, message: "Notice deleted successfully" })
        }

        if (notice.department) {
            const department = await Department.findById(notice.department)
            department.notice.splice(department.notice.indexOf(noticeID), 1)

            // Delete S3 file if exists
            if (notice.attachmentUrl) {
                try {
                    const key = notice.attachmentUrl.split('.com/')[1];
                    const deleteCommand = new DeleteObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: key
                    });
                    await s3.send(deleteCommand);
                } catch (s3Error) {
                    console.error('Error deleting S3 file:', s3Error);
                    // Continue with notice deletion even if S3 deletion fails
                }
            }

            await department.save()
            await notice.deleteOne()

            return res.status(200).json({ success: true, message: "Notice deleted successfully" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "internal server error", error: error })
    }
}

// Get notices for employee (employee-specific or department-specific)
export const HandleGetEmployeeNotices = async (req, res) => {
    try {
        const employeeID = req.EMid; // Employee ID from token

        // Fetch employee to get their department
        const employee = await Employee.findById(employeeID).select('department');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // Find notices that are either:
        // 1. Employee-specific and targeted to this employee
        // 2. Department-specific and targeted to this employee's department
        const notices = await Notice.find({
            $or: [
                {
                    audience: "Employee-Specific",
                    employee: employeeID
                },
                {
                    audience: "Department-Specific",
                    department: employee.department
                }
            ]
        })
            .populate('department', 'name')
            .populate('employee', 'firstname lastname')
            .populate('createdby', 'firstname lastname')
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            message: "Notices fetched successfully",
            data: notices
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Handler to get presigned URL for notice attachment preview
export const HandleGetNoticeAttachment = async (req, res) => {
    try {
        const { noticeID } = req.params

        const notice = await Notice.findOne({ _id: noticeID, organizationID: req.ORGID })

        if (!notice) {
            return res.status(404).json({ success: false, message: "Notice not found" })
        }

        if (!notice.attachmentUrl) {
            return res.status(404).json({ success: false, message: "No attachment found for this notice" })
        }

        // Extract key from S3 URL
        const key = notice.attachmentUrl.split('.com/')[1];

        // Generate presigned URL valid for 1 hour
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key
        });

        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return res.status(200).json({
            success: true,
            message: "Attachment URL generated successfully",
            data: {
                url: presignedUrl,
                name: notice.attachmentName,
                type: notice.attachmentType
            }
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}
