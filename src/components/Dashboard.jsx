import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Wallet, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const Dashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

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

    if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading Profit Note...</div>
    if (!data) return <div className="flex h-screen items-center justify-center text-red-500">Error loading data.</div>

    const lastEntry = data.history[data.history.length - 1]
    const isProfit = lastEntry.daily_profit >= 0

    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-950 shadow-2xl overflow-hidden sm:max-w-4xl sm:my-8 sm:rounded-3xl sm:border sm:border-slate-800">
            {/* Header */}
            <header className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        ETF Profit Note
                    </h1>
                    <span className="text-xs font-mono text-slate-500 px-2 py-1 bg-slate-800 rounded-full">
                        Updated: {data.last_updated.split('T')[0]}
                    </span>
                </div>
            </header>

            <div className="p-6 space-y-6">
                {/* Total Equity Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-lg shadow-indigo-900/20 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={64} />
                    </div>
                    <p className="text-indigo-200 text-sm font-medium mb-1">Total Equity</p>
                    <h2 className="text-4xl font-bold tracking-tight">
                        ₩{data.total_equity.toLocaleString()}
                    </h2>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="bg-indigo-500/30 px-2 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                            Profit: ₩{data.total_profit.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Daily Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <Calendar size={16} />
                            <span className="text-xs uppercase font-bold">Today Profit</span>
                        </div>
                        <div className={`text-xl font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isProfit ? '+' : ''}₩{lastEntry.daily_profit.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <TrendingUp size={16} />
                            <span className="text-xs uppercase font-bold">Total ROI</span>
                        </div>
                        <div className={`text-xl font-bold ${lastEntry.roi >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
                            {lastEntry.roi > 0 ? '+' : ''}{lastEntry.roi}%
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
                    <h3 className="text-sm font-bold text-slate-400 mb-4 px-2">Equity Curve</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="date" hide />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#818cf8' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                    formatter={(value) => [`₩${value.toLocaleString()}`, 'Equity']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="equity"
                                    stroke="#818cf8"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#818cf8' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent History Table */}
                <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-400 p-4 pb-2">Recent History</h3>
                    <div className="divide-y divide-slate-800/50">
                        {[...data.history].reverse().slice(0, 10).map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                <div>
                                    <div className="text-slate-300 font-medium text-sm">{item.date}</div>
                                    <div className="flex gap-2 text-xs">
                                        <span className="text-slate-500">{item.trade_count} Trades</span>
                                        {item.roi && <span className="text-indigo-400">{item.roi}% ROI</span>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-slate-200 font-medium text-sm">₩{item.equity.toLocaleString()}</div>
                                    <div className={`text-xs font-bold ${item.daily_profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {item.daily_profit >= 0 ? '+' : ''}₩{item.daily_profit.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
