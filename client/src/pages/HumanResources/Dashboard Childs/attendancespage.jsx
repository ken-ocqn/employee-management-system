import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DataTable } from "../../../components/common/DataTable.jsx"
import { attendanceColumns } from "./attendanceColumns.jsx"
import { HandleGetAttendances } from "../../../redux/Thunks/AttendanceThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const HRAttendancesPage = () => {
    const dispatch = useDispatch()
    const { allAttendance, isLoading } = useSelector((state) => state.attendancereducer)

    useEffect(() => {
        dispatch(HandleGetAttendances())
    }, [dispatch])

    if (isLoading && !allAttendance.length) return <Loading />

    return (
        <div className="attendance-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%] overflow-auto">
            <div className="attendance-heading">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Attendance Management</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Records</CardTitle>
                    <CardDescription>Monitor and update employee attendance logs for today.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={attendanceColumns}
                        data={allAttendance}
                        searchKey="employee.lastname"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
