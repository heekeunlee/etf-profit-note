import { useState, useEffect } from 'react'
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronDown, ChevronUp } from 'lucide-react'

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [expandedDate, setExpandedDate] = useState(null)

    useEffect(() => {
        fetch('./data/history.json')
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load data", err)
                setLoading(false)
            })
    }, [])

    if (loading) return <div className="flex h-screen items-center justify-center text-gray-400 bg-gray-50">Loading Profit Note...</div>
    if (!data) return <div className="flex h-screen items-center justify-center text-rose-500 bg-gray-50">Error loading data.</div>

    // Prepare chart data: Calculate Cumulative Profit
    // 1. Sort records chronologically (oldest first)
    const sortedRecords = [...data.records].reverse();

    let runningTotal = 0;
    const chartData = sortedRecords.map(record => {
        runningTotal += record.daily_profit;
        return {
            date: record.date.slice(5), // "MM-DD"
            profit: runningTotal
        };
    });

    const toggleExpand = (date) => {
        if (expandedDate === date) {
            setExpandedDate(null)
        } else {
            setExpandedDate(date)
        }
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 pb-10 font-sans">
            <div className="max-w-md mx-auto sm:max-w-2xl bg-white min-h-screen shadow-2xl shadow-gray-200/50">

                {/* 1. Header & Big Total Profit (Apple/Toss Style) */}
                <div className="pt-12 pb-8 px-6 text-center bg-white sticky top-0 z-20">
                    <h1 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Total Realized Profit
                    </h1>
                    <div className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-1">
                        <span className="text-2xl text-gray-400 font-bold self-start mt-1">₩</span>
                        {data.total_profit.toLocaleString()}
                    </div>

                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
                        <span className="mr-1">🚀</span> Growing Wealth
                    </div>
                </div>

                {/* 2. Cumulative Profit Chart (Money Growing Feeling) */}
                <div className="h-48 w-full mb-8 relative">
                    <div className="absolute top-0 left-6 text-xs text-gray-400 font-bold z-10">Accumulated Profit Curve</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f43f5e', borderRadius: '12px', color: '#1f2937', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#f43f5e' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value) => [`+₩${value.toLocaleString()}`, 'Profit']}
                            />
                            <Area
                                type="monotone"
                                dataKey="profit"
                                stroke="#f43f5e"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorProfit)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* 3. Daily Records List */}
                <div className="px-6 pb-2">
                    <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-100 pb-2 mb-4">Trading History</h3>
                </div>

                <div className="space-y-3 px-4 pb-12">
                    {data.records.map((record, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">

                            {/* Card Header (Daily Summary) */}
                            <div
                                onClick={() => toggleExpand(record.date)}
                                className="p-5 flex items-center justify-between cursor-pointer active:bg-gray-50 select-none"
                            >
                                <div>
                                    <div className="text-gray-400 text-xs font-semibold mb-0.5">{record.date}</div>
                                    <div className="text-gray-900 font-bold text-lg">
                                        +₩{record.daily_profit.toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <div className={`text-xs font-bold px-2 py-1 rounded-md ${record.daily_roi >= 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {record.daily_roi > 0 ? '+' : ''}{record.daily_roi}% ROI
                                    </div>
                                    {expandedDate === record.date ? <ChevronUp size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
                                </div>
                            </div>

                            {/* Card Body (Detailed Trades) */}
                            {expandedDate === record.date && (
                                <div className="bg-slate-50 px-4 py-4 border-t border-gray-100 animate-in slide-in-from-top-1 duration-200">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                                        Detailed Breakdown
                                    </div>
                                    <div className="space-y-3">
                                        {record.trades.map((trade, tIdx) => (
                                            <div key={tIdx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                                {/* Trade Header: Name & Profit */}
                                                <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                                                    <span className="text-gray-900 font-bold text-sm tracking-tight">{trade.name}</span>
                                                    <div className="text-right">
                                                        <div className="text-rose-500 font-bold text-sm">+₩{trade.profit.toLocaleString()}</div>
                                                        <div className="text-rose-500/80 text-[10px] font-medium bg-rose-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                                            +{trade.roi}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Trade Details Grid */}
                                                <div className="grid grid-cols-2 gap-y-2 text-xs">
                                                    <div>
                                                        <span className="block text-gray-400 text-[10px] mb-0.5">Avg Price</span>
                                                        <span className="font-semibold text-gray-700">₩{trade.avg_price.toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-gray-400 text-[10px] mb-0.5">Buy Amount</span>
                                                        <span className="font-semibold text-gray-700">₩{trade.buy_amount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="col-span-2 text-right mt-1 pt-2 border-t border-dashed border-gray-100">
                                                        <span className="text-gray-400 text-[10px] mr-2">Total Sell Amount</span>
                                                        <span className="font-bold text-gray-900">₩{trade.sell_amount.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Dashboard
