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
        <div className="relative">
            <LoadingBar ref={loadingbar} />

            <Tabs defaultValue="employee" className="w-full" onValueChange={setActiveTab}>
                <TabsContent value="employee" className="m-0 border-none p-0 outline-none">
                    <SignIn
                        handlesigninform={handleEmployeeChange}
                        handlesigninsubmit={handleEmployeeSubmit}
                        targetedstate={EmployeeState}
                        statevalue={employeeForm}
                        redirectpath={"/auth/employee/forgot-password"}
                    >
                        <TabsList className="bg-slate-100/50 backdrop-blur-md p-1.5 rounded-[1.25rem] border border-white/40 shadow-inner w-[320px] h-14">
                            <TabsTrigger
                                value="employee"
                                className="rounded-xl font-black text-sm uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 h-full"
                            >
                                Employee
                            </TabsTrigger>
                            <TabsTrigger
                                value="hr"
                                className="rounded-xl font-black text-sm uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 h-full"
                            >
                                HR Admin
                            </TabsTrigger>
                        </TabsList>
                    </SignIn>
                </TabsContent>

                <TabsContent value="hr" className="m-0 border-none p-0 outline-none">
                    <SignIn
                        handlesigninform={handleHRChange}
                        handlesigninsubmit={handleHRSubmit}
                        targetedstate={HRState}
                        statevalue={hrForm}
                        redirectpath={"/auth/HR/forgot-password"}
                    >
                        <TabsList className="bg-slate-100/50 backdrop-blur-md p-1.5 rounded-[1.25rem] border border-white/40 shadow-inner w-[320px] h-14">
                            <TabsTrigger
                                value="employee"
                                className="rounded-xl font-black text-sm uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 h-full"
                            >
                                Employee
                            </TabsTrigger>
                            <TabsTrigger
                                value="hr"
                                className="rounded-xl font-black text-sm uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all duration-300 h-full"
                            >
                                HR Admin
                            </TabsTrigger>
                        </TabsList>
                    </SignIn>
                </TabsContent>
            </Tabs>
        </div>
    )
}
