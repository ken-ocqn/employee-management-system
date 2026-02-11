import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useToast } from "@/hooks/use-toast"
import { HandleGetEmployeeNotices } from "../../redux/Thunks/NoticeThunk.js"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { NoticeAttachmentPreview } from "../common/Dashboard/NoticeAttachmentPreview.jsx"

export const EmployeeNoticeNotifications = () => {
    const dispatch = useDispatch()
    const { toast } = useToast()
    const [notices, setNotices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    // LocalStorage key for tracking last viewed timestamp
    const LAST_VIEWED_KEY = 'employee_notices_last_viewed'

    const getLastViewedTimestamp = () => {
        const stored = localStorage.getItem(LAST_VIEWED_KEY)
        return stored ? new Date(stored) : null
    }

    const updateLastViewedTimestamp = () => {
        localStorage.setItem(LAST_VIEWED_KEY, new Date().toISOString())
    }

    const calculateUnreadCount = (noticesList) => {
        const lastViewed = getLastViewedTimestamp()
        if (!lastViewed) {
            // If never viewed before, all notices are "new"
            return noticesList.length
        }

        // Count notices created after last viewed timestamp
        return noticesList.filter(notice => {
            const noticeDate = new Date(notice.createdAt)
            return noticeDate > lastViewed
        }).length
    }

    const fetchNotices = async () => {
        setIsLoading(true)
        try {
            const result = await dispatch(HandleGetEmployeeNotices()).unwrap()
            if (result.success) {
                const noticesList = result.data || []
                setNotices(noticesList)
                setUnreadCount(calculateUnreadCount(noticesList))
            } else {
                toast({ variant: "destructive", title: "Error", description: result.message })
            }
        } catch (error) {
            console.error("Failed to fetch notices:", error)
            toast({ variant: "destructive", title: "Error", description: "Failed to load notices" })
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch notices on component mount
    useEffect(() => {
        fetchNotices()
    }, [])

    // Update last viewed timestamp and reset unread count when popover opens
    const handleOpenChange = (open) => {
        setIsOpen(open)
        if (open) {
            // Mark all current notices as read when opening
            updateLastViewedTimestamp()
            setUnreadCount(0)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-100 font-semibold px-4 py-6 rounded-2xl transition-all duration-300 shrink-0 h-auto"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-[10px] rounded-full">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[600px] max-h-[500px] overflow-auto p-0" align="end">
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 z-10">
                    <h3 className="text-lg font-bold text-slate-800">Notices</h3>
                    <p className="text-xs text-slate-500">System announcements and updates</p>
                </div>
                <div className="p-4">
                    {isLoading ? (
                        <div className="py-8 text-center text-slate-400">Loading...</div>
                    ) : notices.length === 0 ? (
                        <div className="py-8 text-center">
                            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p className="text-sm text-slate-400 font-medium">No notices yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notices.map((notice) => (
                                <div
                                    key={notice._id}
                                    className="p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">
                                                {notice.title}
                                            </h4>
                                            <p className="text-xs text-slate-600 mb-2">
                                                {notice.content}
                                            </p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] px-2 py-0.5 ${notice.audience === "Employee-Specific"
                                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                                        : "bg-purple-50 text-purple-700 border-purple-200"
                                                        }`}
                                                >
                                                    {notice.audience === "Employee-Specific" ? "Personal" : notice.department?.name || "Department"}
                                                </Badge>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(notice.createdAt).toLocaleDateString(undefined, {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        {notice.attachmentUrl && (
                                            <NoticeAttachmentPreview
                                                noticeID={notice._id}
                                                attachmentName={notice.attachmentName}
                                                attachmentType={notice.attachmentType}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
