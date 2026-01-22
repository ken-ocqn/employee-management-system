import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetSalaries } from "../../../redux/Thunks/SalaryThunk.js"
import { HandleGetHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { AddSalaryDialogBox } from "../../../components/common/Dashboard/dialogboxes.jsx"
import { DataTable } from "../../../components/common/DataTable.jsx"
import { salaryColumns } from "./salaryColumns.jsx"

export const HRSalariesPage = () => {
    const dispatch = useDispatch()
    const salaryState = useSelector((state) => state.salaryreducer)
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)

    useEffect(() => {
        if (salaryState.fetchData) {
            dispatch(HandleGetSalaries())
        }
        if (!HREmployeesState.data) {
            dispatch(HandleGetHREmployees({ apiroute: "GETALL" }))
        }
    }, [salaryState.fetchData, HREmployeesState.data, dispatch])

    if (salaryState.isLoading && salaryState.allSalaries.length === 0) {
        return (
            <Loading />
        )
    }

    return (
        <div className="salary-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="salaries-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Salaries</h1>
                <div className="salary-create-button">
                    <AddSalaryDialogBox />
                </div>
            </div>
            <div className="salaries-data flex flex-col gap-4 md:pe-5 overflow-auto">
                <DataTable columns={salaryColumns} data={salaryState.allSalaries || []} searchKey="employee" />
            </div>
        </div>
    )
}
