import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetNotices } from "../../../redux/Thunks/NoticeThunk.js"
import { HandleGetHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js"
import { HandleGetHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { AddNoticeDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx"
import { DataTable } from "../../../components/common/DataTable.jsx"
import { noticesColumns } from "./noticesColumns.jsx"

export const HRNoticesPage = () => {
    const dispatch = useDispatch()
    const noticeState = useSelector((state) => state.noticereducer)
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)
    const HRDepartmentState = useSelector((state) => state.HRDepartmentPageReducer)

    useEffect(() => {
        if (noticeState.fetchData) {
            dispatch(HandleGetNotices())
        }
        if (!HREmployeesState.data) {
            dispatch(HandleGetHREmployees({ apiroute: "GETALL" }))
        }
        if (!HRDepartmentState.data) {
            dispatch(HandleGetHRDepartments({ apiroute: "GETALL" }))
        }
    }, [noticeState.fetchData, HREmployeesState.data, HRDepartmentState.data, dispatch])

    if (noticeState.isLoading && noticeState.allNotices.length === 0) {
        return (
            <Loading />
        )
    }

    return (
        <div className="notice-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="notices-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Issue Notices</h1>
                <div className="notice-create-button">
                    <AddNoticeDialogBox />
                </div>
            </div>
            <div className="notices-data flex flex-col gap-4 md:pe-5 overflow-auto">
                <DataTable columns={noticesColumns} data={noticeState.allNotices || []} searchKey="title" />
            </div>
        </div>
    )
}
