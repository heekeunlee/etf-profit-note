import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react'

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [expandedDate, setExpandedDate] = useState(null)

    useEffect(() => {
        fetch('./data/history.json')
            .then(res => res.json())
            .then(data => {
                setData(data)
                // Auto expand the latest date
                if (data.records && data.records.length > 0) {
                    setExpandedDate(data.records[0].date)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load data", err)
                setLoading(false)
            })
    }, [])

    if (loading) return <div className="flex h-screen items-center justify-center text-slate-400 bg-slate-950">Loading Profit Note...</div>
    if (!data) return <div className="flex h-screen items-center justify-center text-rose-500 bg-slate-950">Error loading data.</div>

    // Prepare chart data (reverse chronological order for display, chronological for chart)
    const chartData = [...data.records].reverse().map(record => ({
        date: record.date.slice(5), // "MM-DD"
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
        <div className="min-h-screen bg-slate-950 text-slate-200 pb-10">
            <div className="max-w-md mx-auto sm:max-w-2xl">

                {/* Helper Header */}
                <header className="px-6 py-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            Profit Note
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">ETF Quantitative Trading</p>
                    </div>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-2 py-1 rounded-full">
                        Last: {data.last_updated.split('T')[0]}
                    </span>
                </header>

                {/* 1. Global Status Card */}
                <div className="mx-4 mb-6 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
                            <Wallet size={16} className="text-indigo-500" /> Total Equity
                        </p>
                        <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
                            ₩{data.total_equity.toLocaleString()}
                        </h2>

                        <div className="flex gap-4">
                            <div className="px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Profit</p>
                                <p className="text-emerald-400 font-bold text-sm">+₩{data.total_profit.toLocaleString()}</p>
                            </div>
                            <div className="px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total ROI</p>
                                <p className="text-indigo-400 font-bold text-sm">
                                    {((data.total_profit / (data.total_equity - data.total_profit)) * 100).toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative background element */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -left-10 bottom-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* 2. Growth Chart (Area) */}
                <div className="mx-4 mb-8 bg-slate-900/40 border border-slate-800/50 rounded-3xl p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <TrendingUp size={16} className="text-slate-400" />
                        <h3 className="text-sm font-bold text-slate-300">Asset Growth</h3>
                    </div>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                                    itemStyle={{ color: '#818cf8' }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                    formatter={(value) => [`₩${value.toLocaleString()}`, '']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="equity"
                                    stroke="#818cf8"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorEquity)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Daily Records List */}
                <div className="px-6 pb-2">
                    <h3 className="text-lg font-bold text-white mb-4">Trading History</h3>
                </div>

                <div className="space-y-4 px-4">
                    {data.records.map((record, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">

                            {/* Card Header (Daily Summary) */}
                            <div
                                onClick={() => toggleExpand(record.date)}
                                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                            >
                                <div>
                                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">{record.date}</div>
                                    <div className="text-white font-bold text-lg">
                                        +₩{record.daily_profit.toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-bold px-3 py-1 rounded-lg inline-block mb-1 ${record.daily_roi >= 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {record.daily_roi > 0 ? '+' : ''}{record.daily_roi}%
                                    </div>
                                    <div className="text-slate-500 text-xs flex items-center justify-end gap-1">
                                        {record.trades.length} Trades
                                        {expandedDate === record.date ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                </div>
                            </div>

                            {/* Card Body (Detailed Trades) */}
                            {expandedDate === record.date && (
                                <div className="bg-slate-950/50 border-t border-slate-800 p-4 space-y-3">
                                    {record.trades.map((trade, tIdx) => (
                                        <div key={tIdx} className="flex justify-between items-start py-2 border-b border-slate-800/50 last:border-0 last:pb-0">
                                            <div>
                                                <div className="text-slate-200 font-bold text-sm mb-1">{trade.name}</div>
                                                <div className="text-slate-500 text-xs">Sell: ₩{trade.sell_amount.toLocaleString()}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-rose-400 font-bold text-sm">+₩{trade.profit.toLocaleString()}</div>
                                                <div className="text-rose-400/80 text-xs bg-rose-900/20 px-1.5 py-0.5 rounded inline-block mt-1">
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

            </div>
        </div>
    )
}

export default Dashboard
