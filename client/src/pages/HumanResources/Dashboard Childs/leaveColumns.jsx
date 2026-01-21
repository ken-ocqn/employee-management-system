import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import { HandleUpdateLeaveStatus, HandleGetLeaves } from "../../../redux/Thunks/LeavesThunk"

export const leaveColumns = [
    {
        accessorKey: "employee",
        header: "Employee",
        cell: ({ row }) => {
            const employee = row.getValue("employee")
            return <span>{`${employee.firstname} ${employee.lastname}`}</span>
        }
    },
    {
        accessorKey: "leaveType",
        header: "Leave Type",
    },
    {
        accessorKey: "startdate",
        header: "Start Date",
        cell: ({ row }) => new Date(row.getValue("startdate")).toLocaleDateString()
    },
    {
        accessorKey: "enddate",
        header: "End Date",
        cell: ({ row }) => new Date(row.getValue("enddate")).toLocaleDateString()
    },
    {
        accessorKey: "dayCount",
        header: "Days",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            const variant = status === "Approved" ? "success" : status === "Rejected" ? "destructive" : "secondary"
            return <Badge variant={variant}>{status}</Badge>
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const dispatch = useDispatch()
            const leave = row.original

            if (leave.status !== "Pending") return null

            const handleAction = (status) => {
                dispatch(HandleUpdateLeaveStatus({ id: leave._id, status }))
                    .then(() => dispatch(HandleGetLeaves()))
            }

            return (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleAction("Approved")}
                    >
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleAction("Rejected")}
                    >
                        Reject
                    </Button>
                </div>
            )
        }
    }
]
