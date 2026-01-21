import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetEmployees } from "../../redux/Thunks/EmployeeThunk"
import { HandleGetLeaves } from "../../redux/Thunks/LeavesThunk"
import { ApplyLeaveDialog } from "../../components/employee/ApplyLeaveDialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loading } from "../../components/common/loading"

export const EmployeeDashboard = () => {
    const dispatch = useDispatch()
    const { data: employee, isLoading: isEmpLoading } = useSelector((state) => state.employeereducer)
    const { allLeaves, isLoading: isLeavesLoading } = useSelector((state) => state.leavesreducer)

    useEffect(() => {
        dispatch(HandleGetEmployees({ apiroute: "CHECKELOGIN" }))
        dispatch(HandleGetLeaves())
    }, [dispatch])

    if (isEmpLoading || !employee) return <Loading />

    const myLeaves = allLeaves.filter(l => l.employee._id === employee._id)

    return (
        <div className="employee-dashboard flex min-h-screen bg-gray-50">
            <div className="flex-1 p-8 overflow-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">Welcome, {employee.firstname}!</h1>
                        <p className="text-gray-500">Manage your leave credits and applications here.</p>
                    </div>
                    <ApplyLeaveDialog employeeCredits={employee.leaveCredits} />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                    {employee.leaveCredits && Object.entries(employee.leaveCredits).map(([key, value]) => (
                        <Card key={key} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500 uppercase">{key.replace(/Leave$/, '')}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-2xl font-bold text-blue-600">{value} Days</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <Card className="bg-white border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Leave Requests</CardTitle>
                            <CardDescription>A list of your submitted leave applications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase font-bold text-xs">
                                        <tr>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Dates</th>
                                            <th className="px-6 py-3">Days</th>
                                            <th className="px-6 py-3">Reason</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {myLeaves.length > 0 ? myLeaves.map((leave) => (
                                            <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-medium">{leave.leaveType}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(leave.startdate).toLocaleDateString()} - {new Date(leave.enddate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">{leave.dayCount}</td>
                                                <td className="px-6 py-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]" title={leave.reason}>
                                                    {leave.reason}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`${leave.status === "Approved" ? "bg-green-100 text-green-700" :
                                                        leave.status === "Rejected" ? "bg-red-100 text-red-700" :
                                                            "bg-yellow-100 text-yellow-700"
                                                        } border-none`}>
                                                        {leave.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">No leave requests found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}