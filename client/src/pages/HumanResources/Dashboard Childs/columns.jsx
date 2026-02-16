
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, User } from "lucide-react"
import { EmployeeDetailsDialogBox, UpdateEmployeeDialogBox, DeleteEmployeeDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx"
import { EmployeePhotoUpload } from "../../../components/common/EmployeePhotoUpload.jsx"
import { useState } from "react"

const PhotoCell = ({ employee, onPhotoUpdate }) => {
    const [photo, setPhoto] = useState(employee.photo);

    const handlePhotoUpdated = (newPhoto) => {
        setPhoto(newPhoto);
        if (onPhotoUpdate) {
            onPhotoUpdate(employee._id, newPhoto);
        }
    };

    return (
        <div className="flex justify-center">
            <EmployeePhotoUpload
                employeeId={employee._id}
                currentPhoto={photo}
                onPhotoUpdated={handlePhotoUpdated}
            />
        </div>
    );
};

export const columns = [
    {
        id: "photo",
        header: "Photo",
        cell: ({ row }) => {
            const employee = row.original;
            return <PhotoCell employee={employee} />;
        },
    },
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
        accessorKey: "employmentstatus",
        header: "Status",
        cell: ({ row }) => (
            <div className="text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.getValue("employmentstatus") === "Regular" ? "bg-green-100 text-green-800" :
                    row.getValue("employmentstatus") === "Probationary" ? "bg-yellow-100 text-yellow-800" :
                        row.getValue("employmentstatus") === "Outsourced" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                    }`}>
                    {row.getValue("employmentstatus")}
                </span>
            </div>
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
