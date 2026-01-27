import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"
import { HRdashboardSidebar } from "../../components/ui/HRsidebar.jsx"
import { Outlet } from "react-router-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"

export const HRDashbaord = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const pathArray = location.pathname.split("/")


    useEffect(() => {
        if (location.pathname === "/HR/dashboard" || location.pathname === "/HR/dashboard/") {
            navigate("/HR/dashboard/dashboard-data")
        }
    }, [location.pathname, navigate])


    console.log("this is the current path location", location)


    return (
        <div className="HR-dashboard-container flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
            <SidebarProvider>
                <div className="HRDashboard-sidebar border-r border-slate-200/50 bg-white/50 backdrop-blur-xl">
                    <HRdashboardSidebar />
                </div>
                <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/3 bg-blue-50/50 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-indigo-50/50 blur-[100px] rounded-full" />

                    <header className="h-16 flex items-center px-8 border-b border-slate-200/50 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                        <SidebarTrigger className="hover:bg-slate-100 rounded-lg transition-colors" />
                        <div className="ms-4 h-6 w-[1px] bg-slate-200" />
                        <span className="ms-4 text-xs font-bold text-slate-400 uppercase tracking-widest">HR Admin Management</span>
                    </header>

                    <div className="flex-1 overflow-auto p-8 animate-in fade-in duration-700">
                        <Outlet />
                    </div>
                </main>
            </SidebarProvider>
        </div>
    )
}