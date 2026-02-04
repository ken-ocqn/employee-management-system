import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { HandleCreateRequest, HandleGetRequests } from "../../redux/Thunks/RequestThunk"
import { Send, Loader2 } from "lucide-react"

export const CreateRequestDialog = ({ employeeId }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const { isActionLoading } = useSelector((state) => state.requestreducer)
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        requesttitle: "",
        requestconent: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.requesttitle.trim() || !formData.requestconent.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive"
            })
            return
        }

        try {
            await dispatch(HandleCreateRequest({
                requesttitle: formData.requesttitle,
                requestconent: formData.requestconent,
                employeeID: employeeId
            })).unwrap()

            toast({
                title: "Success",
                description: "Request submitted successfully!",
            })

            // Refresh the requests list
            dispatch(HandleGetRequests({ apiroute: "GET_MY_REQUESTS" }))

            // Reset form and close dialog
            setFormData({ requesttitle: "", requestconent: "" })
            setOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: error?.message || "Failed to submit request",
                variant: "destructive"
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-6 rounded-2xl transition-all duration-300 gap-2 h-auto shadow-lg shadow-blue-200/50">
                    <Send className="w-4 h-4" />
                    New Request
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] rounded-3xl border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Submit New Request
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Fill in the details below to submit a request to HR.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="requesttitle" className="text-sm font-bold text-slate-700">
                            Request Title
                        </Label>
                        <Input
                            id="requesttitle"
                            name="requesttitle"
                            placeholder="e.g., Certificate of Employment Request"
                            value={formData.requesttitle}
                            onChange={handleChange}
                            className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isActionLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="requestconent" className="text-sm font-bold text-slate-700">
                            Request Details
                        </Label>
                        <Textarea
                            id="requestconent"
                            name="requestconent"
                            placeholder="Provide detailed information about your request..."
                            value={formData.requestconent}
                            onChange={handleChange}
                            rows={6}
                            className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            disabled={isActionLoading}
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isActionLoading}
                            className="rounded-xl font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isActionLoading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl gap-2"
                        >
                            {isActionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Request
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
