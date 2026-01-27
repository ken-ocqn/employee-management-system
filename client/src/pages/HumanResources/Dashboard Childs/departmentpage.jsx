import { Building2 } from "lucide-react"
import { CreateDepartmentDialogBox } from "../../../components/common/Dashboard/dialogboxes"
import { HRDepartmentTabs } from "../../../components/common/Dashboard/department-tabs"

export const HRDepartmentPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Department Management</h1>
                        <p className="text-slate-500 font-medium text-sm">Organize and structure organization units.</p>
                    </div>
                </div>
                <div className="w-full md:w-auto">
                    <CreateDepartmentDialogBox />
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50">
                <HRDepartmentTabs />
            </div>
        </div>
    )
}