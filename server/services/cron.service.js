import cron from 'node-cron';
import { Employee } from '../models/Employee.model.js';

const initCronJobs = () => {
    // 1. Monthly Accrual: Run at 00:00 on the 1st of every month
    // Logic: Add 1.25 credits to the main bucket
    cron.schedule('0 0 1 * *', async () => {
        try {
            console.log('Running Monthly Leave Accrual Cron Job...');

            // Increment sickLeave and vacationLeave by 1.25 for all employees
            await Employee.updateMany({}, {
                $inc: {
                    'leaveCredits.sickLeave': 1.25,
                    'leaveCredits.vacationLeave': 1.25
                }
            });

            console.log('Monthly Leave Accrual Completed.');
        } catch (error) {
            console.error('Error in Monthly Leave Accrual:', error);
        }
    });

    // 2. Year-End Carry-Over: Run at 00:01 on January 1st
    // Logic: Move max 5 credits to expiring bucket, reset main bucket to 0
    cron.schedule('1 0 1 1 *', async () => {
        try {
            console.log('Running Year-End Carry-Over Cron Job...');

            const employees = await Employee.find({});

            if (employees.length === 0) return;

            const bulkOps = employees.map(emp => {
                const currentSL = emp.leaveCredits?.sickLeave || 0;
                const currentVL = emp.leaveCredits?.vacationLeave || 0;

                // Calculate expiring credits (Cap at 5)
                const expiringSL = Math.min(currentSL, 5);
                const expiringVL = Math.min(currentVL, 5);

                return {
                    updateOne: {
                        filter: { _id: emp._id },
                        update: {
                            $set: {
                                // Move capped balance to expiring bucket
                                'leaveCredits.expiringSickLeave': expiringSL,
                                'leaveCredits.expiringVacationLeave': expiringVL,
                                // Reset main bucket to 0 for the new year
                                'leaveCredits.sickLeave': 0,
                                'leaveCredits.vacationLeave': 0
                            }
                        }
                    }
                };
            });

            if (bulkOps.length > 0) {
                await Employee.bulkWrite(bulkOps);
            }

            console.log('Year-End Carry-Over Completed.');
        } catch (error) {
            console.error('Error in Year-End Carry-Over:', error);
        }
    });

    // 3. Q1 Expiration: Run at 23:59 on March 31st
    // Logic: Reset expiring bucket to 0
    cron.schedule('59 23 31 3 *', async () => {
        try {
            console.log('Running Q1 Expiration Cron Job...');

            await Employee.updateMany({}, {
                $set: {
                    'leaveCredits.expiringSickLeave': 0,
                    'leaveCredits.expiringVacationLeave': 0
                }
            });

            console.log('Q1 Expiration Completed.');
        } catch (error) {
            console.error('Error in Q1 Expiration:', error);
        }
    });

    console.log('Cron Jobs Initialized');
};

export default initCronJobs;
