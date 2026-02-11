import { SalaryChart } from "../../../components/common/Dashboard/salarychart.jsx"
import { DataTable } from "../../../components/common/Dashboard/datatable.jsx"
import { useEffect, useMemo, useState } from "react"
import { HandleGetDashboard } from "../../../redux/Thunks/DashboardThunk.js"
import { HandleGetLeaves } from "../../../redux/Thunks/LeavesThunk.js"
import { HandleGetRequests } from "../../../redux/Thunks/RequestThunk.js"
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
    const leavesData = useSelector((state) => state.leavesreducer.allLeaves)
    const requestsData = useSelector((state) => state.requestreducer.allRequests)
    const noticesData = data?.notices || []
    const dispatch = useDispatch()
    const [selectedDate, setSelectedDate] = useState(new Date())

    useEffect(() => {
        dispatch(HandleGetDashboard({ apiroute: "GETDATA" }))
        dispatch(HandleGetLeaves({ apiroute: "GETALL" }))
        dispatch(HandleGetRequests())
    }, [dispatch])

    const stats = useMemo(() => {
        if (!data) return { employmentStatus: [], leaveTypes: [] };
        return data.stats || { employmentStatus: [], leaveTypes: [] };
    }, [data])

    // Calendar logic
    const calendarEvents = useMemo(() => {
        const events = []

        // Add Leave events (only approved)
        if (leavesData && Array.isArray(leavesData)) {
            leavesData.forEach(leave => {
                if (leave.startdate && leave.status === 'Approved') {
                    events.push({
                        date: new Date(leave.startdate),
                        title: `${leave.leaveType || 'Leave'}: ${leave.employee?.firstname || leave.employee?.name || 'Employee'} ${leave.employee?.lastname || ''}`,
                        type: 'leave',
                        status: leave.status,
                        endDate: leave.enddate ? new Date(leave.enddate) : null
                    });
                }
            });
        }

        // Add Request events (only approved)
        if (requestsData && Array.isArray(requestsData)) {
            requestsData.forEach(request => {
                if (request.createdAt && request.status === 'Approved') {
                    events.push({
                        date: new Date(request.createdAt),
                        title: `Request: ${request.requesttitle || request.subject || 'New Request'}`,
                        type: 'request',
                        status: request.status
                    });
                }
            });
        }

        // Add Notice events
        if (noticesData && Array.isArray(noticesData)) {
            noticesData.forEach(notice => {
                if (notice.createdAt) {
                    events.push({
                        date: new Date(notice.createdAt),
                        title: `Notice: ${notice.title || 'Announcement'}`,
                        type: 'notice'
                    });
                }
            });
        }

        return events.sort((a, b) => b.date - a.date);
    }, [leavesData, requestsData, noticesData]);

    const upcomingEvents = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return calendarEvents
            .filter(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);

                if (event.endDate) {
                    const eventEnd = new Date(event.endDate);
                    eventEnd.setHours(0, 0, 0, 0);
                    return eventEnd >= today;
                }
                return eventDate >= today;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [calendarEvents]);
    const currentMonth = selectedDate.getMonth()
    const currentYear = selectedDate.getFullYear()

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay()

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const getEventsForDate = (day) => {
        const dateToCheck = new Date(currentYear, currentMonth, day);
        dateToCheck.setHours(0, 0, 0, 0);

        return calendarEvents.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);

            if (event.endDate) {
                const eventEnd = new Date(event.endDate);
                eventEnd.setHours(0, 0, 0, 0);
                return dateToCheck >= eventDate && dateToCheck <= eventEnd;
            }
            return eventDate.getTime() === dateToCheck.getTime();
        });
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentYear, currentMonth + direction, 1);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    if (isLoading) return <Loading />
    if (!data) return <div>No data available</div>

    const mainCards = [
        { title: "Employees", value: data.employees || 0, icon: Users, iconColor: "text-indigo-600", bgColor: "bg-indigo-50", progressColor: "bg-indigo-600" },
        { title: "Departments", value: data.departments || 0, icon: Building2, iconColor: "text-blue-600", bgColor: "bg-blue-50", progressColor: "bg-blue-600" },
        { title: "Leaves", value: data.leaves || 0, icon: Umbrella, iconColor: "text-emerald-600", bgColor: "bg-emerald-50", progressColor: "bg-emerald-600" },
        { title: "Requests", value: data.requests || 0, icon: MessageCircle, iconColor: "text-orange-600", bgColor: "bg-orange-50", progressColor: "bg-orange-600" },
    ]

    return (
        <div className="space-y-10">
            {/* Main Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainCards.map((card, idx) => (
                    <HRStatCard key={idx} {...card} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left Area - Calendar (50%) */}
                <div className="space-y-8">
                    {/* System Calendar */}
                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl overflow-hidden">
                        <CardHeader className="pb-3 px-6 pt-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                        <CalendarIcon className="w-5 h-5 text-white" />
                                    </div>
                                    System Calendar
                                </CardTitle>
                                <button
                                    onClick={goToToday}
                                    className="text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg backdrop-blur-md transition-all"
                                >
                                    Today
                                </button>
                            </div>
                            <CardDescription className="text-blue-100/70 text-xs font-medium mt-1">Events & Deadlines</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            {/* Month Navigation */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => navigateMonth(-1)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="text-sm font-bold uppercase tracking-wider">
                                    {selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                </div>
                                <button
                                    onClick={() => navigateMonth(1)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                {/* Weekday Headers */}
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center text-[10px] font-bold text-blue-100/60 uppercase tracking-wide py-1">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div className="grid grid-cols-7 gap-1">
                                    {generateCalendarDays().map((day, index) => {
                                        const events = day ? getEventsForDate(day) : []
                                        const isToday = day &&
                                            day === new Date().getDate() &&
                                            currentMonth === new Date().getMonth() &&
                                            currentYear === new Date().getFullYear()

                                        return (
                                            <div
                                                key={index}
                                                className={`
                                                    aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-bold
                                                    ${day ? 'hover:bg-white/20 cursor-pointer transition-all' : ''}
                                                    ${isToday ? 'bg-white text-indigo-600 shadow-lg' : 'text-white'}
                                                    ${!day ? 'opacity-0' : ''}
                                                    relative group
                                                `}
                                                title={events.length > 0 ? events.map(e => e.title).join('\n') : ''}
                                            >
                                                {day && (
                                                    <>
                                                        <span className={isToday ? 'text-indigo-600' : ''}>{day}</span>
                                                        {events.length > 0 && (
                                                            <div className="absolute bottom-1 flex gap-0.5">
                                                                {events.slice(0, 3).map((event, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className={`w-1 h-1 rounded-full ${event.type === 'leave' ? 'bg-emerald-300' :
                                                                            event.type === 'request' ? 'bg-orange-300' :
                                                                                'bg-yellow-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Upcoming Events */}
                            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                                <div className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-100/80">Events</div>
                                {upcomingEvents.slice(0, 5).map((event, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/10 hover:bg-white/15 transition-all group"
                                    >
                                        <div className="flex items-start gap-2">
                                            <div
                                                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${event.type === 'leave' ? 'bg-emerald-300' :
                                                    event.type === 'request' ? 'bg-orange-300' :
                                                        'bg-yellow-300'
                                                    }`}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-semibold text-white truncate">{event.title}</div>
                                                <div className="text-[10px] text-blue-100/60 mt-0.5">
                                                    {event.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    {event.status && ` • ${event.status}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {calendarEvents.length === 0 && (
                                    <div className="text-center py-4 text-blue-100/40 text-xs">No upcoming events</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <DataTable noticedata={data} />
                </div>

                {/* Right Area - Balance Overview & Stats (50%) */}
                <div className="space-y-8">
                    <SalaryChart balancedata={data} />

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
        </div>
    )
}
