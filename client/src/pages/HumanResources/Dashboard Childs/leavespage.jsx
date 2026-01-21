import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "../../../components/common/DataTable.jsx"
import { leaveColumns } from "./leaveColumns.jsx"
import { HandleGetLeaves, HandleGetOrgDetails, HandleUpdateOrgDefaults } from "../../../redux/Thunks/LeavesThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "../../../hooks/use-toast.js"

export const HRLandLeavesPage = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const { allLeaves, orgDetails, isLoading, isActionLoading } = useSelector((state) => state.leavesreducer)
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer)

    const [defaults, setDefaults] = useState({
        sickLeave: 0,
        vacationLeave: 0,
        emergencyLeave: 0,
        maternityLeave: 0,
        paternityLeave: 0
    })

    useEffect(() => {
        dispatch(HandleGetLeaves())
        dispatch(HandleGetOrgDetails())
    }, [dispatch])

    useEffect(() => {
        if (orgDetails?.defaultLeaveCredits) {
            setDefaults(orgDetails.defaultLeaveCredits)
        }
    }, [orgDetails])

    const handleUpdateDefaults = () => {
        dispatch(HandleUpdateOrgDefaults({ defaultLeaveCredits: defaults }))
            .then((res) => {
                if (!res.error) {
                    toast({ title: "Success", description: "Default leave credits updated." })
                }
            })
    }

    if (isLoading && !allLeaves.length) return <Loading />

    return (
        <div className="leaves-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%] overflow-auto">
            <div className="leaves-heading">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Leaves Management</h1>
            </div>

            <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                    <TabsTrigger value="credits">Employee Credits</TabsTrigger>
                    <TabsTrigger value="defaults">Org Defaults</TabsTrigger>
                </TabsList>

                <TabsContent value="requests" className="mt-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Leave Requests</CardTitle>
                            <CardDescription>Manage employee leave applications here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={leaveColumns} data={allLeaves} searchKey="employee.email" />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="credits" className="mt-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Employee Leave Balances</CardTitle>
                            <CardDescription>Current available credits for each employee.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 uppercase font-bold">
                                        <tr>
                                            <th className="px-4 py-2">Employee</th>
                                            <th className="px-4 py-2">Sick</th>
                                            <th className="px-4 py-2">Vacation</th>
                                            <th className="px-4 py-2">Emergency</th>
                                            <th className="px-4 py-2">Maternity</th>
                                            <th className="px-4 py-2">Paternity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {HREmployeesState.data?.map((emp) => (
                                            <tr key={emp._id} className="border-b">
                                                <td className="px-4 py-2 font-medium">{`${emp.firstname} ${emp.lastname}`}</td>
                                                <td className="px-4 py-2">{emp.leaveCredits?.sickLeave}</td>
                                                <td className="px-4 py-2">{emp.leaveCredits?.vacationLeave}</td>
                                                <td className="px-4 py-2">{emp.leaveCredits?.emergencyLeave}</td>
                                                <td className="px-4 py-2">{emp.leaveCredits?.maternityLeave}</td>
                                                <td className="px-4 py-2">{emp.leaveCredits?.paternityLeave}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="defaults" className="mt-5">
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Organization Default Credits</CardTitle>
                            <CardDescription>Set default leave balances assigned to new employees.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {Object.keys(defaults).map((key) => (
                                    <div key={key} className="space-y-2">
                                        <label className="text-sm font-medium capitalize">{key.replace(/Leave$/, ' Leave')}</label>
                                        <Input
                                            type="number"
                                            value={defaults[key]}
                                            onChange={(e) => setDefaults({ ...defaults, [key]: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button onClick={handleUpdateDefaults} disabled={isActionLoading}>
                                {isActionLoading ? "Updating..." : "Save Changes"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
