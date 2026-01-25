import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { HandleUpdateRequestStatus, HandleGetRequests } from "../../../redux/Thunks/RequestThunk"

export const requestColumns = [
    {
        accessorKey: "employee",
        header: "Employee",
        cell: ({ row }) => {
            const employee = row.getValue("employee")
            return <span>{employee ? `${employee.firstname} ${employee.lastname}` : "N/A"}</span>
        }
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => {
            const department = row.getValue("department")
            return <span>{department?.name || "N/A"}</span>
        }
    },
    {
        accessorKey: "requesttitle",
        header: "Title",
    },
    {
        accessorKey: "requestconent",
        header: "Content",
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate" title={row.getValue("requestconent")}>
                {row.getValue("requestconent")}
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            const variant = status === "Approved" ? "success" : status === "Denied" ? "destructive" : "secondary"
            return <Badge variant={variant}>{status}</Badge>
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const dispatch = useDispatch()
            const { data: hrData } = useSelector((state) => state.HRReducer)
            const request = row.original

            if (request.status !== "Pending") return null

            const handleAction = (status) => {
                dispatch(HandleUpdateRequestStatus({
                    requestID: request._id,
                    approvedby: hrData?._id,
                    status
                })).then(() => dispatch(HandleGetRequests()))
            }

            return (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50 h-7"
                        onClick={() => handleAction("Approved")}
                    >
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50 h-7"
                        onClick={() => handleAction("Denied")}
                    >
                        Reject
                    </Button>
                </div>
            )
        }
    }
]
