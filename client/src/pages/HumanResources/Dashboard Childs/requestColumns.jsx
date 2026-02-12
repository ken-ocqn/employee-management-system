import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { HandleUpdateRequestStatus, HandleGetRequests } from "../../../redux/Thunks/RequestThunk"
import { UploadAttachmentDialog } from "../../../components/HR/UploadAttachmentDialog"
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
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center gap-1 text-[9px] text-blue-600 font-bold uppercase tracking-wider">
                                <Paperclip className="w-2.5 h-2.5" />
                                File Attached
                            </div>
                            <a
                                href={attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 font-bold underline decoration-blue-300 hover:decoration-blue-500 transition-all ml-3"
                            >
                                <FileText className="w-3 h-3" />
                                Preview File
                            </a>
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
            const isFinalized = request.status !== "Pending"
            const hasAttachment = !!request.attachmentUrl

            const handleAction = (status) => {
                dispatch(HandleUpdateRequestStatus({
                    requestID: request._id,
                    approvedby: hrData?._id,
                    status
                })).then(() => dispatch(HandleGetRequests()))
            }

            return (
                <div className="flex flex-col gap-2">
                    {!isFinalized && (
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
                    <UploadAttachmentDialog
                        requestID={request._id}
                        disabled={isFinalized || hasAttachment}
                    />
                </div>
            )
        }
    }
]

