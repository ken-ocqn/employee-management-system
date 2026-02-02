import { useEffect, useMemo, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetEmployees, HandlePostEmployees } from "../../redux/Thunks/EmployeeThunk"
import { HandleGetLeaves } from "../../redux/Thunks/LeavesThunk"
import { HandleGetAttendanceById, HandleAttendanceLogin, HandleAttendanceLogout, HandleInitializeAttendance } from "../../redux/Thunks/AttendanceThunk"
import { ApplyLeaveDialog } from "../../components/employee/ApplyLeaveDialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loading } from "../../components/common/loading"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
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
    History,
    ChevronRight,
    Plane,
    Stethoscope,
    HeartPulse,
    Baby,
    Users,
    LogIn,
    Loader2
} from "lucide-react"

const getLeaveIcon = (type) => {
    switch (type?.toLowerCase()) {
        case 'vacation': return <Plane className="w-4 h-4" />;
        case 'sick': return <Stethoscope className="w-4 h-4" />;
        case 'emergency': return <HeartPulse className="w-4 h-4" />;
        case 'maternity': return <Baby className="w-4 h-4" />;
        case 'paternity': return <Users className="w-4 h-4" />;
        default: return <Umbrella className="w-4 h-4" />;
    }
}

export const EmployeeDashboard = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const { data: employee, isLoading: isEmpLoading } = useSelector((state) => state.employeereducer)
    const { allLeaves } = useSelector((state) => state.leavesreducer)
    const { currentAttendance, isActionLoading } = useSelector((state) => state.attendancereducer)
    const [isCapturingGPS, setIsCapturingGPS] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [confirmAction, setConfirmAction] = useState(null) // 'login' or 'logout'
    const [locationData, setLocationData] = useState(null)
    const initializingRef = useRef(false)

    useEffect(() => {
        dispatch(HandleGetEmployees({ apiroute: "GET_PROFILE" }))
        dispatch(HandleGetLeaves({ apiroute: "GET_MY_LEAVES" }))
    }, [dispatch])

    useEffect(() => {
        const initializeAttendance = async () => {
            if (employee && !initializingRef.current) {
                console.log("Employee data:", employee);
                console.log("Employee ID:", employee._id);
                console.log("Employee attendance:", employee.attendance);

                if (employee.attendance) {
                    // Employee has attendance record reference, try to fetch it
                    try {
                        await dispatch(HandleGetAttendanceById(employee.attendance)).unwrap()
                    } catch (error) {
                        // If attendance record not found (404), it means the reference is stale
                        // Re-initialize the attendance record
                        console.warn("Attendance record not found, re-initializing...", error);
                        if (employee._id) {
                            initializingRef.current = true;
                            const payload = { employeeID: employee._id };
                            console.log("Re-initializing attendance with payload:", payload);
                            try {
                                await dispatch(HandleInitializeAttendance(payload)).unwrap()
                                // After initialization, fetch the profile again to get the new attendance ID
                                dispatch(HandleGetEmployees({ apiroute: "GET_PROFILE" }))
                            } catch (initError) {
                                console.error("Failed to re-initialize attendance:", initError)
                                initializingRef.current = false
                            }
                        }
                    }
                } else if (employee._id) {
                    // Employee doesn't have attendance record, initialize it
                    initializingRef.current = true
                    const payload = { employeeID: employee._id };
                    console.log("Initializing attendance with payload:", payload);
                    try {
                        await dispatch(HandleInitializeAttendance(payload)).unwrap()
                        // After initialization, fetch the profile again to get the attendance ID
                        dispatch(HandleGetEmployees({ apiroute: "GET_PROFILE" }))
                    } catch (error) {
                        console.error("Failed to initialize attendance:", error)
                        initializingRef.current = false // Reset on error so user can retry
                    }
                } else {
                    console.error("Employee ID is missing!");
                }
            }
        }

        initializeAttendance()
    }, [employee?.attendance, dispatch])


    const handleLogout = () => {
        dispatch(HandlePostEmployees({ apiroute: "LOGOUT", data: {} }))
    }

    const captureLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported by your browser"))
                return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    })
                },
                (error) => {
                    let errorMessage = "Unable to retrieve location"
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "Location permission denied. Please enable location access."
                            break
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Location information unavailable."
                            break
                        case error.TIMEOUT:
                            errorMessage = "Location request timed out. Please try again."
                            break
                    }
                    reject(new Error(errorMessage))
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            )
        })
    }

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
                headers: {
                    'User-Agent': 'EmployeeManagementSystem/1.0'
                }
            })
            const data = await response.json()
            return data.display_name || "Address not found"
        } catch (error) {
            console.error("Error fetching address:", error)
            return "Unable to retrieve address"
        }
    }

    const handleAttendanceLogin = async () => {
        if (!currentAttendance) {
            toast({
                title: "Error",
                description: "Attendance record is being initialized. Please refresh the page or wait a moment.",
                variant: "destructive"
            })
            return
        }

        setIsCapturingGPS(true)
        try {
            const location = await captureLocation()
            const address = await fetchAddress(location.latitude, location.longitude)
            setLocationData({ ...location, address })
            setConfirmAction('login')
            setShowConfirmDialog(true)
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to capture location",
                variant: "destructive"
            })
        } finally {
            setIsCapturingGPS(false)
        }
    }

    const handleAttendanceLogout = async () => {
        if (!currentAttendance) {
            toast({
                title: "Error",
                description: "Attendance record is being initialized. Please refresh the page or wait a moment.",
                variant: "destructive"
            })
            return
        }

        setIsCapturingGPS(true)
        try {
            const location = await captureLocation()
            const address = await fetchAddress(location.latitude, location.longitude)
            setLocationData({ ...location, address })
            setConfirmAction('logout')
            setShowConfirmDialog(true)
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to capture location",
                variant: "destructive"
            })
        } finally {
            setIsCapturingGPS(false)
        }
    }

    const confirmAttendance = async () => {
        if (!locationData || !currentAttendance) return

        setShowConfirmDialog(false)
        setIsCapturingGPS(true)

        try {
            if (confirmAction === 'login') {
                await dispatch(HandleAttendanceLogin({
                    attendanceID: currentAttendance._id,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    accuracy: locationData.accuracy,
                    address: locationData.address
                })).unwrap()

                toast({
                    title: "Success",
                    description: "Attendance login successful!",
                })
            } else if (confirmAction === 'logout') {
                await dispatch(HandleAttendanceLogout({
                    attendanceID: currentAttendance._id,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    accuracy: locationData.accuracy,
                    address: locationData.address
                })).unwrap()

                toast({
                    title: "Success",
                    description: "Attendance logout successful!",
                })
            }

            // Refresh attendance data
            dispatch(HandleGetAttendanceById(currentAttendance._id))
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || `Failed to ${confirmAction} attendance`,
                variant: "destructive"
            })
        } finally {
            setIsCapturingGPS(false)
            setLocationData(null)
            setConfirmAction(null)
        }
    }

    const cancelAttendance = () => {
        setShowConfirmDialog(false)
        setLocationData(null)
        setConfirmAction(null)
    }

    const calculateDuration = (inTime, outTime) => {
        if (!inTime || !outTime) return null;
        const diff = new Date(outTime) - new Date(inTime);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    const myLeaves = useMemo(() => {
        return (allLeaves && employee) ? allLeaves.filter(l => l.employee?._id === employee._id) : []
    }, [allLeaves, employee])

    const attendanceLogs = useMemo(() => {
        return currentAttendance?.attendancelog || []
    }, [currentAttendance])

    const todayLog = useMemo(() => {
        const today = new Date().toISOString().split("T")[0]
        return attendanceLogs.find(log => new Date(log.logdate).toISOString().split("T")[0] === today)
    }, [attendanceLogs])

    const canLogin = !todayLog || !todayLog.loginTime
    const canLogout = todayLog && todayLog.loginTime && !todayLog.logoutTime

    if (isEmpLoading || !employee) return <Loading />

    const profileDetails = [
        { icon: <Briefcase className="w-4 h-4 text-blue-500" />, label: "Designation", value: employee.designation || "Not Set" },
        { icon: <Clock className="w-4 h-4 text-emerald-500" />, label: "Status", value: employee.employmentstatus || "Probationary" },
        { icon: <Calendar className="w-4 h-4 text-orange-500" />, label: "Joined", value: employee.startdate ? new Date(employee.startdate).toLocaleDateString() : "Not Set" },
        { icon: <CreditCard className="w-4 h-4 text-purple-500" />, label: "Employee ID", value: employee._id?.toString().slice(-6).toUpperCase() },
    ]

    const contactDetails = [
        { icon: <Mail className="w-3.5 h-3.5 text-slate-400" />, value: employee.email },
        { icon: <Phone className="w-3.5 h-3.5 text-slate-400" />, value: employee.contactnumber },
        { icon: <MapPin className="w-3.5 h-3.5 text-slate-400" />, value: employee.presentaddress || "No address provided" },
    ]

    const latestStatus = todayLog?.logstatus || "Not Set";

    return (
        <div className="employee-dashboard min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans antialiased text-slate-900">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/50 ring-1 ring-slate-200/50">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-2xl overflow-hidden">
                                <User className="w-10 h-10 animate-in zoom-in-75 duration-500" />
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
                                Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{employee.firstname}!</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-lg">Your workspace overview for {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">

                        <Button
                            variant="ghost"
                            className="bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-100 font-semibold px-6 py-6 rounded-2xl transition-all duration-300 gap-2 shrink-0 h-auto"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Sticky Sidebar */}
                    <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-8 animate-in slide-in-from-left duration-700">
                        <Card className="border-none shadow-xl shadow-slate-200/60 bg-white overflow-hidden rounded-3xl group">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:scale-x-110 transition-transform duration-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-xl">
                                        <ClipboardList className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Profile Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-0">
                                <div className="grid grid-cols-1 gap-5">
                                    {profileDetails.map((detail, idx) => (
                                        <div key={idx} className="flex flex-col space-y-1.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors duration-200">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                {detail.icon} {detail.label}
                                            </span>
                                            <span className="text-sm font-bold text-slate-700 ps-6">{detail.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-slate-100 space-y-3">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Contact Details</h4>
                                    {contactDetails.map((detail, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-slate-500 p-3 rounded-2xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-100">
                                            <div className="p-2 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm">
                                                {detail.icon}
                                            </div>
                                            <span className="text-xs font-semibold truncate">{detail.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-10 animate-in slide-in-from-bottom duration-700">
                        {/* Attendance Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-xl">
                                        <Clock className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    Attendance Overview
                                </h2>
                                <div className="flex gap-3">
                                    {canLogin && (
                                        <Button
                                            onClick={handleAttendanceLogin}
                                            disabled={isCapturingGPS || isActionLoading}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-6 rounded-2xl transition-all duration-300 gap-2 h-auto shadow-lg shadow-emerald-200/50"
                                        >
                                            {isCapturingGPS || isActionLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    {isCapturingGPS ? "Getting Location..." : "Logging In..."}
                                                </>
                                            ) : (
                                                <>
                                                    <LogIn className="w-4 h-4" />
                                                    Clock In
                                                </>
                                            )}
                                        </Button>
                                    )}
                                    {canLogout && (
                                        <Button
                                            onClick={handleAttendanceLogout}
                                            disabled={isCapturingGPS || isActionLoading}
                                            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-6 rounded-2xl transition-all duration-300 gap-2 h-auto shadow-lg shadow-rose-200/50"
                                        >
                                            {isCapturingGPS || isActionLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    {isCapturingGPS ? "Getting Location..." : "Logging Out..."}
                                                </>
                                            ) : (
                                                <>
                                                    <LogOut className="w-4 h-4" />
                                                    Clock Out
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                {/* Today's Card */}
                                <Card className="md:col-span-4 border-none shadow-xl shadow-blue-200/30 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                        <Clock className="w-32 h-32" />
                                    </div>
                                    <CardHeader className="pb-0">
                                        <CardTitle className="text-xs font-bold text-blue-100 uppercase tracking-widest opacity-80 flex items-center gap-2">
                                            Today's Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 relative z-10">
                                        <div className="space-y-6">
                                            <div>
                                                <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider mb-4 border border-white/20 uppercase">
                                                    {latestStatus === "Present" ? "Logged In" : "Pending Log"}
                                                </div>
                                                <p className="text-5xl font-black tracking-tight mb-2 drop-shadow-md">
                                                    {latestStatus}
                                                </p>
                                                <p className="text-sm font-medium text-blue-100/80 pe-8 italic">
                                                    Your status for today, {new Date().toLocaleDateString(undefined, { weekday: 'long' })}.
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <div className="text-blue-100 flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold opacity-60">Last Sync</span>
                                                    <span className="text-xs font-bold">Just now</span>
                                                </div>
                                                <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md animate-pulse">
                                                    {latestStatus === "Present" ? (
                                                        <CheckCircle className="w-6 h-6 text-emerald-300" />
                                                    ) : (
                                                        <AlertCircle className="w-6 h-6 text-amber-300" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* History Card */}
                                <Card className="md:col-span-8 border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
                                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <CardTitle className="text-lg font-bold flex items-center gap-3 text-slate-800">
                                                Recent History
                                            </CardTitle>
                                            <CardDescription className="text-xs font-medium">Tracking your last 5 work entries</CardDescription>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider text-slate-400 py-1.5 px-3 rounded-full border-slate-200">
                                            Activity Log
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead>
                                                    <tr className="bg-slate-50/50 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                        <th className="px-6 py-4">Date & Status</th>
                                                        <th className="px-6 py-4">Timeline & Location</th>
                                                        <th className="px-6 py-4 text-right">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {attendanceLogs.length > 0 ? (
                                                        [...attendanceLogs].reverse().slice(0, 5).map((log, idx) => (
                                                            <tr key={idx} className="group hover:bg-slate-50/80 transition-all duration-300">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-bold text-slate-700 tracking-tight">
                                                                            {new Date(log.logdate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                        </span>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <div className={`h-1.5 w-1.5 rounded-full ${log.logstatus === "Present" ? "bg-emerald-500 shadow-sm" :
                                                                                log.logstatus === "Absent" ? "bg-rose-500 shadow-sm" : "bg-slate-300"}`} />
                                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${log.logstatus === "Present" ? "text-emerald-500" :
                                                                                log.logstatus === "Absent" ? "text-rose-500" : "text-slate-400"}`}>
                                                                                {log.logstatus}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex flex-col gap-2">
                                                                        <div className="flex items-center gap-4">
                                                                            {/* Clock In */}
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                                                                                    <LogIn className="w-3 h-3" />
                                                                                </div>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">In</span>
                                                                                    <span className="text-xs font-bold text-slate-600">
                                                                                        {log.loginTime ? new Date(log.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
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
                                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Out</span>
                                                                                    <span className="text-xs font-bold text-slate-600">
                                                                                        {log.logoutTime ? new Date(log.logoutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Addresses */}
                                                                        {(log.loginLocation?.address || log.logoutLocation?.address) && (
                                                                            <div className="flex flex-col gap-0.5 max-w-[200px]">
                                                                                {log.loginLocation?.address && (
                                                                                    <div className="flex items-start gap-1">
                                                                                        <MapPin className="w-2.5 h-2.5 text-slate-300 mt-0.5 flex-shrink-0" />
                                                                                        <span className="text-[9px] text-slate-400 truncate" title={log.loginLocation.address}>
                                                                                            {log.loginLocation.address}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex flex-col items-end">
                                                                        <span className="font-bold text-slate-700 text-sm">
                                                                            {calculateDuration(log.loginTime, log.logoutTime) || "--"}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Hrs Worked</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="2" className="py-12 text-center">
                                                                <div className="flex flex-col items-center gap-2 opacity-30">
                                                                    <History className="w-8 h-8" />
                                                                    <span className="text-xs font-bold uppercase tracking-widest italic">No history available</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Leaves Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-xl">
                                        <Umbrella className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    Leave Management
                                </h2>
                                <ApplyLeaveDialog employeeCredits={employee.leaveCredits} employeeId={employee._id} />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                                {employee.leaveCredits && Object.entries(employee.leaveCredits).map(([key, value]) => {
                                    if (typeof value !== 'number') return null;
                                    const leaveName = key.replace(/Leave$/, '');
                                    const icon = getLeaveIcon(leaveName);

                                    return (
                                        <Card key={key} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl overflow-hidden hover:-translate-y-1">
                                            <CardHeader className="p-6 pb-2">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="p-2 w-10 h-10 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center">
                                                        {icon}
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-200 uppercase tracking-tighter">Days</span>
                                                </div>
                                                <CardTitle className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                                                    {leaveName}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6 pt-0">
                                                <div className="flex items-baseline gap-1.5 mb-4">
                                                    <span className="text-3xl font-black text-slate-800 tabular-nums">{value}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                                                </div>
                                                <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${Math.min((value / 15) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>

                            {/* Recent Leave Requests Table */}
                            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
                                    <div className="flex flex-col gap-1">
                                        <CardTitle className="text-lg font-bold text-slate-800">Recent Applications</CardTitle>
                                        <CardDescription className="text-xs font-medium">Review your latest leave requests</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full">
                                        <span className="text-xs font-bold text-slate-800">{myLeaves.length}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requests</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="bg-slate-50/50 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                    <th className="px-8 py-4">Leave Type</th>
                                                    <th className="px-8 py-4">Duration & Dates</th>
                                                    <th className="px-8 py-4 text-right">Current Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {myLeaves.length > 0 ? myLeaves.slice(0, 5).map((leave) => (
                                                    <tr key={leave._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                                                                    {getLeaveIcon(leave.leaveType)}
                                                                </div>
                                                                <span className="font-bold text-slate-700">{leave.leaveType}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-600 font-semibold tracking-tight">
                                                                    {new Date(leave.startdate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(leave.enddate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                </span>
                                                                <span className="text-[10px] text-slate-400 font-bold uppercase italic">
                                                                    Applied on {new Date(leave.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <Badge className={`${leave.status === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                leave.status === "Rejected" ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                                                } border font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-widest shadow-sm`}>
                                                                {leave.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="3" className="py-12 text-center">
                                                            <div className="flex flex-col items-center gap-2 opacity-30">
                                                                <Umbrella className="w-8 h-8" />
                                                                <span className="text-xs font-bold uppercase tracking-widest italic">No leave requests found</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex justify-center">
                                        <Button variant="ghost" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 gap-2">
                                            View Full History <ChevronRight className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>

            {/* Attendance Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {confirmAction === 'login' ? (
                                <>
                                    <LogIn className="w-5 h-5 text-green-600" />
                                    Confirm Clock In
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-5 h-5 text-red-600" />
                                    Confirm Clock Out
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Please review your attendance information before confirming.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Date & Time */}
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</p>
                                <p className="text-sm font-bold text-slate-700 mt-1">
                                    {new Date().toLocaleString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* GPS Location & Address */}
                        {locationData && (
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location Address</p>
                                        <p className="text-sm font-medium text-slate-700 mt-1 leading-relaxed">
                                            {locationData.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">GPS Coordinates</p>
                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                            <p className="text-xs text-slate-600">
                                                <span className="font-semibold">Lat:</span> {locationData.latitude.toFixed(6)}
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                <span className="font-semibold">Long:</span> {locationData.longitude.toFixed(6)}
                                            </p>
                                            <p className="text-xs text-slate-600">
                                                <span className="font-semibold">Accuracy:</span> ±{locationData.accuracy.toFixed(1)}m
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Type */}
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <ClipboardList className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Action</p>
                                <p className="text-sm font-bold text-slate-700 mt-1">
                                    {confirmAction === 'login' ? 'Clock In - Start Work' : 'Clock Out - End Work'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={cancelAttendance}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmAttendance}
                            disabled={isCapturingGPS || !locationData}
                            className={`flex-1 ${confirmAction === 'login'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            {isCapturingGPS ? 'Processing...' : 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
