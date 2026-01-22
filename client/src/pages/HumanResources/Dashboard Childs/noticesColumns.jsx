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
import { UpdateNoticeDialogBox, DeleteNoticeDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx"

export const noticesColumns = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "audience",
        header: "Audience",
        cell: ({ row }) => {
            const audience = row.getValue("audience")
            return (
                <div className={`capitalize px-2 py-1 rounded text-xs font-bold w-fit ${audience === 'Employee-Specific' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                    {audience === 'Employee-Specific' ? 'Employee' : 'Department'}
                </div>
            )
        }
    },
    {
        id: "target",
        header: "Target",
        cell: ({ row }) => {
            const notice = row.original
            if (notice.audience === "Employee-Specific") {
                return <span>{notice.employee ? `${notice.employee.firstname} ${notice.employee.lastname}` : "N/A"}</span>
            } else {
                return <span>{notice.department ? notice.department.name : "N/A"}</span>
            }
        }
    },
    {
        accessorKey: "createdAt",
        header: "Date Created",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const notice = row.original

            return (
                <div className="flex gap-2">
                    <UpdateNoticeDialogBox noticeData={notice} />
                    <DeleteNoticeDialogBox noticeID={notice._id} />
                </div>
            )
        },
    },
]
