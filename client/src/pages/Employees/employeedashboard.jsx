import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetEmployees, HandlePostEmployees } from "../../redux/Thunks/EmployeeThunk"
import { HandleGetLeaves } from "../../redux/Thunks/LeavesThunk"
import { HandleGetAttendanceById } from "../../redux/Thunks/AttendanceThunk"
import { ApplyLeaveDialog } from "../../components/employee/ApplyLeaveDialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loading } from "../../components/common/loading"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    Briefcase,
    User,
    Mail,
    Phone,
    MapPin,
    Clock,
    CreditCard,
    ClipboardList,
    Umbrella,
    LogOut,
    CheckCircle,
    XCircle,
    AlertCircle,
    History
} from "lucide-react"

export const EmployeeDashboard = () => {
    const dispatch = useDispatch()
    const { data: employee, isLoading: isEmpLoading } = useSelector((state) => state.employeereducer)
    const { allLeaves } = useSelector((state) => state.leavesreducer)
    const { currentAttendance, isLoading: isAttendanceLoading } = useSelector((state) => state.attendancereducer)

    useEffect(() => {
        // Fetch full employee profile
        dispatch(HandleGetEmployees({ apiroute: "GET_PROFILE" }))
        dispatch(HandleGetLeaves())
    }, [dispatch])

    useEffect(() => {
        if (employee && employee.attendance) {
            dispatch(HandleGetAttendanceById(employee.attendance))
        }
    }, [employee, dispatch])

    const handleLogout = () => {
        dispatch(HandlePostEmployees({ apiroute: "LOGOUT", data: {} }))
    }

    if (isEmpLoading || !employee) return <Loading />

    const myLeaves = (allLeaves && employee) ? allLeaves.filter(l => l.employee?._id === employee._id) : []
    const attendanceLogs = currentAttendance?.attendancelog || []

    const profileDetails = [
        { icon: <Briefcase className="w-4 h-4" />, label: "Designation", value: employee.designation || "Not Set" },
        { icon: <Clock className="w-4 h-4" />, label: "Status", value: employee.employmentstatus || "Probationary" },
        { icon: <Calendar className="w-4 h-4" />, label: "Joined", value: employee.startdate ? new Date(employee.startdate).toLocaleDateString() : "Not Set" },
        { icon: <CreditCard className="w-4 h-4" />, label: "Employee ID", value: employee._id?.toString().slice(-6).toUpperCase() },
    ]

    const contactDetails = [
        { icon: <Mail className="w-4 h-4" />, value: employee.email },
        { icon: <Phone className="w-4 h-4" />, value: employee.contactnumber },
        { icon: <MapPin className="w-4 h-4" />, value: employee.presentaddress || "No address provided" },
    ]

    return (
        <div className="employee-dashboard flex min-h-screen bg-slate-50/50">
            <div className="flex-1 p-4 md:p-8 overflow-auto">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Welcome, {employee.firstname}!
                            </h1>
                            <p className="text-slate-500 font-medium">Manage your workspace and applications here.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <ApplyLeaveDialog employeeCredits={employee.leaveCredits} />
                        <Button
                            variant="destructive"
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border-none shadow-none font-bold gap-2"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    {/* Profile Overview Card */}
                    <Card className="lg:col-span-1 border-none shadow-xl shadow-slate-200/50 bg-white order-2 lg:order-1">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-blue-600" />
                                Profile Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {profileDetails.map((detail, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        {detail.icon} {detail.label}
                                    </span>
                                    <span className="text-sm font-bold text-slate-700">{detail.value}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                {contactDetails.map((detail, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors cursor-default">
                                        <div className="p-1.5 rounded-md bg-slate-50">{detail.icon}</div>
                                        <span className="text-xs font-medium truncate">{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 flex flex-col gap-6 order-1 lg:order-2">
                        {/* Attendance Highlight Section */}
                        <div className="attendance-highlight grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="md:col-span-1 border-none shadow-xl shadow-blue-100/50 bg-blue-600 text-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold opacity-80 uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-200" />
                                        Today's Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-4xl font-black mb-1">
                                                {currentAttendance ? (attendanceLogs[attendanceLogs.length - 1]?.logstatus || "Initializing") : "Not Set"}
                                            </p>
                                            <p className="text-xs font-medium text-blue-100">{new Date().toDateString()}</p>
                                        </div>
                                        <div className="p-4 bg-blue-500/50 rounded-2xl">
                                            {attendanceLogs[attendanceLogs.length - 1]?.logstatus === "Present" ? (
                                                <CheckCircle className="w-10 h-10" />
                                            ) : (
                                                <AlertCircle className="w-10 h-10" />
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2 border-none shadow-xl shadow-slate-200/50 bg-white">
                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <History className="w-5 h-5 text-blue-600" />
                                        Recent Attendance History
                                    </CardTitle>
                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Last 5 Entries
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-50">
                                                    <th className="px-2 py-3">Log Date</th>
                                                    <th className="px-2 py-3 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {attendanceLogs.length > 0 ? (
                                                    [...attendanceLogs].reverse().slice(0, 5).map((log, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-2 py-3 font-medium text-slate-600">
                                                                {new Date(log.logdate).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-2 py-3 text-right">
                                                                <Badge className={`${log.logstatus === "Present" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" :
                                                                        log.logstatus === "Absent" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" :
                                                                            "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                                                    } border-none font-bold text-[10px]`}>
                                                                    {log.logstatus}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="2" className="py-4 text-center text-slate-300 text-xs italic">
                                                            No history logs available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Leaves Grid (Secondary) */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Umbrella className="w-5 h-5 text-blue-600" />
                                Leave Management
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {employee.leaveCredits && Object.entries(employee.leaveCredits).map(([key, value]) => {
                                    if (typeof value !== 'number') return null;
                                    return (
                                        <Card key={key} className="border-none shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden bg-white">
                                            <CardHeader className="p-4 pb-1">
                                                <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {key.replace(/Leave$/, '')}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black text-slate-800">{value}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Days Left</span>
                                                </div>
                                                <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-600 rounded-full"
                                                        style={{ width: `${Math.min((value / 15) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* Recent Leave Requests (Secondary Table) */}
                            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white opacity-80 hover:opacity-100 transition-opacity">
                                <CardHeader className="py-4 flex flex-row items-center justify-between">
                                    <CardTitle className="text-md font-bold text-slate-700">Recent Leave Requests</CardTitle>
                                    <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-100 text-[10px] font-bold">
                                        {myLeaves.length} Total
                                    </Badge>
                                </CardHeader>
                                <CardContent className="pb-4 pt-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-[12px] text-left">
                                            <thead className="text-slate-400 font-bold uppercase tracking-widest border-b border-slate-50">
                                                <tr>
                                                    <th className="px-2 py-2">Type</th>
                                                    <th className="px-2 py-2">Dates</th>
                                                    <th className="px-2 py-2 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {myLeaves.length > 0 ? myLeaves.slice(0, 3).map((leave) => (
                                                    <tr key={leave._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-2 py-3 font-bold text-slate-600">{leave.leaveType}</td>
                                                        <td className="px-2 py-3 text-slate-500">
                                                            {new Date(leave.startdate).toLocaleDateString()} - {new Date(leave.enddate).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-2 py-3 text-right">
                                                            <Badge className={`${leave.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                                                                    leave.status === "Rejected" ? "bg-rose-50 text-rose-600" :
                                                                        "bg-amber-50 text-amber-600"
                                                                } border-none font-black text-[9px] px-2 py-0.5`}>
                                                                {leave.status?.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="3" className="py-4 text-center text-slate-300 italic">No leaves found</td>
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
            </div>
        </div>
    )
}
