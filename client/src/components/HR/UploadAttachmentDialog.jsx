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
import { useToast } from "@/hooks/use-toast"
import { HandleUpdateAttachment, HandleGetRequests } from "../../redux/Thunks/RequestThunk"
import { Upload, Loader2, File } from "lucide-react"

export const UploadAttachmentDialog = ({ requestID, disabled }) => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const { isActionLoading } = useSelector((state) => state.requestreducer)
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState(null)

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!file) {
            toast({
                title: "Error",
                description: "Please select a file to upload",
                variant: "destructive"
            })
            return
        }

        try {
            await dispatch(HandleUpdateAttachment({
                requestID,
                file
            })).unwrap()

            toast({
                title: "Success",
                description: "Attachment uploaded successfully!",
            })

            // Refresh the requests list
            dispatch(HandleGetRequests())

            setFile(null)
            setOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: error?.message || "Failed to upload attachment",
                variant: "destructive"
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={disabled}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed h-7 flex items-center gap-1"
                >
                    <Upload className="w-3 h-3" />
                    Attach File
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Upload Attachment</DialogTitle>
                    <DialogDescription>
                        Attach a document (COE, payslip, etc.) to this request for the employee to download.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="file" className="text-sm font-semibold">
                            Select File
                        </Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            className="rounded-xl cursor-pointer"
                            disabled={isActionLoading}
                        />
                        {file && (
                            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                                <File className="w-4 h-4 text-blue-500" />
                                <span className="font-medium truncate">{file.name}</span>
                                <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isActionLoading || !file}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full gap-2"
                        >
                            {isActionLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Upload & Save
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
