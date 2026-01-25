import { Navigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { HandleGetEmployees } from "../redux/Thunks/EmployeeThunk"
import { Loading } from "../components/common/loading"

export const ProtectedRoutes = ({ children }) => {
    const { isAuthenticated, isLoading, error } = useSelector((state) => state.employeereducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isAuthenticated && !error.status) {
            dispatch(HandleGetEmployees({ apiroute: "CHECKELOGIN" }))
        }
    }, [isAuthenticated, dispatch, error.status])

    // Only show loading if we are NOT currently authenticated and we ARE loading
    // This prevents the dashboard from unmounting when it fetches its own data after mount
    if (isLoading && !isAuthenticated) {
        return <Loading />
    }

    return (
        isAuthenticated ? children : (error.status ? <Navigate to="/" /> : null)
    )
}