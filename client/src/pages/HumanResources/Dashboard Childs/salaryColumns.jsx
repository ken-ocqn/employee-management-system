import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UpdateSalaryDialogBox, DeleteSalaryDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx"

export const salaryColumns = [
    {
        accessorKey: "employee",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Employee
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const employee = row.getValue("employee")
            return <span>{employee ? `${employee.firstname} ${employee.lastname}` : "N/A"}</span>
        }
    },
    {
        accessorKey: "basicpay",
        header: "Basic Pay",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("basicpay"))
            const currency = row.original.currency || "USD"
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "bonuses",
        header: "Bonuses",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("bonuses"))
            const currency = row.original.currency || "USD"
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
            }).format(amount)
            return <div>{formatted}</div>
        },
    },
    {
        accessorKey: "deductions",
        header: "Deductions",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("deductions"))
            const currency = row.original.currency || "USD"
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
            }).format(amount)
            return <div>{formatted}</div>
        },
    },
    {
        accessorKey: "netpay",
        header: "Net Pay",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("netpay"))
            const currency = row.original.currency || "USD"
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
            }).format(amount)
            return <div className="font-bold text-green-600">{formatted}</div>
        },
    },
    {
        accessorKey: "duedate",
        header: "Due Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("duedate"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            return (
                <div className={`capitalize px-2 py-1 rounded text-xs font-bold w-fit ${status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {status}
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const salary = row.original

            return (
                <div className="flex gap-2">
                    <UpdateSalaryDialogBox salaryData={salary} />
                    <DeleteSalaryDialogBox salaryID={salary._id} />
                </div>
            )
        },
    },
]
