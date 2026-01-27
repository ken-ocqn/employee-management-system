import { SalaryChart } from "../../../components/common/Dashboard/salarychart.jsx"
import { DataTable } from "../../../components/common/Dashboard/datatable.jsx"
import { useEffect, useMemo } from "react"
import { HandleGetDashboard } from "../../../redux/Thunks/DashboardThunk.js"
import { useDispatch, useSelector } from "react-redux"
import { Loading } from "../../../components/common/loading.jsx"
import {
    Users,
    Building2,
    Umbrella,
    MessageCircle,
    Calendar as CalendarIcon,
    TrendingUp,
    Briefcase,
    Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const HRStatCard = ({ title, value, icon: Icon, iconColor, bgColor, progressColor }) => (
    <Card className="group border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl overflow-hidden hover:-translate-y-1">
        <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-center mb-4">
                <div className={`p-3 rounded-2xl ${bgColor} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total</span>
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                </div>
            </div>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                {title}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
            <h3 className="text-4xl font-black text-slate-800 tracking-tight mb-1">{value}</h3>
            <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-full ${progressColor} w-2/3 rounded-full`} />
            </div>
        </CardContent>
    </Card>
)

export const HRDashboardPage = () => {
    const { data, isLoading } = useSelector((state) => state.dashboardreducer)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(HandleGetDashboard({ apiroute: "GETDATA" }))
    }, [dispatch])

    const stats = useMemo(() => {
        if (!data) return { employmentStatus: [], leaveTypes: [] };
        return data.stats || { employmentStatus: [], leaveTypes: [] };
    }, [data])

    if (isLoading || !data) return <Loading />

    const mainCards = [
        {
            title: "Employees",
            value: data.employees,
            icon: Users,
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50",
            progressColor: "bg-blue-600"
        },
        {
            title: "Departments",
            value: data.departments,
            icon: Building2,
            iconColor: "text-indigo-600",
            bgColor: "bg-indigo-50",
            progressColor: "bg-indigo-600"
        },
        {
            title: "Leaves",
            value: data.leaves,
            icon: Umbrella,
            iconColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            progressColor: "bg-emerald-600"
        },
        {
            title: "Requests",
            value: data.requests,
            icon: MessageCircle,
            iconColor: "text-orange-600",
            bgColor: "bg-orange-50",
            progressColor: "bg-orange-600"
        },
    ]

    return (
        <div className="space-y-10">
            {/* Main Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainCards.map((card, idx) => (
                    <HRStatCard key={idx} {...card} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Area */}
                <div className="xl:col-span-8 space-y-8">
                    <SalaryChart balancedata={data} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Workforce Breakdown */}
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
                            <CardHeader className="border-b border-slate-50 px-8 py-6">
                                <CardTitle className="text-lg font-bold flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-xl">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Workforce Breakdown
                                </CardTitle>
                                <CardDescription className="text-xs font-medium">Employee counts by status</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                {["Regular", "Probationary", "Outsourced", "External"].map((status) => {
                                    const count = stats.employmentStatus.find(s => s._id === status)?.count || 0;
                                    const percentage = data.employees > 0 ? (count / data.employees) * 100 : 0;
                                    return (
                                        <div key={status} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm font-bold text-slate-700">{status}</span>
                                                <span className="text-xs font-black text-slate-400">{count}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${status === 'Regular' ? 'bg-emerald-500' : 'bg-blue-500'} rounded-full`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        {/* Leave Type Counts */}
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
                            <CardHeader className="border-b border-slate-50 px-8 py-6">
                                <CardTitle className="text-lg font-bold flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 rounded-xl">
                                        <Activity className="w-5 h-5 text-orange-600" />
                                    </div>
                                    Leave Distribution
                                </CardTitle>
                                <CardDescription className="text-xs font-medium">Total applications by type</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-50">
                                    {["Sick", "Vacation", "Emergency", "Maternity", "Paternity"].map((type) => {
                                        const count = stats.leaveTypes.find(l => l._id === type)?.count || 0;
                                        return (
                                            <div key={type} className="flex items-center justify-between px-8 py-4 hover:bg-slate-50 transition-colors cursor-default group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-2 w-2 rounded-full bg-indigo-400 group-hover:scale-150 transition-transform" />
                                                    <span className="text-sm font-bold text-slate-600">{type} Leave</span>
                                                </div>
                                                <Badge variant="secondary" className="bg-slate-50 text-slate-700 font-bold text-[10px] rounded-lg px-2.5">
                                                    {count}
                                                </Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Area */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Calendar Placeholder */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl overflow-hidden group">
                        <CardHeader className="pb-0">
                            <CardTitle className="text-lg font-bold flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <CalendarIcon className="w-5 h-5 text-white" />
                                </div>
                                System Calendar
                            </CardTitle>
                            <CardDescription className="text-blue-100/60 text-xs font-medium mt-1">Events & Deadlines (Preview)</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center space-y-4">
                                <div className="text-5xl font-black drop-shadow-lg">{new Date().getDate()}</div>
                                <div className="text-sm font-bold uppercase tracking-widest text-blue-100 italic">
                                    {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest opacity-60">Module Implementation Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <DataTable noticedata={data} />
                </div>
            </div>
        </div>
    )
}
