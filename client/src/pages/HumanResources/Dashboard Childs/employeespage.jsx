import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { AddEmployeesDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx"
import { DataTable } from "../../../components/common/DataTable.jsx"
import { columns } from "./columns.jsx"
import { Users, UserPlus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export const HREmployeesPage = () => {
    const dispatch = useDispatch()
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)

    useEffect(() => {
        if (HREmployeesState.fetchData) {
            dispatch(HandleGetHREmployees({ apiroute: "GETALL" }))
        }
    }, [HREmployeesState.fetchData, dispatch])

    useEffect(() => {
        dispatch(HandleGetHREmployees({ apiroute: "GETALL" }))
    }, [dispatch])

    if (HREmployeesState.isLoading) {
        return <Loading />
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <Users className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workforce Directory</h1>
                        <p className="text-slate-500 font-medium text-sm">Manage and monitor all organization members.</p>
                    </div>
                </div>
                <div className="w-full md:w-auto">
                    <AddEmployeesDialogBox />
                </div>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-slate-50 px-8 py-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-xl">
                            <Users className="w-5 h-5 text-slate-400" />
                        </div>
                        Employee List
                    </CardTitle>
                    <CardDescription className="text-xs font-medium">Search and filter organization employees</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="px-4 py-4">
                        <DataTable columns={columns} data={HREmployeesState.data || []} searchKey="email" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
