import { useState } from "react"
import { useToast } from "../../../hooks/use-toast.js"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Image as ImageIcon, Download } from "lucide-react"
import { apiService } from "../../../redux/apis/api-service"

export const NoticeAttachmentPreview = ({ noticeID, attachmentName, attachmentType }) => {
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handlePreview = async () => {
        setIsLoading(true)
        try {
            const response = await apiService.get(`/api/v1/notice/attachment/${noticeID}`, {
                withCredentials: true
            })

            if (response.data.success) {
                setPreviewUrl(response.data.data.url)
            } else {
                toast({ variant: "destructive", title: "Error", description: response.data.message })
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to load attachment" })
        } finally {
            setIsLoading(false)
        }
    }

    const isImage = attachmentType?.startsWith('image/')
    const isPDF = attachmentType === 'application/pdf'

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreview}
                    disabled={isLoading}
                    className="flex items-center gap-1 text-xs shrink-0"
                >
                    {isImage ? <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    <span className="hidden xs:inline sm:inline">{isLoading ? "Loading..." : "Preview"}</span>
                    <span className="inline xs:hidden sm:hidden">{isLoading ? "..." : "View"}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:w-full sm:max-w-4xl max-h-[90vh] overflow-auto">
                <DialogTitle className="text-sm sm:text-base">{attachmentName || "Attachment Preview"}</DialogTitle>
                {previewUrl && (
                    <div className="flex flex-col gap-4">
                        {isImage && (
                            <img
                                src={previewUrl}
                                alt={attachmentName}
                                className="max-w-full h-auto rounded"
                            />
                        )}
                        {isPDF && (
                            <iframe
                                src={previewUrl}
                                className="w-full h-[70vh] rounded"
                                title={attachmentName}
                            />
                        )}
                        <div className="flex justify-end gap-2">
                            <a
                                href={previewUrl}
                                download={attachmentName}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </a>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
