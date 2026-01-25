import { configureStore } from '@reduxjs/toolkit'
import EmployeeReducer from "../Slices/EmployeeSlice.js"
import HRReducer from '../Slices/HRSlice.js'
import DashbaordReducer from "../Slices/DashboardSlice.js"
import HREmployeesPageReducer from '../Slices/HREmployeesPageSlice.js'
import HRDepartmentPageReducer from '../Slices/HRDepartmentPageSlice.js'
import EMployeesIDReducer from '../Slices/EmployeesIDsSlice.js'
import LeavesReducer from '../Slices/LeavesSlice.js'
import SalaryReducer from '../Slices/SalarySlice.js'
import NoticeReducer from '../Slices/NoticeSlice.js'
import AttendanceReducer from '../Slices/AttendanceSlice.js'
import RequestReducer from '../Slices/RequestSlice.js'



export const store = configureStore({
    reducer: {
        employeereducer: EmployeeReducer,
        HRReducer: HRReducer,
        dashboardreducer: DashbaordReducer,
        HREmployeesPageReducer: HREmployeesPageReducer,
        HRDepartmentPageReducer: HRDepartmentPageReducer,
        EMployeesIDReducer: EMployeesIDReducer,
        leavesreducer: LeavesReducer,
        salaryreducer: SalaryReducer,
        noticereducer: NoticeReducer,
        attendancereducer: AttendanceReducer,
        requestreducer: RequestReducer
    }
})