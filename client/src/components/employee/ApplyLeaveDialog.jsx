import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HandleCreateLeave, HandleGetLeaves } from "../../redux/Thunks/LeavesThunk.js"
import { useToast } from "../../hooks/use-toast.js"

export const ApplyLeaveDialog = ({ employeeCredits, onApplySuccess }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const { isActionLoading } = useSelector((state) => state.leavesreducer)

    const [open, setOpen] = useState(false)
    const [formdata, setFormdata] = useState({
        leaveType: "",
        startdate: "",
        enddate: "",
        reason: ""
    })

    const leaveTypes = ["Sick", "Vacation", "Emergency", "Maternity", "Paternity", "Unpaid"]

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formdata.leaveType || !formdata.startdate || !formdata.enddate || !formdata.reason) {
            return toast({ variant: "destructive", title: "Wait!", description: "All fields are required." })
        }

        const res = await dispatch(HandleCreateLeave(formdata))
        if (!res.error) {
            toast({ title: "Success", description: "Leave application submitted." })
            setOpen(false)
            setFormdata({ leaveType: "", startdate: "", enddate: "", reason: "" })
            dispatch(HandleGetLeaves())
            if (onApplySuccess) onApplySuccess()
        } else {
            toast({ variant: "destructive", title: "Error", description: res.payload?.message || "Failed to submit." })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Apply for Leave</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Apply for Leave</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Leave Type</label>
                        <Select onValueChange={(val) => setFormdata({ ...formdata, leaveType: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent>
                                {leaveTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type} {type !== "Unpaid" && `(${employeeCredits?.[type.charAt(0).toLowerCase() + type.slice(1) + "Leave"] || 0} left)`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Date</label>
                            <Input
                                type="date"
                                value={formdata.startdate}
                                onChange={(e) => setFormdata({ ...formdata, startdate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">End Date</label>
                            <Input
                                type="date"
                                value={formdata.enddate}
                                onChange={(e) => setFormdata({ ...formdata, enddate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Reason</label>
                        <Textarea
                            placeholder="Reason for leave..."
                            value={formdata.reason}
                            onChange={(e) => setFormdata({ ...formdata, reason: e.target.value })}
                            className="border-2 border-gray-300"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isActionLoading}>
                        {isActionLoading ? "Submitting..." : "Submit Application"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
