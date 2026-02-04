import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { HandleUpdateRequestStatus, HandleGetRequests } from "../../../redux/Thunks/RequestThunk"
import { UploadAttachmentDialog } from "../../../components/hr/UploadAttachmentDialog"
import { FileText, Paperclip } from "lucide-react"

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
        accessorKey: "createdAt",
        header: "Submitted",
        cell: ({ row }) => (
            <div className="flex flex-col text-[10px]">
                <span className="font-bold">{new Date(row.getValue("createdAt")).toLocaleDateString()}</span>
                <span className="text-slate-400">{new Date(row.getValue("createdAt")).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        )
    },
    {
        accessorKey: "updatedAt",
        header: "Last Update",
        cell: ({ row }) => (
            <div className="flex flex-col text-[10px]">
                <span className="font-bold">{new Date(row.getValue("updatedAt")).toLocaleDateString()}</span>
                <span className="text-slate-400">{new Date(row.getValue("updatedAt")).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            const attachment = row.original.attachmentUrl
            const variant = status === "Approved" ? "success" : status === "Denied" ? "destructive" : "secondary"
            return (
                <div className="flex flex-col gap-1">
                    <Badge variant={variant}>{status}</Badge>
                    {attachment && (
                        <div className="flex items-center gap-1 text-[9px] text-blue-600 font-bold uppercase tracking-wider">
                            <Paperclip className="w-2.5 h-2.5" />
                            File Attached
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const dispatch = useDispatch()
            const { data: hrData } = useSelector((state) => state.HRReducer)
            const request = row.original

            const handleAction = (status) => {
                dispatch(HandleUpdateRequestStatus({
                    requestID: request._id,
                    approvedby: hrData?._id,
                    status
                })).then(() => dispatch(HandleGetRequests()))
            }

            return (
                <div className="flex flex-col gap-2">
                    {request.status === "Pending" && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50 h-7 text-[10px]"
                                onClick={() => handleAction("Approved")}
                            >
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50 h-7 text-[10px]"
                                onClick={() => handleAction("Denied")}
                            >
                                Reject
                            </Button>
                        </div>
                    )}
                    <UploadAttachmentDialog requestID={request._id} />
                </div>
            )
        }
    }
]

