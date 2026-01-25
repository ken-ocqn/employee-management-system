import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignIn } from "../../components/common/sign-in.jsx"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandlePostEmployees, HandleGetEmployees } from "../../redux/Thunks/EmployeeThunk.js"
import { HandleGetHumanResources, HandlePostHumanResources } from "../../redux/Thunks/HRThunk.js"
import LoadingBar from 'react-top-loading-bar'
import { useNavigate } from 'react-router-dom'
import { CommonStateHandler } from "../../utils/commonhandler.js"

export const EntryPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const loadingbar = useRef(null)

    // States
    const EmployeeState = useSelector((state) => state.employeereducer)
    const HRState = useSelector((state) => state.HRReducer)

    const [activeTab, setActiveTab] = useState("employee")
    const [loginAttempted, setLoginAttempted] = useState({ employee: false, hr: false })

    const [employeeForm, setEmployeeForm] = useState({
        email: "",
        password: "",
    })

    const [hrForm, setHrForm] = useState({
        email: "",
        password: ""
    })

    // Handlers
    const handleEmployeeChange = (event) => CommonStateHandler(employeeForm, setEmployeeForm, event)
    const handleHRChange = (event) => CommonStateHandler(hrForm, setHrForm, event)

    const handleEmployeeSubmit = (e) => {
        e.preventDefault();
        loadingbar.current.continuousStart();
        setLoginAttempted({ ...loginAttempted, employee: true })
        dispatch(HandlePostEmployees({ apiroute: "LOGIN", data: employeeForm }))
    }

    const handleHRSubmit = (e) => {
        e.preventDefault();
        loadingbar.current.continuousStart();
        setLoginAttempted({ ...loginAttempted, hr: true })
        dispatch(HandlePostHumanResources({ apiroute: "LOGIN", data: hrForm }))
    }

    // Check for existing session on land
    useEffect(() => {
        if (!EmployeeState.isAuthenticated && !EmployeeState.error.status) {
            dispatch(HandleGetEmployees({ apiroute: "CHECKELOGIN" }))
        }
        if (!HRState.isAuthenticated && !HRState.error.status) {
            dispatch(HandleGetHumanResources({ apiroute: "CHECKLOGIN" }))
        }
    }, [dispatch])

    // Auto-redirection if already authenticated
    useEffect(() => {
        if (EmployeeState.isAuthenticated) {
            navigate("/auth/employee/employee-dashboard")
        }
    }, [EmployeeState.isAuthenticated, navigate])

    useEffect(() => {
        if (HRState.isAuthenticated) {
            navigate("/HR/dashboard")
        }
    }, [HRState.isAuthenticated, navigate])

    // Redirection Effects - only redirect after a fresh login attempt
    useEffect(() => {
        if (loginAttempted.employee && EmployeeState.isAuthenticated) {
            loadingbar.current?.complete()
            navigate("/auth/employee/employee-dashboard")
        }
    }, [loginAttempted.employee, EmployeeState.isAuthenticated, navigate])

    useEffect(() => {
        if (loginAttempted.hr && HRState.isAuthenticated) {
            loadingbar.current?.complete()
            navigate("/HR/dashboard")
        }
    }, [loginAttempted.hr, HRState.isAuthenticated, navigate])

    // Error Handling loading bar completion
    if (EmployeeState.error.status || HRState.error.status) {
        loadingbar.current?.complete()
    }

    return (
        <div className="entry-page-container h-screen flex flex-col justify-center items-center bg-gray-50">
            <LoadingBar ref={loadingbar} />
            <div className="w-full max-w-4xl p-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome to Employee Management System</h1>
                    <p className="text-gray-600">Please select your role to login</p>
                </div>

                <Tabs defaultValue="employee" className="w-full flex flex-col items-center" onValueChange={setActiveTab}>
                    <TabsList className="grid w-[400px] grid-cols-2 mb-8">
                        <TabsTrigger value="employee">Employee</TabsTrigger>
                        <TabsTrigger value="hr">HR Admin</TabsTrigger>
                    </TabsList>

                    <TabsContent value="employee" className="w-full">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <SignIn
                                image={"/assets/Employee-Welcome.jpg"}
                                handlesigninform={handleEmployeeChange}
                                handlesigninsubmit={handleEmployeeSubmit}
                                targetedstate={EmployeeState}
                                statevalue={employeeForm}
                                redirectpath={"/auth/employee/forgot-password"}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="hr" className="w-full">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <SignIn
                                image={"/assets/Employee-Welcome.jpg"}
                                handlesigninform={handleHRChange}
                                handlesigninsubmit={handleHRSubmit}
                                targetedstate={HRState}
                                statevalue={hrForm}
                                redirectpath={"/auth/HR/forgot-password"}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}