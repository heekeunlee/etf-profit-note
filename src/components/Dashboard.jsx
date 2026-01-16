import { useState, useEffect } from 'react'
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis } from 'recharts'
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'

// Utility Component for Number Animation
const CountUp = ({ end, duration = 1000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const progressRatio = Math.min(progress / duration, 1);

            // Ease-out expo function for smooth landing
            const easeOut = (x) => 1 - Math.pow(2, -10 * x);

            setCount(Math.floor(easeOut(progressRatio) * end));

            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <>{count.toLocaleString()}</>;
};

const Dashboard = () => {
    const [activeUser, setActiveUser] = useState('heekeun') // 'heekeun' or 'geonkyung'
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [expandedDate, setExpandedDate] = useState(null)

    useEffect(() => {
        setLoading(true)
        const fileName = activeUser === 'heekeun' ? 'history_heekeun.json' : 'history_geonkyung.json'

        fetch(`./data/${fileName}`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
                setExpandedDate(null) // Reset expanded state when switching user
            })
            .catch(err => {
                console.error("Failed to load data", err)
                setLoading(false)
            })
    }, [activeUser])

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
        <div className={`min-h-screen transition-colors duration-700 ease-in-out pb-10 font-sans ${activeUser === 'heekeun' ? 'bg-blue-50/30' : 'bg-rose-50/30'}`}>
            <div className={`max-w-md mx-auto sm:max-w-2xl min-h-screen shadow-2xl transition-colors duration-700 ease-in-out ${activeUser === 'heekeun' ? 'bg-white shadow-blue-200/50' : 'bg-white shadow-rose-200/50'}`}>

                {/* 1. Header & Big Total Profit (Apple/Toss Style) */}
                <div className={`relative pt-6 pb-6 px-6 text-center sticky top-0 z-20 transition-all overflow-hidden duration-700 ${activeUser === 'heekeun' ? 'bg-white/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'}`}>

                    {/* Massive Emojis (Background/Side) */}
                    {activeUser === 'heekeun' && (
                        <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-[500%] leading-none filter drop-shadow-xl animate-in slide-in-from-left duration-500 hover:scale-110 transition-transform cursor-default z-0 opacity-10">
                            🤴
                        </div>
                    )}
                    {activeUser === 'geonkyung' && (
                        <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[500%] leading-none filter drop-shadow-xl animate-in slide-in-from-right duration-500 hover:scale-110 transition-transform cursor-default z-0 opacity-10">
                            👸
                        </div>
                    )}

                    {/* User Tab Navigation - FIGHTING GAME STYLE (Mini Version) */}
                    <div className="relative z-10 flex justify-center items-center mb-6 pt-2">
                        <div className="flex items-center gap-4 scale-75 origin-top">
                            {/* Player 1 Button */}
                            <button
                                onClick={() => setActiveUser('heekeun')}
                                className={`px-4 py-2 rounded-xl text-base font-black italic tracking-tighter transition-all transform duration-300 border-2 ${activeUser === 'heekeun'
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-110 -rotate-2'
                                        : 'bg-white text-gray-300 border-gray-200 hover:scale-105 hover:bg-gray-50'
                                    }`}
                            >
                                이희근
                            </button>

                            {/* THE FIERY VS */}
                            <div className="relative">
                                <span className="absolute -inset-1 blur-sm bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-full opacity-75 animate-pulse"></span>
                                <span className="relative text-3xl font-[900] italic leading-none bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-red-600 filter drop-shadow hover:scale-125 transition-transform cursor-crosshair select-none" style={{ fontFamily: 'Impact, sans-serif' }}>
                                    VS
                                </span>
                            </div>

                            {/* Player 2 Button */}
                            <button
                                onClick={() => setActiveUser('geonkyung')}
                                className={`px-4 py-2 rounded-xl text-base font-black italic tracking-tighter transition-all transform duration-300 border-2 ${activeUser === 'geonkyung'
                                        ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.5)] scale-110 rotate-2'
                                        : 'bg-white text-gray-300 border-gray-200 hover:scale-105 hover:bg-gray-50'
                                    }`}
                            >
                                이건경
                            </button>
                        </div>
                    </div>

                    <h1 className="relative z-10 text-base font-bold text-gray-600 mb-2 uppercase tracking-wide">
                        {activeUser === 'heekeun' ? 'ETF 퀀트투자 실현손익 현황' : '주식투자 실현손익 현황'}
                    </h1>
                    <div className="relative z-10 text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-1">
                        <span className="text-2xl text-gray-400 font-bold self-start mt-1">₩</span>
                        <CountUp end={data.total_profit} />
                    </div>

                    <div className="relative z-10 mt-2 inline-flex items-center px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">
                        <span className="mr-1">🚀</span> Growing Wealth
                    </div>
                </div>

                {/* 2. Cumulative Profit Chart (Bar Visualization) */}
                <div className="h-28 w-full mb-8 relative px-4">
                    <div className="absolute top-0 left-6 text-xs text-gray-400 font-bold z-10">Accumulated Profit Steps</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProfitBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#fb7185" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#f43f5e', borderRadius: '12px', color: '#1f2937', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#f43f5e' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value) => [`+₩${value.toLocaleString()}`, 'Accumulated']}
                            />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                            <Bar
                                dataKey="profit"
                                fill="url(#colorProfitBar)"
                                radius={[8, 8, 0, 0]}
                                barSize={40}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 3. Daily Records List */}
                <div className="px-6 pb-2">
                    <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-100 pb-2 mb-4">Trading History</h3>
                </div>

                <div className="space-y-4 px-4 pb-12">
                    {data.records.map((record, idx) => (
                        <div key={idx} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedDate === record.date ? 'border-rose-100 shadow-lg bg-white box-border' : 'border-gray-100 bg-white shadow-sm'}`}>

                            {/* Card Header (Daily Summary) */}
                            <div
                                onClick={() => toggleExpand(record.date)}
                                className={`p-5 flex items-center justify-between cursor-pointer select-none transition-colors ${expandedDate === record.date ? 'bg-white' : 'hover:bg-amber-50'}`}
                            >
                                <div>
                                    <div className="text-blue-500 text-sm font-bold mb-0.5">{record.date}</div>
                                    <div className="text-gray-900 font-bold text-lg">
                                        +₩{record.daily_profit.toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <div className={`text-xs font-bold px-2 py-1 rounded-md ${record.daily_roi >= 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {record.daily_roi > 0 ? '+' : ''}{record.daily_roi}% ROI
                                    </div>
                                    {expandedDate === record.date ? <ChevronUp size={16} className="text-rose-400" /> : <ChevronDown size={16} className="text-gray-300" />}
                                </div>
                            </div>

                            {/* Card Body (Detailed Trades) */}
                            {expandedDate === record.date && (
                                <div className="bg-indigo-50/40 px-4 py-6 border-t border-rose-100 animate-in slide-in-from-top-1 duration-200">
                                    <div className="relative ml-2 pl-5 border-l-2 border-indigo-200 space-y-4">
                                        {/* Visual node for better connection */}
                                        <div className="absolute -left-[5px] -top-0 w-2 h-2 rounded-full bg-indigo-300"></div>

                                        {record.trades.map((trade, tIdx) => (
                                            <div key={tIdx} className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm relative hover:border-indigo-300 transition-colors">
                                                {/* Little connector line item */}
                                                <div className="absolute -left-[22px] top-6 w-5 h-[2px] bg-indigo-200"></div>

                                                {/* Trade Header: Name & Profit */}
                                                <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-2">
                                                    <span className="text-gray-900 font-bold text-sm tracking-tight">{trade.name}</span>
                                                    <div className="text-right">
                                                        <div className="text-rose-500 font-bold text-sm">+₩{trade.profit.toLocaleString()}</div>
                                                        <div className="text-rose-500/80 text-[10px] font-medium bg-rose-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                                            +{trade.roi}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Trade Details Flow (Buy -> Sell) */}
                                                <div className="relative">
                                                    <div className="text-[10px] text-gray-400 mb-2 font-medium">Avg Price: ₩{trade.avg_price.toLocaleString()}</div>

                                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-400 uppercase font-semibold">Buy Amount</span>
                                                            <span className="text-xs font-medium text-gray-600">₩{trade.buy_amount.toLocaleString()}</span>
                                                        </div>

                                                        <ArrowRight size={14} className="text-indigo-300" />

                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] text-rose-500 font-bold uppercase">Sell Amount</span>
                                                            <span className="text-sm font-bold text-gray-900">₩{trade.sell_amount.toLocaleString()}</span>
                                                        </div>
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

                {/* Footer Signature */}
                <div className="pb-8 pt-4 text-center">
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                        Engineered by Heekeun Lee <span className="mx-1 text-gray-300">|</span> Co-piloted by DeepMind AI
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Dashboard
