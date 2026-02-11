export const APIsEndPoints = {
    LOGIN: "/api/auth/employee/login",
    CHECKELOGIN: "/api/auth/employee/check-login",
    FORGOT_PASSWORD: "/api/auth/employee/forgot-password",
    RESET_PASSWORD: (token) => `/api/auth/employee/reset-password/${token}`,
    LOGOUT: "/api/auth/employee/logout",
    GET_PROFILE: "/api/v1/employee/by-employee"
}

export const HREndPoints = {
    SIGNUP: "/api/auth/HR/signup",
    CHECKLOGIN: "/api/auth/HR/check-login",
    LOGIN: "/api/auth/HR/login",
    LOGOUT: "/api/auth/HR/logout",
    VERIFY_EMAIL: "/api/auth/HR/verify-email",
    CHECK_VERIFY_EMAIL: "/api/auth/HR/check-verify-email",
    RESEND_VERIFY_EMAIL: "/api/auth/HR/resend-verify-email",
    FORGOT_PASSWORD: "/api/auth/HR/forgot-password",
    RESET_PASSWORD: (token) => `/api/auth/HR/reset-password/${token}`
}

export const DashboardEndPoints = {
    GETDATA: "/api/v1/dashboard/HR-dashboard"
}

export const HREmployeesPageEndPoints = {
    GETALL: "/api/v1/employee/all",
    ADDEMPLOYEE: "/api/auth/employee/signup",
    GETONE: (EMID) => `/api/v1/employee/by-HR/${EMID}`,
    DELETE: (EMID) => `/api/v1/employee/delete-employee/${EMID}`,
    UPDATE: "/api/v1/employee/update-employee-by-hr"
}

export const HRDepartmentPageEndPoints = {
    GETALL: "/api/v1/department/all",
    CREATE: "/api/v1/department/create-department",
    UPDATE: "/api/v1/department/update-department",
    DELETE: "/api/v1/department/delete-department"
}

export const EmployeesIDsEndPoints = {
    GETALL: "/api/v1/employee/all-employees-ids",
}

export const LeaveEndPoints = {
    CREATE: "/api/v1/leave/create-leave",
    GETALL: "/api/v1/leave/all",
    GET_MY_LEAVES: "/api/v1/leave/my-leaves",
    GETONE: (id) => `/api/v1/leave/${id}`,
    UPDATEBYHR: (id) => `/api/v1/leave/hr/update/${id}`,
    DELETE: (id) => `/api/v1/leave/delete/${id}`
}

export const OrganizationEndPoints = {
    GETDETAILS: "/api/v1/organization/",
    UPDATEDEFAULTS: "/api/v1/organization/leave-credits"
}

export const SalaryEndPoints = {
    CREATE: "/api/v1/salary/create-salary",
    GETALL: "/api/v1/salary/all",
    GETONE: (id) => `/api/v1/salary/${id}`,
    UPDATE: "/api/v1/salary/update-salary",
    DELETE: (id) => `/api/v1/salary/delete-salary/${id}`
}

export const NoticeEndPoints = {
    CREATE: "/api/v1/notice/create-notice",
    GETALL: "/api/v1/notice/all/",
    GETONE: (id) => `/api/v1/notice/${id}`,
    DELETE: (id) => `/api/v1/notice/delete-notice/${id}`,
    GET_EMPLOYEE_NOTICES: "/api/v1/notice/employee/my-notices",
    GET_ATTACHMENT: (id) => `/api/v1/notice/attachment/${id}`
}

export const AttendanceEndPoints = {
    GETALL: "/api/v1/attendance/all",
    GETONE: (id) => `/api/v1/attendance/${id}`,
    UPDATE: "/api/v1/attendance/update-attendance",
    DELETE: (id) => `/api/v1/attendance/delete-attendance/${id}`,
    INITIALIZE: "/api/v1/attendance/initialize-attendance",
    LOGIN: "/api/v1/attendance/login",
    LOGOUT: "/api/v1/attendance/logout"
}

export const RequestEndPoints = {
    CREATE: "/api/v1/request/create-request",
    GETALL: "/api/v1/request/all",
    GET_MY_REQUESTS: "/api/v1/request/my-requests",
    GETONE: (id) => `/api/v1/request/${id}`,
    UPDATE_STATUS: "/api/v1/request/update-request-status",
    UPDATE_ATTACHMENT: (id) => `/api/v1/request/update-attachment/${id}`,
    DELETE: (id) => `/api/v1/request/delete-request/${id}`
}


