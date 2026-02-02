import { Badge } from "@/components/ui/badge"
import { LogIn, LogOut, MapPin } from "lucide-react"

export const attendanceColumns = [
    {
        accessorKey: "employee",
        header: "Employee",
        cell: ({ row }) => {
            const employee = row.original.employee
            if (!employee) return <span>N/A</span>
            const initials = `${employee.firstname?.[0] || ""}${employee.lastname?.[0] || ""}`.toUpperCase()

            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600 border border-indigo-100">
                        {initials}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-700 leading-none">
                            {employee.firstname} {employee.lastname}
                        </span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "employee.department",
        header: "Department",
        cell: ({ row }) => {
            const department = row.original.employee?.department
            return (
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                    {department?.name || "N/A"}
                </Badge>
            )
        }
    },
    {
        id: "timeline",
        header: "Timeline & Activity",
        cell: ({ row }) => {
            const attendance = row.original
            const todayLog = attendance.attendancelog?.[attendance.attendancelog.length - 1]

            if (!todayLog) return <span className="text-slate-300 italic text-[10px]">No logs today</span>

            return (
                <div className="flex flex-col gap-2 py-1">
                    <div className="flex items-center gap-4">
                        {/* Clock In */}
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                                <LogIn className="w-3 h-3" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">In</span>
                                <span className="text-xs font-bold text-slate-600">
                                    {todayLog.loginTime ? new Date(todayLog.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                </span>
                            </div>
                        </div>

                        <div className="h-4 w-[1px] bg-slate-100 mx-1" />

                        {/* Clock Out */}
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                                <LogOut className="w-3 h-3" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">Out</span>
                                <span className="text-xs font-bold text-slate-600">
                                    {todayLog.logoutTime ? new Date(todayLog.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Address Display */}
                    {(todayLog.loginLocation?.address || todayLog.logoutLocation?.address) && (
                        <div className="flex flex-col gap-0.5 max-w-[250px]">
                            <div className="flex items-start gap-1">
                                <MapPin className="w-2.5 h-2.5 text-slate-300 mt-0.5 flex-shrink-0" />
                                <span className="text-[9px] text-slate-400 leading-tight" title={todayLog.loginLocation?.address || todayLog.logoutLocation?.address}>
                                    {todayLog.loginLocation?.address || todayLog.logoutLocation?.address}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Current Status",
        cell: ({ row }) => {
            const status = row.getValue("status")
            const variant = status === "Present" ? "success" : status === "Absent" ? "destructive" : "secondary"
            return (
                <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${status === "Present" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
                        status === "Absent" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "bg-slate-300"}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${status === "Present" ? "text-emerald-500" :
                        status === "Absent" ? "text-rose-500" : "text-slate-400"}`}>
                        {status}
                    </span>
                </div>
            )
        }
    }
]
