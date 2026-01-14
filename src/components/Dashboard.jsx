import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [expandedDate, setExpandedDate] = useState(null)

    useEffect(() => {
        fetch('./data/history.json')
            .then(res => res.json())
            .then(data => {
                setData(data)
                // All collapsed by default
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load data", err)
                setLoading(false)
            })
    }, [])

    if (loading) return <div className="flex h-screen items-center justify-center text-gray-400 bg-gray-50">Loading Profit Note...</div>
    if (!data) return <div className="flex h-screen items-center justify-center text-rose-500 bg-gray-50">Error loading data.</div>

    // Prepare chart data
    const chartData = [...data.records].reverse().map(record => ({
        date: record.date.slice(5),
        equity: record.equity
    }));

    const toggleExpand = (date) => {
        if (expandedDate === date) {
            setExpandedDate(null)
        } else {
            setExpandedDate(date)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-10 font-sans">
            <div className="max-w-md mx-auto sm:max-w-2xl">

                {/* Header */}
                <header className="px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900 bg-clip-text">
                        Profit Note
                    </h1>
                    <span className="text-[10px] bg-gray-100 border border-gray-200 text-gray-500 px-2 py-1 rounded-full">
                        Last: {data.last_updated.split('T')[0]}
                    </span>
                </header>

                {/* 1. Daily Records List (Moved to Top) */}
                <div className="px-6 mt-6 mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Trading History</h3>
                    <span className="text-xs text-gray-500 font-medium">Total Profit: +₩{data.total_profit.toLocaleString()}</span>
                </div>

                <div className="space-y-4 px-4 mb-8">
                    {data.records.map((record, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">

                            {/* Card Header (Daily Summary) */}
                            <div
                                onClick={() => toggleExpand(record.date)}
                                className="p-5 flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <div className="text-gray-400 text-xs font-bold uppercase mb-1">{record.date}</div>
                                    <div className="text-gray-900 font-bold text-lg">
                                        +₩{record.daily_profit.toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-bold px-3 py-1 rounded-lg inline-block mb-1 ${record.daily_roi >= 0 ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {record.daily_roi > 0 ? '+' : ''}{record.daily_roi}%
                                    </div>
                                    <div className="text-gray-400 text-xs flex items-center justify-end gap-1">
                                        {expandedDate === record.date ? 'Hide Details' : 'View Details'}
                                        {expandedDate === record.date ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                </div>
                            </div>

                            {/* Card Body (Detailed Trades) */}
                            {expandedDate === record.date && (
                                <div className="bg-gray-50/50 border-t border-gray-100 p-4 space-y-3">
                                    {record.trades.map((trade, tIdx) => (
                                        <div key={tIdx} className="flex justify-between items-start py-2 border-b border-gray-200 last:border-0 last:pb-0">
                                            <div>
                                                <div className="text-gray-800 font-bold text-sm mb-1">{trade.name}</div>
                                                <div className="text-gray-500 text-xs">Sell: ₩{trade.sell_amount.toLocaleString()}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-rose-500 font-bold text-sm">+₩{trade.profit.toLocaleString()}</div>
                                                <div className="text-rose-600 text-xs bg-rose-100 px-1.5 py-0.5 rounded inline-block mt-1">
                                                    +{trade.roi}%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    ))}
                </div>

                {/* 2. Asset Growth Chart (Moved to Bottom) */}
                <div className="mx-4 mb-8 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <TrendingUp size={16} className="text-gray-400" />
                        <h3 className="text-sm font-bold text-gray-700">Asset Growth</h3>
                    </div>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '12px', color: '#1f2937', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#6366f1' }}
                                    labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                                    formatter={(value) => [`₩${value.toLocaleString()}`, 'Equity']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="equity"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorEquity)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard
