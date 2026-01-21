import { useToast } from "../../../hooks/use-toast.js"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef } from "react"
import { HandlePostHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js"
export const FormSubmitToast = ({ formdata, disabled = false }) => {
    const { toast } = useToast()
    const dispatch = useDispatch()
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)
    const prevFetchDataRef = useRef(false)
    const prevErrorStatusRef = useRef(false)

    const SubmitFormData = async () => {
        dispatch(HandlePostHREmployees({ apiroute: "ADDEMPLOYEE", data: formdata }))
    }

    // Watch for state changes and show toast notifications
    useEffect(() => {
        // Success notification
        if (HREmployeesState.fetchData && !prevFetchDataRef.current) {
            toast({
                title: "Success!",
                description: "Employee added successfully.",
                className: "bg-green-50 border-green-500",
            })
        }

        // Error notification
        if (HREmployeesState.error.status && !prevErrorStatusRef.current) {
            toast({
                variant: "destructive",
                title: "Error",
                description: HREmployeesState.error.message || "Failed to add employee. Please try again.",
            })
        }

        // Update refs
        prevFetchDataRef.current = HREmployeesState.fetchData
        prevErrorStatusRef.current = HREmployeesState.error.status
    }, [HREmployeesState.fetchData, HREmployeesState.error.status, toast])

    return (
        <>
            <Button
                variant="outline"
                disabled={disabled || HREmployeesState.isLoading}
                onClick={() => {
                    SubmitFormData()
                }}
                className={`bg-blue-800 border-2 border-blue-800 px-4 py-2 text-white font-bold rounded-lg ${(disabled || HREmployeesState.isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-blue-800'}`}
            >
                {HREmployeesState.isLoading ? "Adding..." : "Add Employee"}
            </Button>
        </>
    )
}
