import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DataTable } from "../../../components/common/DataTable.jsx"
import { requestColumns } from "./requestColumns.jsx"
import { HandleGetRequests } from "../../../redux/Thunks/RequestThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const HRRequestsPage = () => {
    const dispatch = useDispatch()
    const { allRequests, isLoading } = useSelector((state) => state.requestreducer)

    useEffect(() => {
        dispatch(HandleGetRequests())
    }, [dispatch])

    if (isLoading && !allRequests.length) return <Loading />

    return (
        <div className="requests-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%] overflow-auto">
            <div className="requests-heading">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Requests Management</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Employee Requests</CardTitle>
                    <CardDescription>Manage and respond to various employee requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={requestColumns}
                        data={allRequests}
                        searchKey="requesttitle"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
