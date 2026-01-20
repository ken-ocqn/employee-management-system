
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { EmployeeDetailsDialogBox, UpdateEmployeeDialogBox, DeleteEmployeeDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx"

export const columns = [
    {
        accessorFn: (row) => `${row.firstname} ${row.lastname}`,
        id: "fullname",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="text-white hover:bg-blue-700 hover:text-white"
                >
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-left font-medium">{row.getValue("fullname")}</div>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="text-left">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "department.name",
        header: "Department",
        cell: ({ row }) => {
            const departmentName = row.original.department?.name || "Not Specified"
            return (
                <div className="text-center">{departmentName}</div>
            )
        },
    },
    {
        accessorKey: "contactnumber",
        header: "Contact Number",
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("contactnumber")}</div>
        ),
    },
    {
        id: "actions",
        header: "Modify Employee",
        cell: ({ row }) => {
            const employee = row.original

            return (
                <div className="flex justify-center items-center gap-2">
                    <EmployeeDetailsDialogBox EmployeeID={employee._id} />
                    <UpdateEmployeeDialogBox EmployeeID={employee._id} />
                    <DeleteEmployeeDialogBox EmployeeID={employee._id} />
                </div>
            )
        },
    },
]
