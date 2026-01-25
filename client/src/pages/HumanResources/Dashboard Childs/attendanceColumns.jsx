import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import { HandleUpdateAttendance, HandleGetAttendances } from "../../../redux/Thunks/AttendanceThunk"

export const attendanceColumns = [
    {
        accessorKey: "employee",
        header: "Employee",
        cell: ({ row }) => {
            const employee = row.getValue("employee")
            return <span>{employee ? `${employee.firstname} ${employee.lastname}` : "N/A"}</span>
        }
    },
    {
        accessorKey: "employee.department",
        header: "Department",
        cell: ({ row }) => {
            const employee = row.original.employee
            return <span>{employee?.department?.name || "N/A"}</span>
        }
    },
    {
        accessorKey: "status",
        header: "Current Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            const variant = status === "Present" ? "success" : status === "Absent" ? "destructive" : "secondary"
            return <Badge variant={variant}>{status}</Badge>
        }
    },
    {
        id: "actions",
        header: "Update Status",
        cell: ({ row }) => {
            const dispatch = useDispatch()
            const attendance = row.original

            const handleUpdate = (newStatus) => {
                const currentdate = new Date().toISOString().split("T")[0]
                dispatch(HandleUpdateAttendance({
                    attendanceID: attendance._id,
                    status: newStatus,
                    currentdate: currentdate
                })).then(() => dispatch(HandleGetAttendances()))
            }

            return (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50 h-7"
                        onClick={() => handleUpdate("Present")}
                    >
                        Present
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50 h-7"
                        onClick={() => handleUpdate("Absent")}
                    >
                        Absent
                    </Button>
                </div>
            )
        }
    }
]
