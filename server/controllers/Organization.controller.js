import { Organization } from "../models/Organization.model.js"

export const HandleGetOrganizationDetails = async (req, res) => {
    try {
        const organization = await Organization.findById(req.ORGID)
        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" })
        }
        return res.status(200).json({ success: true, data: organization })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleUpdateDefaultLeaveCredits = async (req, res) => {
    try {
        const { defaultLeaveCredits } = req.body
        if (!defaultLeaveCredits) {
            return res.status(400).json({ success: false, message: "Missing defaultLeaveCredits" })
        }

        const organization = await Organization.findByIdAndUpdate(
            req.ORGID,
            { defaultLeaveCredits },
            { new: true }
        )

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization not found" })
        }

        return res.status(200).json({ success: true, message: "Default leave credits updated successfully", data: organization })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
