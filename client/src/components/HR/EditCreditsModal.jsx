import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HandleUpdateHREmployees } from "../../redux/Thunks/HREmployeesThunk";
import { useToast } from "../../hooks/use-toast";

export const EditCreditsModal = ({ isOpen, onClose, employee, onUpdate }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [credits, setCredits] = useState({
        sickLeave: 0,
        vacationLeave: 0,
        emergencyLeave: 0,
        maternityLeave: 0,
        paternityLeave: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (employee && employee.leaveCredits) {
            setCredits({
                sickLeave: employee.leaveCredits.sickLeave || 0,
                vacationLeave: employee.leaveCredits.vacationLeave || 0,
                emergencyLeave: employee.leaveCredits.emergencyLeave || 0,
                maternityLeave: employee.leaveCredits.maternityLeave || 0,
                paternityLeave: employee.leaveCredits.paternityLeave || 0
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredits(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const resultAction = await dispatch(HandleUpdateHREmployees({
                apiroute: "UPDATE",
                data: {
                    employeeId: employee._id,
                    updatedEmployee: {
                        leaveCredits: credits
                    }
                }
            }));

            if (HandleUpdateHREmployees.fulfilled.match(resultAction)) {
                toast({
                    title: "Success",
                    description: "Leave credits updated successfully.",
                });
                onUpdate();
                onClose();
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: resultAction.payload?.message || "Failed to update credits.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!employee) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Leave Credits</DialogTitle>
                    <DialogDescription>
                        Update leave balances for {employee.firstname} {employee.lastname}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sickLeave" className="text-right">Sick</Label>
                            <Input
                                id="sickLeave"
                                name="sickLeave"
                                type="number"
                                step="0.25"
                                value={credits.sickLeave}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="vacationLeave" className="text-right">Vacation</Label>
                            <Input
                                id="vacationLeave"
                                name="vacationLeave"
                                type="number"
                                step="0.25"
                                value={credits.vacationLeave}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="emergencyLeave" className="text-right">Emergency</Label>
                            <Input
                                id="emergencyLeave"
                                name="emergencyLeave"
                                type="number"
                                step="0.25"
                                value={credits.emergencyLeave}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="maternityLeave" className="text-right">Maternity</Label>
                            <Input
                                id="maternityLeave"
                                name="maternityLeave"
                                type="number"
                                step="0.25"
                                value={credits.maternityLeave}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="paternityLeave" className="text-right">Paternity</Label>
                            <Input
                                id="paternityLeave"
                                name="paternityLeave"
                                type="number"
                                step="0.25"
                                value={credits.paternityLeave}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
