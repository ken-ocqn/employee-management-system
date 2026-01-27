import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BellRing, Send, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const DataTable = ({ noticedata }) => {
    const Notices = []

    if (noticedata && noticedata.notices) {
        noticedata.notices.forEach((notice, index) => {
            Notices.push({
                noticeID: index + 1,
                noticeTitle: notice.title,
                noticeAudience: notice.audience,
                noticeCreatedBy: `${notice.createdby?.firstname || 'HR'} ${notice.createdby?.lastname || 'Admin'}`,
            })
        })
    }

    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden group h-full flex flex-col">
            <CardHeader className="border-b border-slate-50 px-8 py-6">
                <CardTitle className="text-lg font-bold flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-xl">
                        <BellRing className="w-5 h-5 text-orange-600" />
                    </div>
                    Recent Notices
                </CardTitle>
                <CardDescription className="text-xs font-medium">Internal announcements and updates</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
                {Notices.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 border-none hover:bg-slate-50/50">
                                <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Title</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target</TableHead>
                                <TableHead className="px-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Sender</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Notices.map((Notice) => (
                                <TableRow key={Notice.noticeID} className="border-slate-50 hover:bg-slate-50 transition-colors group/row">
                                    <TableCell className="px-8 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-bold text-slate-700">{Notice.noticeTitle}</span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                <Send className="w-3 h-3" /> ID: {Notice.noticeID}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant="outline" className="text-[10px] font-bold rounded-lg px-2 py-0.5 border-slate-200 text-slate-500">
                                            {Notice.noticeAudience}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-600">
                                            <User className="w-3 h-3 text-blue-500" />
                                            {Notice.noticeCreatedBy}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <BellRing className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">No notices found</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}