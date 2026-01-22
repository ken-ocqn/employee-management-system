import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ErrorPopup } from "../error-popup.jsx"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { CommonStateHandler } from "../../../utils/commonhandler.js"
import { useDispatch, useSelector } from "react-redux"
import { FormSubmitToast } from "./Toasts.jsx"
import { Loading } from "../loading.jsx"
import { HandleDeleteHREmployees, HandleUpdateHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js"
import { HandlePostHRDepartments, HandlePatchHRDepartments, HandleDeleteHRDepartments } from "../../../redux/Thunks/HRDepartmentPageThunk.js"
import { HandleCreateSalary, HandleUpdateSalary, HandleDeleteSalary } from "../../../redux/Thunks/SalaryThunk.js"
import { HandleCreateNotice, HandleUpdateNotice, HandleDeleteNotice } from "../../../redux/Thunks/NoticeThunk.js"
import { useToast } from "../../../hooks/use-toast.js"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { fetchEmployeesIDs } from "../../../redux/Thunks/EmployeesIDsThunk.js"
import {
    validateName,
    validateEmail,
    validatePhoneNumber,
    validateSSS,
    validatePhilHealth,
    validateTIN,
    validatePagibig,
    validateAge,
    validateFutureDate,
    validatePassword,
    validateAddress,
    validateTextField
} from "../../../utils/formValidation.js"


export const AddEmployeesDialogBox = () => {
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)
    const [formdata, setformdata] = useState({
        firstname: "",
        lastname: "",
        email: "",
        contactnumber: "",
        textpassword: "",
        password: "",
        sss: "",
        philhealth: "",
        tin: "",
        pagibig: "",
        permanentaddress: "",
        presentaddress: "",
        birthdate: "",
        birthplace: "",
        designation: "",
        startdate: "",
        evaluationdate: "",
        regularizationdate: ""
    })

    const [errors, setErrors] = useState({})

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'firstname':
            case 'lastname':
                if (value && !validateName(value)) {
                    error = 'Must be 2-50 characters, letters only';
                }
                break;
            case 'email':
                if (value && !validateEmail(value)) {
                    error = 'Invalid email format';
                }
                break;
            case 'contactnumber':
                if (value && !validatePhoneNumber(value)) {
                    error = 'Must be 10-11 digits';
                }
                break;
            case 'textpassword':
                if (value && !validatePassword(value)) {
                    error = 'Must be at least 8 characters';
                }
                break;
            case 'sss':
                if (value && !validateSSS(value)) {
                    error = 'Invalid format (XX-XXXXXXX-X or 10 digits)';
                }
                break;
            case 'philhealth':
                if (value && !validatePhilHealth(value)) {
                    error = 'Invalid format (XX-XXXXXXXXX-X or 12 digits)';
                }
                break;
            case 'tin':
                if (value && !validateTIN(value)) {
                    error = 'Invalid format (XXX-XXX-XXX or 9-12 digits)';
                }
                break;
            case 'pagibig':
                if (value && !validatePagibig(value)) {
                    error = 'Invalid format (XXXX-XXXX-XXXX or 12 digits)';
                }
                break;
            case 'permanentaddress':
            case 'presentaddress':
                if (value && !validateAddress(value)) {
                    error = 'Must be 10-200 characters';
                }
                break;
            case 'birthdate':
                if (value && !validateAge(value)) {
                    error = 'Must be at least 18 years old';
                }
                break;
            case 'birthplace':
            case 'designation':
                if (value && !validateTextField(value)) {
                    error = 'Must be 2-100 characters';
                }
                break;
            case 'startdate':
                if (value && !validateFutureDate(value)) {
                    error = 'Cannot be in the future';
                }
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    }

    const handleformchange = (event) => {
        const { name, value } = event.target;
        CommonStateHandler(formdata, setformdata, event);
        validateField(name, value);
    }


    // Auto-compute evaluation and regularization dates based on start date
    useEffect(() => {
        if (formdata.startdate) {
            const startDate = new Date(formdata.startdate);

            // Calculate evaluation date (4 months after start date)
            const evalDate = new Date(startDate);
            evalDate.setMonth(evalDate.getMonth() + 4);

            // Calculate regularization date (6 months after start date)
            const regDate = new Date(startDate);
            regDate.setMonth(regDate.getMonth() + 6);

            // Format dates as YYYY-MM-DD
            const formatDate = (date) => date.toISOString().split('T')[0];

            setformdata(prev => ({
                ...prev,
                evaluationdate: formatDate(evalDate),
                regularizationdate: formatDate(regDate)
            }));
        }
    }, [formdata.startdate]);

    // Check if form is complete and valid
    const isFormValid = () => {
        // Define required fields
        const requiredFields = [
            'firstname',
            'lastname',
            'email',
            'contactnumber',
            'textpassword',
            'password',
            'designation',
            'startdate'
        ];

        // Check if required fields have validation errors
        const hasRequiredFieldErrors = requiredFields.some(field => errors[field] && errors[field] !== '');
        if (hasRequiredFieldErrors) return false;

        // Check if all required fields are filled
        const allRequiredFilled = requiredFields.every(field => {
            return formdata[field] && formdata[field].trim() !== '';
        });

        return allRequiredFilled;
    };



    return (
        <div className="AddEmployees-content">
            <Dialog>
                <DialogTrigger className="bg-blue-800 border-2 border-blue-800 md:px-4 md:py-2 md:text-lg min-[250px]:px-2 min-[250px]:py-1 min-[250px]:text-sm text-white font-bold rounded-lg hover:bg-white hover:text-blue-800">Add Employees</DialogTrigger>
                <DialogContent className="max-w-[315px] sm:max-w-[80vw] 2xl:max-w-[60vw] h-[80vh] overflow-y-auto">
                    <div className="add-employees-container flex flex-col gap-5 h-full">
                        <div className="heading">
                            <h1 className="font-bold text-2xl">Add Employee Info</h1>
                        </div>
                        <Tabs defaultValue="account" className="w-full h-full flex flex-col">
                            <TabsList className="grid w-full grid-cols-4 mb-4">
                                <TabsTrigger value="account">Account</TabsTrigger>
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="employment">Employment</TabsTrigger>
                                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account" className="flex-1">
                                <div className="form-group flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2">Account Details</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="firstname" className="md:text-md lg:text-lg font-bold">First Name</label>
                                            <input type="text"
                                                id="firstname"
                                                className={`border-2 rounded px-2 py-1 ${errors.firstname ? 'border-red-500' : 'border-gray-700'}`}
                                                name="firstname"
                                                value={formdata.firstname}
                                                onChange={handleformchange} />
                                            {errors.firstname && <span className="text-red-500 text-xs mt-1">{errors.firstname}</span>}
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="lastname" className="md:text-md lg:text-lg font-bold">Last Name</label>
                                            <input type="text"
                                                id="lastname"
                                                className={`border-2 rounded px-2 py-1 ${errors.lastname ? 'border-red-500' : 'border-gray-700'}`}
                                                name="lastname"
                                                value={formdata.lastname}
                                                onChange={handleformchange} />
                                            {errors.lastname && <span className="text-red-500 text-xs mt-1">{errors.lastname}</span>}
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="email" className="md:text-md lg:text-lg font-bold">Email</label>
                                            <input type="email"
                                                id="email" required={true} className={`border-2 rounded px-2 py-1 ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
                                                name="email"
                                                value={formdata.email}
                                                onChange={handleformchange} />
                                            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="contactnumber" className="md:text-md lg:text-lg font-bold">Contact Number</label>
                                            <input type="number"
                                                id="contactnumber" className={`border-2 rounded px-2 py-1 ${errors.contactnumber ? 'border-red-500' : 'border-gray-700'}`}
                                                name="contactnumber"
                                                value={formdata.contactnumber}
                                                onChange={handleformchange} />
                                            {errors.contactnumber && <span className="text-red-500 text-xs mt-1">{errors.contactnumber}</span>}
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="text-password" className="md:text-md lg:text-lg font-bold">Password</label>
                                            <input type="password"
                                                id="text-password" className={`border-2 rounded px-2 py-1 ${errors.textpassword ? 'border-red-500' : 'border-gray-700'}`}
                                                name="textpassword"
                                                value={formdata.textpassword}
                                                onChange={handleformchange} />
                                            {errors.textpassword && <span className="text-red-500 text-xs mt-1">{errors.textpassword}</span>}
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="password" className="md:text-md lg:text-lg font-bold">Confirm Password</label>
                                            <input type="password"
                                                id="password" required={true} className="border-2 border-gray-700 rounded px-2 py-1"
                                                name="password"
                                                value={formdata.password}
                                                onChange={handleformchange} />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="personal" className="flex-1">
                                <div className="form-group flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2">Personal Information</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Permanent Address</label>
                                            <input type="text" name="permanentaddress" value={formdata.permanentaddress} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Present Address</label>
                                            <input type="text" name="presentaddress" value={formdata.presentaddress} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Birth Date</label>
                                            <input type="date" name="birthdate" value={formdata.birthdate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Birth Place</label>
                                            <input type="text" name="birthplace" value={formdata.birthplace} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="employment" className="flex-1">
                                <div className="form-group flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2">Employment Information</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Designation</label>
                                            <input type="text" name="designation" value={formdata.designation} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Start Date</label>
                                            <input type="date" name="startdate" value={formdata.startdate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Evaluation Date</label>
                                            <input type="date" name="evaluationdate" value={formdata.evaluationdate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Regularization Date</label>
                                            <input type="date" name="regularizationdate" value={formdata.regularizationdate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="benefits" className="flex-1">
                                <div className="form-group flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2">Government Benefits</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">SSS</label>
                                            <input type="text" name="sss" value={formdata.sss} onChange={handleformchange} className={`border-2 rounded px-2 py-1 ${errors.sss ? 'border-red-500' : 'border-gray-700'}`} placeholder="XX-XXXXXXX-X" />
                                            {errors.sss && <span className="text-red-500 text-xs mt-1">{errors.sss}</span>}
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">PhilHealth</label>
                                            <input type="text" name="philhealth" value={formdata.philhealth} onChange={handleformchange} className={`border-2 rounded px-2 py-1 ${errors.philhealth ? 'border-red-500' : 'border-gray-700'}`} placeholder="XX-XXXXXXXXX-X" />
                                            {errors.philhealth && <span className="text-red-500 text-xs mt-1">{errors.philhealth}</span>}
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">TIN</label>
                                            <input type="text" name="tin" value={formdata.tin} onChange={handleformchange} className={`border-2 rounded px-2 py-1 ${errors.tin ? 'border-red-500' : 'border-gray-700'}`} placeholder="XXX-XXX-XXX" />
                                            {errors.tin && <span className="text-red-500 text-xs mt-1">{errors.tin}</span>}
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Pag-ibig</label>
                                            <input type="text" name="pagibig" value={formdata.pagibig} onChange={handleformchange} className={`border-2 rounded px-2 py-1 ${errors.pagibig ? 'border-red-500' : 'border-gray-700'}`} placeholder="XXXX-XXXX-XXXX" />
                                            {errors.pagibig && <span className="text-red-500 text-xs mt-1">{errors.pagibig}</span>}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                        <div className="add-button flex items-center justify-center mt-4 border-t pt-4">
                            <FormSubmitToast formdata={formdata} disabled={!isFormValid()} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const EmployeeDetailsDialogBox = ({ EmployeeID }) => {
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)
    const FetchEmployeeData = (EmID) => {
        const employee = HREmployeesState.data?.find((item) => item._id === EmID)
        return employee
    }
    const employeeData = FetchEmployeeData(EmployeeID)
    return (
        <div className="Employees-Details-container">
            <Dialog>
                <div>
                    <DialogTrigger className="btn-sm btn-blue-700 text-md border-2 border-blue-800 min-[250px]:px-2 min-[250px]:py-1 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded-md hover:bg-blue-800 hover:text-white">View</DialogTrigger>
                </div>
                <DialogContent className="max-w-[315px] sm:max-w-[70vw] 2xl:max-w-[50vw] h-[70vh] overflow-y-auto">
                    <div className="employee-data-container flex flex-col gap-4 h-full">
                        <div className="employee-profile-logo flex items-center gap-3">
                            <div className="logo border-2 border-blue-800 rounded-[50%] flex justify-center items-center">
                                <p className="font-bold text-2xl text-blue-700 p-2">{`${employeeData.firstname.slice(0, 1).toUpperCase()} ${employeeData.lastname.slice(0, 1).toUpperCase()}`}</p>
                            </div>
                            <div className="employee-fullname">
                                <p className="font-bold text-2xl">{`${employeeData.firstname} ${employeeData.lastname}`}</p>
                            </div>
                        </div>
                        <Tabs defaultValue="personal" className="w-full flex-1 flex flex-col">
                            <TabsList className="grid w-full grid-cols-4 mb-4">
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="employment">Employment</TabsTrigger>
                                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                                <TabsTrigger value="stats">Stats</TabsTrigger>
                            </TabsList>
                            <TabsContent value="personal" className="flex-1 overflow-y-auto">
                                <div className="personal-info-container flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2 border-b-2 border-gray-300 pb-2">Personal Information</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">First Name</label>
                                            <p className="text-base">{employeeData.firstname}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Last Name</label>
                                            <p className="text-base">{employeeData.lastname}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Email</label>
                                            <p className="text-base">{employeeData.email}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Contact Number</label>
                                            <p className="text-base">{employeeData.contactnumber}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Permanent Address</label>
                                            <p className="text-base">{employeeData.permanentaddress || "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Present Address</label>
                                            <p className="text-base">{employeeData.presentaddress || "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Birth Date</label>
                                            <p className="text-base">{employeeData.birthdate ? new Date(employeeData.birthdate).toLocaleDateString() : "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Birth Place</label>
                                            <p className="text-base">{employeeData.birthplace || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="employment" className="flex-1 overflow-y-auto">
                                <div className="employment-info-container flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2 border-b-2 border-gray-300 pb-2">Employment Information</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Designation</label>
                                            <p className="text-base">{employeeData.designation || "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Start Date</label>
                                            <p className="text-base">{employeeData.startdate ? new Date(employeeData.startdate).toLocaleDateString() : "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Evaluation Date</label>
                                            <p className="text-base">{employeeData.evaluationdate ? new Date(employeeData.evaluationdate).toLocaleDateString() : "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Regularization Date</label>
                                            <p className="text-base">{employeeData.regularizationdate ? new Date(employeeData.regularizationdate).toLocaleDateString() : "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Email Verification</label>
                                            <p className="text-base">{employeeData.isverified ? "✓ Verified" : "✗ Not Verified"}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="benefits" className="flex-1 overflow-y-auto">
                                <div className="benefits-info-container flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2 border-b-2 border-gray-300 pb-2">Government Benefits</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">SSS</label>
                                            <p className="text-base">{employeeData.sss || "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">PhilHealth</label>
                                            <p className="text-base">{employeeData.philhealth || "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">TIN</label>
                                            <p className="text-base">{employeeData.tin || "N/A"}</p>
                                        </div>
                                        <div className="label-value-pair flex flex-col gap-1">
                                            <label className="font-bold text-sm text-gray-600">Pag-ibig</label>
                                            <p className="text-base">{employeeData.pagibig || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="stats" className="flex-1 overflow-y-auto">
                                <div className="stats-info-container flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2 border-b-2 border-gray-300 pb-2">Statistics</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="stat-card flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <label className="font-bold text-sm text-gray-600">Notices</label>
                                            <p className="text-3xl font-bold text-blue-700">{employeeData.notice.length}</p>
                                        </div>
                                        <div className="stat-card flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                                            <label className="font-bold text-sm text-gray-600">Salary</label>
                                            <p className="text-3xl font-bold text-green-700">{employeeData.salary.length}</p>
                                        </div>
                                        <div className="stat-card flex flex-col items-center gap-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <label className="font-bold text-sm text-gray-600">Leaves</label>
                                            <p className="text-3xl font-bold text-yellow-700">{employeeData.leaverequest.length}</p>
                                        </div>
                                        <div className="stat-card flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                            <label className="font-bold text-sm text-gray-600">Requests</label>
                                            <p className="text-3xl font-bold text-purple-700">{employeeData.generaterequest.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}



export const DeleteEmployeeDialogBox = ({ EmployeeID }) => {
    const dispatch = useDispatch()
    const DeleteEmployee = (EMID) => {
        dispatch(HandleDeleteHREmployees({ apiroute: `DELETE.${EMID}` }))
    }
    return (
        <div className="delete-employee-dialog-container">
            <Dialog>
                <DialogTrigger className="btn-sm btn-blue-700 text-md border-2 border-blue-800 min-[250px]:px-2 min-[250px]:py-1 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded-md hover:bg-blue-800 hover:text-white">Delete</DialogTrigger>
                <DialogContent className="max-w-[315px] lg:max-w-[35vw] 2xl:max-w-[30vw]">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <p className="text-lg font-bold min-[250px]:text-center">Are you sure you want to delete this employee?</p>
                        <div className="delete-employee-button-group flex gap-2">
                            <DialogClose asChild>
                                <Button className="btn-sm btn-blue-700 text-md border-2 min-[250px]:px-2 min-[250px]:py-1 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded-md bg-red-700 border-red-700 hover:bg-transparent hover:text-red-700" onClick={() => DeleteEmployee(EmployeeID)}>Delete</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button className="btn-sm btn-blue-700 text-md border-2 min-[250px]:px-2 min-[250px]:py-1 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded-md bg-green-700 border-green-700 hover:bg-transparent hover:text-green-700">Cancel</Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}



export const CreateDepartmentDialogBox = () => {
    const { toast } = useToast()
    const dispatch = useDispatch()
    const [formdata, setformdata] = useState({
        name: "",
        description: ""
    })

    const handleformchange = (event) => {
        CommonStateHandler(formdata, setformdata, event)
    }

    const CreateDepartment = () => {
        dispatch(HandlePostHRDepartments({ apiroute: "CREATE", data: formdata }))
        setformdata({
            name: "",
            description: ""
        })
    }

    const ShowToast = () => {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `All Fields are required to create a department`,
        })
    }

    return (
        <Dialog>
            <DialogTrigger className="min-[250px]:text-sm sm:text-lg min-[250px]:px-2 min-[250px]:py-1 sm:px-4 sm:py-2 bg-blue-700 font-bold text-white rounded-lg border-2 border-blue-700 hover:bg-white hover:text-blue-700">Create Department</DialogTrigger>
            <DialogContent className="max-w-[315px] lg:max-w-[35vw] 2xl:max-w-[30vw]">
                <div className="create-department-container flex flex-col gap-4">
                    <div className="create-department-heading">
                        <h1 className="font-bold text-2xl">Create Department</h1>
                    </div>
                    <div className="create-department-form flex flex-col gap-4">
                        <div className="form-group flex flex-col gap-3">
                            <div className="label-input-field flex flex-col gap-1">
                                <label htmlFor="departmentname" className="md:text-md lg:text-lg font-bold">Department Name</label>
                                <input type="text"
                                    id="departmentname"
                                    name="name"
                                    value={formdata.name}
                                    onChange={handleformchange}
                                    placeholder="Enter Department Name"
                                    className="border-2 border-gray-700 rounded px-2 py-1" />
                            </div>
                            <div className="label-input-field flex flex-col gap-1">
                                <label htmlFor="departmentdescription" className="md:text-md lg:text-lg font-bold">Department Description</label>
                                <textarea
                                    id="departmentdescription"
                                    name="description"
                                    value={formdata.description}
                                    onChange={handleformchange}
                                    className="border-2 border-gray-700 rounded px-2 py-1 h-[100px]"
                                    placeholder="Write Your Department Description Here"></textarea>
                            </div>
                        </div>
                        <div className="create-department-button flex justify-center items-center">
                            {
                                (formdata.name.trim().length === 0 || formdata.description.trim().length === 0) ? <Button className="btn-sm btn-blue-700 text-md border-2 bg-blue-700 border-blue-700 px-2 py-1 rounded-md hover:bg-white hover:text-blue-700" onClick={() => ShowToast()}>Create</Button> :
                                    <DialogClose asChild>
                                        <Button className="btn-sm btn-blue-700 text-md border-2 bg-blue-700 border-blue-700 px-2 py-1 rounded-md hover:bg-white hover:text-blue-700" onClick={() => CreateDepartment()}>Create</Button>
                                    </DialogClose>
                            }
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const AddNoticeDialogBox = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)
    const HRDepartmentState = useSelector((state) => state.HRDepartmentPageReducer)
    const [formdata, setformdata] = useState({
        title: "",
        content: "",
        audience: "Employee-Specific",
        employee: "",
        department: ""
    })

    const handleformchange = (event) => {
        CommonStateHandler(formdata, setformdata, event)
    }

    const CreateNotice = () => {
        const dataToSubmit = { ...formdata }
        if (dataToSubmit.audience === "Employee-Specific") {
            delete dataToSubmit.department
        } else {
            delete dataToSubmit.employee
        }
        dispatch(HandleCreateNotice(dataToSubmit)).then((res) => {
            if (res.payload.success) {
                toast({ title: "Success", description: "Notice issued successfully" })
            } else {
                toast({ variant: "destructive", title: "Error", description: res.payload.message })
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger className="bg-blue-800 border-2 border-blue-800 md:px-4 md:py-2 md:text-lg min-[250px]:px-2 min-[250px]:py-1 min-[250px]:text-sm text-white font-bold rounded-lg hover:bg-white hover:text-blue-800">Issue Notice</DialogTrigger>
            <DialogContent className="max-w-[315px] sm:max-w-[50vw]">
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl">Issue New Notice</h1>
                    <div className="grid gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">Title</label>
                            <input type="text" name="title" value={formdata.title} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" placeholder="Notice Title" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">Content</label>
                            <textarea name="content" value={formdata.content} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1 h-32" placeholder="Notice Content"></textarea>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">Audience</label>
                            <select name="audience" value={formdata.audience} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1">
                                <option value="Employee-Specific">Employee Specific</option>
                                <option value="Department-Specific">Department Specific</option>
                            </select>
                        </div>
                        {formdata.audience === "Employee-Specific" ? (
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Select Employee</label>
                                <select name="employee" value={formdata.employee} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1">
                                    <option value="">Select Employee</option>
                                    {HREmployeesState.data?.map((emp) => (
                                        <option key={emp._id} value={emp._id}>{emp.firstname} {emp.lastname}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Select Department</label>
                                <select name="department" value={formdata.department} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1">
                                    <option value="">Select Department</option>
                                    {HRDepartmentState.data?.map((dept) => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <DialogClose asChild>
                        <Button className="bg-blue-800 text-white" onClick={CreateNotice} disabled={!formdata.title || !formdata.content || (formdata.audience === "Employee-Specific" ? !formdata.employee : !formdata.department)}>Issue Notice</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const UpdateNoticeDialogBox = ({ noticeData }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)
    const HRDepartmentState = useSelector((state) => state.HRDepartmentPageReducer)
    const [formdata, setformdata] = useState({
        noticeID: noticeData._id,
        title: noticeData.title,
        content: noticeData.content,
        audience: noticeData.audience,
        employee: noticeData.employee?._id || "",
        department: noticeData.department?._id || ""
    })

    const handleformchange = (event) => {
        CommonStateHandler(formdata, setformdata, event)
    }

    const UpdateNotice = () => {
        const dataToSubmit = { ...formdata }
        if (dataToSubmit.audience === "Employee-Specific") {
            delete dataToSubmit.department
        } else {
            delete dataToSubmit.employee
        }
        dispatch(HandleUpdateNotice(dataToSubmit)).then((res) => {
            if (res.payload.success) {
                toast({ title: "Success", description: "Notice updated successfully" })
            } else {
                toast({ variant: "destructive", title: "Error", description: res.payload.message })
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger className="btn-sm text-blue-700 border-2 border-blue-800 px-2 py-1 rounded hover:bg-blue-800 hover:text-white">Edit</DialogTrigger>
            <DialogContent className="max-w-[315px] sm:max-w-[50vw]">
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl">Update Notice</h1>
                    <div className="grid gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">Title</label>
                            <input type="text" name="title" value={formdata.title} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">Content</label>
                            <textarea name="content" value={formdata.content} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1 h-32"></textarea>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">Audience</label>
                            <select name="audience" value={formdata.audience} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1">
                                <option value="Employee-Specific">Employee Specific</option>
                                <option value="Department-Specific">Department Specific</option>
                            </select>
                        </div>
                        {formdata.audience === "Employee-Specific" ? (
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Select Employee</label>
                                <select name="employee" value={formdata.employee} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1">
                                    <option value="">Select Employee</option>
                                    {HREmployeesState.data?.map((emp) => (
                                        <option key={emp._id} value={emp._id}>{emp.firstname} {emp.lastname}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Select Department</label>
                                <select name="department" value={formdata.department} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1">
                                    <option value="">Select Department</option>
                                    {HRDepartmentState.data?.map((dept) => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <DialogClose asChild>
                        <Button className="bg-blue-800 text-white" onClick={UpdateNotice}>Update Notice</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const DeleteNoticeDialogBox = ({ noticeID }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const DeleteNotice = () => {
        dispatch(HandleDeleteNotice(noticeID)).then((res) => {
            if (res.payload.success) {
                toast({ title: "Success", description: "Notice deleted successfully" })
            } else {
                toast({ variant: "destructive", title: "Error", description: res.payload.message })
            }
        })
    }
    return (
        <Dialog>
            <DialogTrigger className="btn-sm text-red-700 border-2 border-red-800 px-2 py-1 rounded hover:bg-red-800 hover:text-white">Delete</DialogTrigger>
            <DialogContent className="max-w-[315px]">
                <div className="flex flex-col items-center gap-4">
                    <p className="font-bold">Are you sure you want to delete this notice?</p>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button className="bg-red-700 text-white" onClick={DeleteNotice}>Delete</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}



export const EmployeesIDSDialogBox = ({ DepartmentID }) => {
    console.log("this is Department ID", DepartmentID)
    const EmployeesIDState = useSelector((state) => state.EMployeesIDReducer)
    const dispatch = useDispatch()
    const [SelectedEmployeesData, Set_selectedEmployeesData] = useState({
        departmentID: DepartmentID,
        employeeIDArray: [],
    })

    const SelectEmployees = (EMID) => {
        if (SelectedEmployeesData.employeeIDArray.includes(EMID)) {
            Set_selectedEmployeesData({ ...SelectedEmployeesData, employeeIDArray: SelectedEmployeesData.employeeIDArray.filter((item) => item !== EMID) })
        }
        else if (!SelectedEmployeesData.employeeIDArray.includes(EMID)) {
            Set_selectedEmployeesData({ ...SelectedEmployeesData }, SelectedEmployeesData.employeeIDArray.push(EMID))
        }
    }

    const ClearSelectedEmployeesData = () => {
        Set_selectedEmployeesData({
            departmentID: DepartmentID,
            employeeIDArray: []
        })
    }

    const SetEmployees = () => {
        dispatch(HandlePatchHRDepartments({ apiroute: "UPDATE", data: SelectedEmployeesData }))
        ClearSelectedEmployeesData()
    }

    console.log(SelectedEmployeesData)

    useEffect(() => {
        Set_selectedEmployeesData(
            {
                departmentID: DepartmentID,
                employeeIDArray: [],
            }
        )
    }, [DepartmentID])

    return (
        <div className="employeeIDs-box-container">
            <Dialog>
                <DialogTrigger className="px-4 py-2 font-bold m-2 bg-blue-600 text-white border-2 border-blue-600 rounded-lg hover:bg-white hover:text-blue-700 min-[250px]:text-xs md:text-sm lg:text-lg" onClick={() => dispatch(fetchEmployeesIDs({ apiroute: "GETALL" }))}>Add Employees</DialogTrigger>
                <DialogContent className="max-w-[315px] lg:max-w-[35vw] 2xl:max-w-[30vw]">
                    {EmployeesIDState.isLoading ? <Loading height={"h-auto"} /> : <div className="employeeID-checkbox-container flex flex-col gap-4">
                        <div>
                            <h1 className="font-bold text-2xl">Select Employees</h1>
                        </div>
                        <div className="employeeID-checkbox-group">
                            <Command className="rounded-lg border shadow-md w-full">
                                <CommandInput placeholder="Type a Employee Name..." />
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup heading="All Employees">
                                        {EmployeesIDState.data ? EmployeesIDState.data.map((item, index) => <CommandItem key={index}>
                                            <div className="employeeID-checkbox flex justify-center items-center gap-2">
                                                <input type="checkbox" id={`EmployeeID-${index + 1}`} className="border-2 border-gray-700 w-4 h-4" onClick={() => SelectEmployees(item._id)} checked={SelectedEmployeesData.employeeIDArray.includes(item._id)} disabled={item.department ? true : false} />
                                                <label htmlFor={`EmployeeID-${index + 1}`} className="text-lg">{`${item.firstname} ${item.lastname}`} <span className="text-xs mx-0.5 overflow-hidden text-ellipsis">{item.department ? `(${item.department.name})` : null}</span> </label>
                                            </div>
                                        </CommandItem>) : null}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </div>
                        <div className="employeeID-checkbox-button-group flex justify-center items-center gap-2">
                            <Button className="btn-sm btn-blue-700 text-md border-2 bg-blue-700 border-blue-700 px-2 py-1 rounded-lg hover:bg-white hover:text-blue-700" onClick={() => SetEmployees()}>Add</Button>
                            <DialogClose asChild>
                                <Button className="btn-sm btn-blue-700 text-md border-2 bg-blue-700 border-blue-700 px-2 py-1 rounded-lg hover:bg-white hover:text-blue-700" onClick={() => ClearSelectedEmployeesData()}>Cancel</Button>
                            </DialogClose>
                        </div>
                    </div>}

                </DialogContent>
            </Dialog>
        </div>
    )
}

export const RemoveEmployeeFromDepartmentDialogBox = ({ DepartmentName, DepartmentID, EmployeeID }) => {
    const dispatch = useDispatch()

    const RemoveEmployee = (EMID) => {
        dispatch(HandleDeleteHRDepartments({ apiroute: "DELETE", data: { departmentID: DepartmentID, employeeIDArray: [EMID], action: "delete-employee" } }))
    }

    return (
        <div className="remove-employee">
            <Dialog>
                <DialogTrigger className="btn-sm btn-blue-700 text-md border-2 border-blue-800 min-[250px]:px-2 min-[250px]:py-1 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded-md hover:bg-blue-800 hover:text-white">Remove</DialogTrigger>
                <DialogContent className="max-w-[315px] lg:max-w-[35vw] 2xl:max-w-[30vw]">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <p className="text-lg font-bold min-[250px]:text-center">{`Are you sure you want to remove this employee from ${DepartmentName} department ?`}</p>
                        <div className="delete-employee-button-group flex gap-2">
                            <DialogClose asChild>
                                <Button className="btn-sm btn-blue-700 text-md border-2 min-[250px]:px-2 min-[250px]:py-1 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded-md bg-red-700 border-red-700 hover:bg-transparent hover:text-red-700" onClick={() => RemoveEmployee(EmployeeID)}>Remove</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button className="btn-sm btn-blue-700 text-md border-2 min-[250px]:px-2 min-[250px]:py-1 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded-md bg-green-700 border-green-700 hover:bg-transparent hover:text-green-700">Cancel</Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const UpdateEmployeeDialogBox = ({ EmployeeID }) => {
    const dispatch = useDispatch()
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)
    const [formdata, setformdata] = useState({
        firstname: "",
        lastname: "",
        email: "",
        contactnumber: "",
        sss: "",
        philhealth: "",
        tin: "",
        pagibig: "",
        permanentaddress: "",
        presentaddress: "",
        birthdate: "",
        birthplace: "",
        designation: "",
        startdate: "",
        evaluationdate: "",
        regularizationdate: ""
    })

    const [errors, setErrors] = useState({})

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'firstname':
            case 'lastname':
                if (value && !validateName(value)) {
                    error = 'Must be 2-50 characters, letters only';
                }
                break;
            case 'email':
                if (value && !validateEmail(value)) {
                    error = 'Invalid email format';
                }
                break;
            case 'contactnumber':
                if (value && !validatePhoneNumber(value)) {
                    error = 'Must be 10-11 digits';
                }
                break;
            case 'sss':
                if (value && !validateSSS(value)) {
                    error = 'Invalid format (XX-XXXXXXX-X or 10 digits)';
                }
                break;
            case 'philhealth':
                if (value && !validatePhilHealth(value)) {
                    error = 'Invalid format (XX-XXXXXXXXX-X or 12 digits)';
                }
                break;
            case 'tin':
                if (value && !validateTIN(value)) {
                    error = 'Invalid format (XXX-XXX-XXX or 9-12 digits)';
                }
                break;
            case 'pagibig':
                if (value && !validatePagibig(value)) {
                    error = 'Invalid format (XXXX-XXXX-XXXX or 12 digits)';
                }
                break;
            case 'permanentaddress':
            case 'presentaddress':
                if (value && !validateAddress(value)) {
                    error = 'Must be 10-200 characters';
                }
                break;
            case 'birthdate':
                if (value && !validateAge(value)) {
                    error = 'Must be at least 18 years old';
                }
                break;
            case 'birthplace':
            case 'designation':
                if (value && !validateTextField(value)) {
                    error = 'Must be 2-100 characters';
                }
                break;
            case 'startdate':
                if (value && !validateFutureDate(value)) {
                    error = 'Cannot be in the future';
                }
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    }

    const handleformchange = (event) => {
        const { name, value } = event.target;
        CommonStateHandler(formdata, setformdata, event);
        validateField(name, value);
    }


    useEffect(() => {
        const employee = HREmployeesState.data.find((item) => item._id === EmployeeID)
        if (employee) {
            setformdata({
                firstname: employee.firstname || "",
                lastname: employee.lastname || "",
                email: employee.email || "",
                contactnumber: employee.contactnumber || "",
                sss: employee.sss || "",
                philhealth: employee.philhealth || "",
                tin: employee.tin || "",
                pagibig: employee.pagibig || "",
                permanentaddress: employee.permanentaddress || "",
                presentaddress: employee.presentaddress || "",
                birthdate: employee.birthdate ? employee.birthdate.split('T')[0] : "",
                birthplace: employee.birthplace || "",
                designation: employee.designation || "",
                startdate: employee.startdate ? employee.startdate.split('T')[0] : "",
                evaluationdate: employee.evaluationdate ? employee.evaluationdate.split('T')[0] : "",
                regularizationdate: employee.regularizationdate ? employee.regularizationdate.split('T')[0] : "",
            })
        }
    }, [EmployeeID, HREmployeesState.data])

    // Auto-compute evaluation and regularization dates based on start date
    useEffect(() => {
        if (formdata.startdate) {
            const startDate = new Date(formdata.startdate);

            // Calculate evaluation date (4 months after start date)
            const evalDate = new Date(startDate);
            evalDate.setMonth(evalDate.getMonth() + 4);

            // Calculate regularization date (6 months after start date)
            const regDate = new Date(startDate);
            regDate.setMonth(regDate.getMonth() + 6);

            // Format dates as YYYY-MM-DD
            const formatDate = (date) => date.toISOString().split('T')[0];

            setformdata(prev => ({
                ...prev,
                evaluationdate: formatDate(evalDate),
                regularizationdate: formatDate(regDate)
            }));
        }
    }, [formdata.startdate]);

    // Check if form is complete and valid
    const isFormValid = () => {
        // Define required fields
        const requiredFields = [
            'firstname',
            'lastname',
            'email',
            'contactnumber',
            'designation',
            'startdate'
        ];

        // Check if required fields have validation errors
        const hasRequiredFieldErrors = requiredFields.some(field => errors[field] && errors[field] !== '');
        if (hasRequiredFieldErrors) return false;

        // Check if all required fields are filled
        const allRequiredFilled = requiredFields.every(field => {
            return formdata[field] && formdata[field].trim() !== '';
        });

        return allRequiredFilled;
    };

    const UpdateEmployee = () => {
        dispatch(HandleUpdateHREmployees({ apiroute: "UPDATE", data: { employeeId: EmployeeID, updatedEmployee: formdata } }))
    }

    const { toast } = useToast()
    const prevFetchDataRef = useRef(false)
    const prevErrorRef = useRef(false)

    // Watch for update success/failure and show toast
    useEffect(() => {
        // Success notification
        if (HREmployeesState.fetchData && !prevFetchDataRef.current) {
            toast({
                title: "Success!",
                description: "Employee updated successfully.",
                className: "bg-green-50 border-green-500",
            })
        }

        // Error notification
        if (HREmployeesState.error.status && !prevErrorRef.current) {
            toast({
                variant: "destructive",
                title: "Error",
                description: HREmployeesState.error.message || "Failed to update employee. Please try again.",
            })
        }

        // Update refs
        prevFetchDataRef.current = HREmployeesState.fetchData
        prevErrorRef.current = HREmployeesState.error.status
    }, [HREmployeesState.fetchData, HREmployeesState.error.status, toast])

    return (
        <div className="UpdateEmployees-content">
            <Dialog>
                <DialogTrigger className="btn-sm btn-blue-700 text-md border-2 border-blue-800 min-[250px]:px-2 min-[250px]:py-1 sm:px-1 sm:py-0.5 xl:px-2 xl:py-1 rounded-md hover:bg-blue-800 hover:text-white">Modify</DialogTrigger>
                <DialogContent className="max-w-[315px] sm:max-w-[80vw] 2xl:max-w-[60vw] h-[80vh] overflow-y-auto">
                    <div className="add-employees-container flex flex-col gap-5 h-full">
                        <div className="heading">
                            <h1 className="font-bold text-2xl">Modify Employee Info</h1>
                        </div>
                        <Tabs defaultValue="account" className="w-full h-full flex flex-col">
                            <TabsList className="grid w-full grid-cols-4 mb-4">
                                <TabsTrigger value="account">Account</TabsTrigger>
                                <TabsTrigger value="personal">Personal</TabsTrigger>
                                <TabsTrigger value="employment">Employment</TabsTrigger>
                                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account" className="flex-1">
                                <div className="form-group flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2">Account Details</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="firstname" className="md:text-md lg:text-lg font-bold">First Name</label>
                                            <input type="text"
                                                id="firstname"
                                                className="border-2 border-gray-700 rounded px-2 py-1"
                                                name="firstname"
                                                value={formdata.firstname}
                                                onChange={handleformchange} />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="lastname" className="md:text-md lg:text-lg font-bold">Last Name</label>
                                            <input type="text"
                                                id="lastname"
                                                className="border-2 border-gray-700 rounded px-2 py-1"
                                                name="lastname"
                                                value={formdata.lastname}
                                                onChange={handleformchange} />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="email" className="md:text-md lg:text-lg font-bold">Email</label>
                                            <input type="email"
                                                id="email" readOnly={true} className="border-2 border-gray-700 rounded px-2 py-1 bg-gray-200"
                                                name="email"
                                                value={formdata.email}
                                                onChange={handleformchange} />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label htmlFor="contactnumber" className="md:text-md lg:text-lg font-bold">Contact Number</label>
                                            <input type="number"
                                                id="contactnumber" className="border-2 border-gray-700 rounded px-2 py-1"
                                                name="contactnumber"
                                                value={formdata.contactnumber}
                                                onChange={handleformchange} />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="personal" className="flex-1">
                                <div className="form-group flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2">Personal Information</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Permanent Address</label>
                                            <input type="text" name="permanentaddress" value={formdata.permanentaddress} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Present Address</label>
                                            <input type="text" name="presentaddress" value={formdata.presentaddress} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Birth Date</label>
                                            <input type="date" name="birthdate" value={formdata.birthdate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Birth Place</label>
                                            <input type="text" name="birthplace" value={formdata.birthplace} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="employment" className="flex-1">
                                <div className="form-group flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2">Employment Information</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Designation</label>
                                            <input type="text" name="designation" value={formdata.designation} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Start Date</label>
                                            <input type="date" name="startdate" value={formdata.startdate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Evaluation Date</label>
                                            <input type="date" name="evaluationdate" value={formdata.evaluationdate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Regularization Date</label>
                                            <input type="date" name="regularizationdate" value={formdata.regularizationdate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="benefits" className="flex-1">
                                <div className="form-group flex flex-col gap-3">
                                    <h2 className="font-bold text-lg mb-2">Government Benefits</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">SSS</label>
                                            <input type="text" name="sss" value={formdata.sss} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">PhilHealth</label>
                                            <input type="text" name="philhealth" value={formdata.philhealth} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">TIN</label>
                                            <input type="text" name="tin" value={formdata.tin} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                        <div className="label-input-field flex flex-col gap-1">
                                            <label className="font-bold">Pag-ibig</label>
                                            <input type="text" name="pagibig" value={formdata.pagibig} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                        <div className="add-button flex items-center justify-center mt-4 border-t pt-4">
                            <DialogClose asChild>
                                <Button
                                    disabled={!isFormValid() || HREmployeesState.isLoading}
                                    className={`btn-sm btn-blue-700 text-md border-2 bg-blue-700 border-blue-700 px-4 py-2 rounded-lg ${(!isFormValid() || HREmployeesState.isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-blue-700'}`}
                                    onClick={() => UpdateEmployee()}
                                >
                                    {HREmployeesState.isLoading ? "Updating..." : "Update Employee"}
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const AddSalaryDialogBox = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)
    const [formdata, setformdata] = useState({
        employeeID: "",
        basicpay: "",
        bonusePT: 0,
        deductionPT: 0,
        duedate: "",
        currency: "PHP"
    })

    const handleformchange = (event) => {
        CommonStateHandler(formdata, setformdata, event)
    }

    const CreateSalary = () => {
        dispatch(HandleCreateSalary(formdata)).then((res) => {
            if (res.payload.success) {
                toast({ title: "Success", description: "Salary record created successfully" })
            } else {
                toast({ variant: "destructive", title: "Error", description: res.payload.message })
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger className="bg-blue-800 border-2 border-blue-800 md:px-4 md:py-2 md:text-lg min-[250px]:px-2 min-[250px]:py-1 min-[250px]:text-sm text-white font-bold rounded-lg hover:bg-white hover:text-blue-800">Add Salary</DialogTrigger>
            <DialogContent className="max-w-[315px] sm:max-w-[50vw]">
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl">Add Salary Record</h1>
                    <div className="grid gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">Select Employee</label>
                            <select name="employeeID" value={formdata.employeeID} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1">
                                <option value="">Select Employee</option>
                                {HREmployeesState.data?.map((emp) => (
                                    <option key={emp._id} value={emp._id}>{emp.firstname} {emp.lastname}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Basic Pay</label>
                                <input type="number" name="basicpay" value={formdata.basicpay} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Currency</label>
                                <select name="currency" value={formdata.currency} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1">
                                    <option value="PHP">PHP</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Bonuses (%)</label>
                                <input type="number" name="bonusePT" value={formdata.bonusePT} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Deductions (%)</label>
                                <input type="number" name="deductionPT" value={formdata.deductionPT} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">Due Date</label>
                            <input type="date" name="duedate" value={formdata.duedate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                        </div>
                    </div>
                    <DialogClose asChild>
                        <Button className="bg-blue-800 text-white" onClick={CreateSalary}>Create Salary</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const UpdateSalaryDialogBox = ({ salaryData }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const [formdata, setformdata] = useState({
        salaryID: salaryData._id,
        basicpay: salaryData.basicpay,
        bonusePT: (salaryData.bonuses / salaryData.basicpay) * 100,
        deductionPT: (salaryData.deductions / salaryData.basicpay) * 100,
        duedate: salaryData.duedate.split('T')[0],
        currency: salaryData.currency,
        status: salaryData.status
    })

    const handleformchange = (event) => {
        CommonStateHandler(formdata, setformdata, event)
    }

    const UpdateSalary = () => {
        dispatch(HandleUpdateSalary(formdata)).then((res) => {
            if (res.payload.success) {
                toast({ title: "Success", description: "Salary record updated successfully" })
            } else {
                toast({ variant: "destructive", title: "Error", description: res.payload.message })
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger className="btn-sm text-blue-700 border-2 border-blue-800 px-2 py-1 rounded hover:bg-blue-800 hover:text-white">Edit</DialogTrigger>
            <DialogContent className="max-w-[315px] sm:max-w-[50vw]">
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl">Update Salary</h1>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Basic Pay</label>
                                <input type="number" name="basicpay" value={formdata.basicpay} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Status</label>
                                <select name="status" value={formdata.status} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1">
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Bonuses (%)</label>
                                <input type="number" name="bonusePT" value={formdata.bonusePT} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-bold">Deductions (%)</label>
                                <input type="number" name="deductionPT" value={formdata.deductionPT} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">Due Date</label>
                            <input type="date" name="duedate" value={formdata.duedate} onChange={handleformchange} className="border-2 border-gray-700 rounded px-2 py-1" />
                        </div>
                    </div>
                    <DialogClose asChild>
                        <Button className="bg-blue-800 text-white" onClick={UpdateSalary}>Update Salary</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const DeleteSalaryDialogBox = ({ salaryID }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const DeleteSalary = () => {
        dispatch(HandleDeleteSalary(salaryID)).then((res) => {
            if (res.payload.success) {
                toast({ title: "Success", description: "Salary record deleted successfully" })
            } else {
                toast({ variant: "destructive", title: "Error", description: res.payload.message })
            }
        })
    }
    return (
        <Dialog>
            <DialogTrigger className="btn-sm text-red-700 border-2 border-red-800 px-2 py-1 rounded hover:bg-red-800 hover:text-white">Delete</DialogTrigger>
            <DialogContent className="max-w-[315px]">
                <div className="flex flex-col items-center gap-4">
                    <p className="font-bold">Are you sure you want to delete this salary record?</p>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button className="bg-red-700 text-white" onClick={DeleteSalary}>Delete</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}