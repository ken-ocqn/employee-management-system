
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { RemoveEmployeeFromDepartmentDialogBox } from "./dialogboxes.jsx"

export const getDepartmentEmployeesColumns = (departmentName, departmentId) => [
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
        accessorKey: "contactnumber",
        header: "Contact Number",
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("contactnumber")}</div>
        ),
    },
    {
        id: "actions",
        header: "Remove Employee",
        cell: ({ row }) => {
            const employee = row.original

            return (
                <div className="flex justify-center items-center gap-2">
                    <RemoveEmployeeFromDepartmentDialogBox
                        DepartmentName={departmentName}
                        DepartmentID={departmentId}
                        EmployeeID={employee._id}
                    />
                </div>
            )
        },
    },
]

export const getDepartmentNoticeColumns = () => [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="text-left font-medium">{row.getValue("title")}</div>
        ),
    },
    {
        accessorKey: "audience",
        header: "Audience",
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("audience")}</div>
        ),
    },
    {
        accessorKey: "createdby",
        header: "Created By",
        cell: ({ row }) => {
            // Handle if populated object or just ID
            const creator = row.original.createdby
            const name = (typeof creator === 'object' && creator !== null)
                ? `${creator.firstname} ${creator.lastname}`
                : creator
            return <div className="text-center">{name || "Unknown"}</div>
        },
    },
    {
        id: "actions",
        header: "View Notice",
        cell: ({ row }) => {
            return (
                <div className="flex justify-center items-center gap-2">
                    <Button variant="outline" size="sm" className="border-blue-500 text-blue-700">View</Button>
                </div>
            )
        },
    },
]
