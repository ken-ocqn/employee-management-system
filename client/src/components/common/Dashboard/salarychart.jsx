import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
export const SalaryChart = ({ balancedata }) => {
    const chartData = []
    if (balancedata) {
        for (let index = 0; index < balancedata.balance.length; index++) {
            chartData.push(
                {
                    month: balancedata.balance[index]["expensemonth"],
                    SalriesPaid: balancedata.balance[index]["totalexpenses"],
                    AvailableAmount: balancedata.balance[index]["availableamount"]
                }
            )
        }
    }
    const chartConfig = {
        desktop: {
            label: "Salaries Paid",
            color: "hsl(var(--chart-1))",
        },
        mobile: {
            label: "Available Balance",
            color: "hsl(var(--chart-2))",
        },
    }

    let trendingUp = 0

    if (balancedata && chartData.length >= 2) {
        const difference = chartData[chartData.length - 1]["AvailableAmount"] - chartData[chartData.length - 2]["AvailableAmount"]
        trendingUp += Math.round((difference * 100) / chartData[chartData.length - 2]["AvailableAmount"])
    }
    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-8 py-6">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg font-bold flex items-center gap-3 text-slate-800">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        Balance Overview
                    </CardTitle>
                    <CardDescription className="text-xs font-medium">Available Salary: <span className="text-slate-900 font-bold">${chartData.length > 0 ? chartData[chartData.length - 1]["AvailableAmount"] : 0}</span></CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider text-slate-400 py-1.5 px-3 rounded-full border-slate-200">
                    Expense Analytics
                </Badge>
            </CardHeader>
            <CardContent className="p-8">
                <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 10,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            tickFormatter={(value) => value.slice(0, 3)}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                        />
                        <ChartTooltip
                            cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                            content={<ChartTooltipContent indicator="dot" className="bg-white/90 backdrop-blur-md border-slate-200 shadow-xl rounded-xl p-3" />}
                        />
                        <Area
                            dataKey="SalriesPaid"
                            type="natural"
                            fill="url(#colorSalaries)"
                            fillOpacity={1}
                            stroke="#6366f1"
                            strokeWidth={3}
                            stackId="a"
                        />
                        <Area
                            dataKey="AvailableAmount"
                            type="natural"
                            fill="url(#colorAvailable)"
                            fillOpacity={1}
                            stroke="#3b82f6"
                            strokeWidth={3}
                            stackId="a"
                        />
                        <defs>
                            <linearGradient id="colorSalaries" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <ChartLegend content={<ChartLegendContent />} className="mt-6" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="px-8 py-6 bg-slate-50/50 border-t border-slate-50">
                <div className="flex w-full items-center justify-between text-sm">
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                        <TrendingUp className={`h-4 w-4 ${trendingUp >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                        Trending {trendingUp >= 0 ? 'up' : 'down'} by {Math.abs(trendingUp)}% this month
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Data range: {chartData.length > 0 ? `${chartData[0]["month"]} - ${chartData[chartData.length - 1]["month"]}` : 'N/A'}
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}