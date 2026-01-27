import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { HandlePostHumanResources } from "@/redux/Thunks/HRThunk.js"
import {
    LayoutDashboard,
    Users,
    Building2,
    Banknote,
    BellRing,
    Umbrella,
    Clock,
    UserPlus,
    BarChart3,
    MessageCircle,
    UserCircle,
    LogOut
} from "lucide-react"

export function HRdashboardSidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(HandlePostHumanResources({ apiroute: "LOGOUT", data: {} }))
            .then((res) => {
                if (res.payload && res.payload.type === "HRLogout") {
                    navigate("/")
                }
            })
    }

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    {/* <SidebarGroupLabel>HR-Dashboard EMS</SidebarGroupLabel> */}
                    <SidebarGroupContent>

                        <SidebarMenu className="gap-2 p-2">
                            <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Main Menu</SidebarGroupLabel>

                            <NavLink to={"/HR/dashboard/dashboard-data"} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                <LayoutDashboard className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Dashboard</span>
                            </NavLink>

                            <NavLink to={"/HR/dashboard/employees"} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                <Users className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Employees</span>
                            </NavLink>

                            <NavLink to={"/HR/dashboard/departments"} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                <Building2 className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Departments</span>
                            </NavLink>

                            <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Operations</SidebarGroupLabel>

                            <NavLink to={"/HR/dashboard/salaries"} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                <Banknote className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Salaries</span>
                            </NavLink>

                            <NavLink to={"/HR/dashboard/notices"} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                <BellRing className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Issue Notices</span>
                            </NavLink>

                            <NavLink to={"/HR/dashboard/leaves"} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                <Umbrella className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Leaves</span>
                            </NavLink>

                            <NavLink to={"/HR/dashboard/attendances"} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                <Clock className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Attendances</span>
                            </NavLink>

                            <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Talent Management</SidebarGroupLabel>

                            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-300 cursor-not-allowed">
                                <UserPlus className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Recruitment</span>
                            </div>

                            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-300 cursor-not-allowed">
                                <BarChart3 className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Interview Insights</span>
                            </div>

                            <NavLink to={"/HR/dashboard/requests"} className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Requests</span>
                            </NavLink>

                            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-300 cursor-not-allowed">
                                <UserCircle className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">HR Profiles</span>
                            </div>

                            <div className="mt-auto pt-6">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all duration-300 group"
                                >
                                    <div className="p-2 rounded-xl bg-rose-50 group-hover:bg-rose-100 transition-colors">
                                        <LogOut className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">Logout</span>
                                </button>
                            </div>
                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )

}
