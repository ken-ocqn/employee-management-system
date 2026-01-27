import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Organization } from "../models/Organization.model.js";
import { HumanResources } from "../models/HR.model.js";

export const syncOrganizationDefaults = async () => {
    try {
        const dbName = mongoose.connection.name;
        console.log(`Running defaults migration on database: ${dbName}...`);

        // 1. Ensure Default Organization exists
        let defaultOrg = await Organization.findOne({ name: "CinePop" });
        if (!defaultOrg) {
            console.log("Default organization 'CinePop' not found. Creating...");
            defaultOrg = await Organization.create({
                name: "CinePop",
                description: "Initial CinePop Organization",
                OrganizationURL: "https://cinepop.film",
                OrganizationMail: "admin@cinepop.film",
                defaultLeaveCredits: {
                    sickLeave: 1.25,
                    vacationLeave: 1.25,
                    emergencyLeave: 2,
                    maternityLeave: 105,
                    paternityLeave: 7
                }
            });
            console.log("Default organization 'CinePop' created.");
        }

        // 2. Ensure Default HR Admin exists
        const defaultHREmail = "admin@cinepop.film";
        let defaultHR = await HumanResources.findOne({ email: defaultHREmail });
        if (!defaultHR) {
            console.log(`Default HR admin '${defaultHREmail}' not found. Creating...`);
            const hashedPassword = await bcrypt.hash("CPPhr@dm!n2026!", 10);
            defaultHR = await HumanResources.create({
                firstname: "System",
                lastname: "Admin",
                email: defaultHREmail,
                password: hashedPassword,
                contactnumber: "0000000000",
                role: "HR-Admin",
                isverified: true,
                organizationID: defaultOrg._id
            });

            // Link HR to Organization
            if (!defaultOrg.HRs.includes(defaultHR._id)) {
                defaultOrg.HRs.push(defaultHR._id);
                await defaultOrg.save();
            }
            console.log(`Default HR admin '${defaultHREmail}' created and activated.`);
        } else if (!defaultHR.isverified) {
            // Ensure the default admin is activated
            defaultHR.isverified = true;
            await defaultHR.save();
            console.log(`Default HR admin '${defaultHREmail}' activated.`);
        }

        // 3. Sync Leave Credits for all existing organizations
        const organizations = await Organization.find({});
        let updatedCount = 0;
        for (let org of organizations) {
            if (!org.defaultLeaveCredits || Object.keys(org.defaultLeaveCredits).length === 0) {
                org.defaultLeaveCredits = {
                    sickLeave: 1.25,
                    vacationLeave: 1.25,
                    emergencyLeave: 2,
                    maternityLeave: 105,
                    paternityLeave: 7
                };
                await org.save();
                console.log(`Updated leave credits for organization: ${org.name}`);
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            console.log(`Migration completed: ${updatedCount} organizations updated with leave credits.`);
        } else {
            console.log(`Migration completed: No existing organizations required leave credit updates.`);
        }
    } catch (error) {
        console.error("Migration failed:", error);
    }
};
