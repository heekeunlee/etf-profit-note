import { useState, useEffect } from 'react'
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from 'recharts'
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import VsModal from './VsModal'

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
    const [comparisonData, setComparisonData] = useState({ heekeun: null, geonkyung: null }) // New state for comparison
    const [showComparison, setShowComparison] = useState(false) // Modal state
    const [loading, setLoading] = useState(true)
    const [expandedMonths, setExpandedMonths] = useState([])
    const [expandedDate, setExpandedDate] = useState(null)

    useEffect(() => {
        setLoading(true)

        // Fetch BOTH users' data for comparison capability
        Promise.all([
            fetch('./data/history_heekeun.json').then(res => res.json()),
            fetch('./data/history_geonkyung.json').then(res => res.json())
        ])
            .then(([heekeunData, geonkyungData]) => {
                setComparisonData({ heekeun: heekeunData, geonkyung: geonkyungData })

                // Set active data based on current user selection
                if (activeUser === 'heekeun') {
                    setData(heekeunData)
                } else {
                    setData(geonkyungData)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load data", err)
                setLoading(false)
            })
    }, [])

    // Effect to switch active data without re-fetching if data is already loaded
    useEffect(() => {
        if (comparisonData.heekeun && comparisonData.geonkyung) {
            if (activeUser === 'heekeun') {
                setData(comparisonData.heekeun)
            } else {
                setData(comparisonData.geonkyung)
            }
        }
    }, [activeUser, comparisonData])

    // Effect to set default expanded month when data changes
    useEffect(() => {
        if (data && data.records && data.records.length > 0) {
            // Assume records are chronological, so last one is newest? 
            // Existing code used reverse(), so let's verify sort. 
            // Safest to sort by date descending to find latest.
            const sorted = [...data.records].sort((a, b) => new Date(b.date) - new Date(a.date));
            if (sorted.length > 0) {
                const latestDate = new Date(sorted[0].date);
                const latestKey = `${latestDate.getFullYear()}-${String(latestDate.getMonth() + 1).padStart(2, '0')}`;
                setExpandedMonths([latestKey]);
            }
        }
    }, [data])

    if (loading) return <div className="flex h-screen items-center justify-center text-gray-400 bg-gray-50">Loading Profit Note...</div>
    if (!data) return <div className="flex h-screen items-center justify-center text-rose-500 bg-gray-50">Error loading data.</div>

    // Prepare chart data: Calculate Cumulative Profit
    // 1. Sort records chronologically (oldest first)
    // IMPORTANT: The original code used reverse(), assuming input was oldest->newest.
    // Let's stick to explicit sort for safety in chart, but reverse for list display.

    // Sort for List (Newest First)
    const sortedRecords = [...data.records].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Sort for Chart (Oldest First)
    const chartSortedRecords = [...data.records].sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningTotal = 0;
    const chartData = chartSortedRecords.map(record => {
        runningTotal += record.daily_profit;
        return {
            date: record.date.slice(5), // "MM-DD"
            profit: runningTotal
        };
    });

    // Add Start Point (0) for better visualization
    if (chartData.length > 0) {
        chartData.unshift({ date: 'Start', profit: 0 });
    }

    const toggleExpand = (date) => {
        if (expandedDate === date) {
            setExpandedDate(null)
        } else {
            setExpandedDate(date)
        }
    }

    const toggleMonth = (monthKey) => {
        setExpandedMonths(prev =>
            prev.includes(monthKey)
                ? prev.filter(m => m !== monthKey)
                : [...prev, monthKey]
        );
    }

    return (
        <div className="min-h-screen bg-[#2e3547] flex items-start justify-center p-4 font-sans py-10">
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative">

                {/* 1. Header & Big Total Profit (Apple/Toss Style) */}
                <div className={`relative pt-6 pb-6 px-6 text-center sticky top-0 z-20 transition-all overflow-hidden duration-700 ${activeUser === 'heekeun' ? 'bg-white/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'} `}>

                    {/* Massive Emojis (Background/Side) */}
                    {activeUser === 'heekeun' && (
                        <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-[500%] leading-none filter drop-shadow-xl animate-in slide-in-from-left duration-500 hover:scale-110 transition-transform cursor-default z-0">
                            🤴
                        </div>
                    )}
                    {activeUser === 'geonkyung' && (
                        <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-[500%] leading-none filter drop-shadow-xl animate-in slide-in-from-right duration-500 hover:scale-110 transition-transform cursor-default z-0">
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
                                    } `}
                            >
                                이희근
                            </button>

                            {/* THE FIERY VS */}
                            <div className="relative mx-2">
                                <span className="text-5xl font-[900] italic leading-none text-gray-800 tracking-tighter cursor-default select-none transition-transform hover:scale-110" style={{ fontFamily: 'Impact, sans-serif' }}>
                                    VS.
                                </span>
                            </div>

                            {/* Player 2 Button */}
                            <button
                                onClick={() => setActiveUser('geonkyung')}
                                className={`px-4 py-2 rounded-xl text-base font-black italic tracking-tighter transition-all transform duration-300 border-2 ${activeUser === 'geonkyung'
                                    ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.5)] scale-110 rotate-2'
                                    : 'bg-white text-gray-300 border-gray-200 hover:scale-105 hover:bg-gray-50'
                                    } `}
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

                {/* 2. Cumulative Profit Chart (Area Visualization) */}
                <div className="h-32 w-full mb-8 relative px-4">
                    <div className="absolute top-0 left-6 text-xs text-gray-400 font-bold z-10">Accumulated Profit Trend</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={activeUser === 'heekeun' ? '#3b82f6' : '#f43f5e'} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={activeUser === 'heekeun' ? '#bfdbfe' : '#fecdd3'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                cursor={{ stroke: activeUser === 'heekeun' ? '#93c5fd' : '#fda4af', strokeWidth: 2, strokeDasharray: '5 5' }}
                                contentStyle={{
                                    backgroundColor: '#ffffff',
                                    borderColor: activeUser === 'heekeun' ? '#3b82f6' : '#f43f5e',
                                    borderRadius: '12px',
                                    color: '#1f2937',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ color: activeUser === 'heekeun' ? '#2563eb' : '#e11d48' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value) => [`+₩${value.toLocaleString()}`, 'Accumulated']}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                interval="preserveStartEnd"
                                padding={{ left: 10, right: 10 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="profit"
                                stroke={activeUser === 'heekeun' ? '#2563eb' : '#e11d48'}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorProfit)"
                                animationDuration={1500}
                                dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: activeUser === 'heekeun' ? '#2563eb' : '#e11d48' }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: activeUser === 'heekeun' ? '#2563eb' : '#e11d48' }}
                                label={({ x, y, value, index }) => (
                                    <text x={x} y={y - 10} fill={activeUser === 'heekeun' ? '#2563eb' : '#e11d48'} fontSize={9} fontWeight="bold" textAnchor="middle">
                                        {index === 0 ? 'Start' : `+${(value / 10000).toFixed(0)}만`}
                                    </text>
                                )}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* 3. Daily Records List (Grouped by Month) */}
                <div className="px-6 pb-2">
                    <h3 className="text-lg font-bold text-gray-900 border-b-2 border-gray-100 pb-2 mb-4">Trading History</h3>
                </div>

                <div className="space-y-6 px-4 pb-12">
                    {(() => {
                        // Group records by month
                        const groups = sortedRecords.reduce((acc, record) => {
                            const dateObj = new Date(record.date);
                            const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
                            if (!acc[monthKey]) {
                                acc[monthKey] = {
                                    key: monthKey,
                                    label: `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월`,
                                    totalProfit: 0,
                                    records: []
                                };
                            }
                            acc[monthKey].records.push(record);
                            acc[monthKey].totalProfit += record.daily_profit;
                            return acc;
                        }, {});

                        // Render each group
                        return Object.values(groups).map((group) => {
                            const isExpanded = expandedMonths.includes(group.key);

                            return (
                                <div key={group.key} className="space-y-3">
                                    {/* Month Header (Clickable) */}
                                    <button
                                        onClick={() => toggleMonth(group.key)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group border
                                            ${isExpanded
                                                ? 'bg-gray-50 border-gray-200 shadow-sm'
                                                : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300'
                                            }`}
                                    >
                                        <h4 className={`text-base font-bold transition-colors ${isExpanded ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>
                                            {group.label}
                                        </h4>
                                        <div className="flex items-center gap-3">
                                            <div className={`text-sm font-bold transition-colors ${isExpanded ? 'text-gray-900' : 'text-gray-700'}`}>
                                                <span className="text-xs text-gray-400 font-normal mr-2">월 수익</span>
                                                +₩{group.totalProfit.toLocaleString()}
                                            </div>
                                            {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                        </div>
                                    </button>

                                    {/* Daily Cards (Conditional Render) */}
                                    {isExpanded && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            {group.records.map((record, idx) => (
                                                <div key={idx} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${expandedDate === record.date ? 'border-rose-100 shadow-lg bg-white box-border' : 'border-gray-100 bg-white shadow-sm'} `}>

                                                    {/* Card Header (Daily Summary) */}
                                                    <div
                                                        onClick={() => toggleExpand(record.date)}
                                                        className={`p-5 flex items-center justify-between cursor-pointer select-none transition-colors ${expandedDate === record.date ? 'bg-white' : 'hover:bg-amber-50'} `}
                                                    >
                                                        <div>
                                                            <div className="text-blue-500 text-sm font-bold mb-0.5">{record.date}</div>
                                                            <div className="text-gray-900 font-bold text-lg">
                                                                +₩{record.daily_profit.toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex flex-col items-end gap-1">
                                                            <div className={`text-xs font-bold px-2 py-1 rounded-md ${record.daily_roi >= 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'} `}>
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
                                    )}
                                </div>
                            );
                        });
                    })()}
                </div>

                {/* Buttons Action Area */}
                <div className="px-6 mb-8 mt-4 grid grid-cols-2 gap-3">
                    {/* NEW: VS Analysis Button */}
                    <button
                        onClick={() => setShowComparison(true)}
                        className="col-span-1 py-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase italic tracking-widest shadow-lg transition-all active:scale-95 bg-black text-white hover:bg-gray-800 border-2 border-gray-700"
                    >
                        <span>⚔️</span>
                        <span>VS Mode</span>
                    </button>

                    {/* Share Report Button */}
                    <button
                        onClick={() => {
                            // Helper: Get visual width (Korean=2, English=1)
                            const getVisualLength = (str) => {
                                let length = 0;
                                for (let i = 0; i < str.length; i++) {
                                    const charCode = str.charCodeAt(i);
                                    // Korean characters range
                                    if ((charCode >= 0x1100 && charCode <= 0x11FF) ||
                                        (charCode >= 0x3130 && charCode <= 0x318F) ||
                                        (charCode >= 0xAC00 && charCode <= 0xD7A3)) {
                                        length += 2;
                                    } else {
                                        length += 1;
                                    }
                                }
                                return length;
                            };

                            // Helper: Pad string with compensation for narrow spaces
                            const padText = (str, targetLength) => {
                                const currentLength = getVisualLength(str);
                                if (currentLength >= targetLength) return str;
                                // In many mobile fonts, space is narrower than half a CJK char.
                                // We add a bit more padding to compensate.
                                const paddingNeeded = targetLength - currentLength;
                                // Simple heuristic: just use spaces. 
                                return str + ' '.repeat(paddingNeeded);
                            };

                            // 1. Generate Report Text
                            const userName = activeUser === 'heekeun' ? '이희근' : '이건경';
                            const now = new Date();
                            const formattedDate = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}.`;

                            let report = `📝 ETF 퀀트투자 실현손익 보고서\n`;
                            report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                            report += `👤 투자자: ${userName} \n`;
                            report += `🕒 기준일: ${formattedDate} \n`;
                            report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

                            report += `💰 1월 누적 실현손익\n`;
                            report += `   + ${data.total_profit.toLocaleString()} 원\n\n`;

                            report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                            report += `[일자별 상세 실현손익 ]\n\n`;

                            data.records.forEach((record, index) => {
                                const dateObj = new Date(record.date);
                                const dayName = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
                                const shortDate = record.date.slice(5).replace('-', '.');

                                // Emoji number 1-9
                                const numEmoji = index < 9 ? ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'][index] : '#️⃣';

                                // Date Header
                                report += `${numEmoji} ${shortDate} (${dayName}) | +${record.daily_profit.toLocaleString()} 원(${record.daily_roi} %) \n`;

                                // Trades
                                const sortedTrades = [...record.trades].sort((a, b) => b.profit - a.profit);
                                sortedTrades.forEach(trade => {
                                    let cleanName = trade.name.replace('PLUS ', '').replace('KODEX ', '').replace('TIGER ', '').replace('ACE ', '').replace('HANARO ', '');

                                    // Aggressive truncation for better mobile column alignment
                                    // Target ~6-7 CJK chars max
                                    if (getVisualLength(cleanName) > 12) {
                                        cleanName = cleanName.slice(0, 6) + '..';
                                    }

                                    // Pad to fixed width (14 visual units)
                                    const paddedName = padText(cleanName, 14);

                                    // Right-align profit (width ~10)
                                    const profitStr = `+ ${trade.profit.toLocaleString()} `.padStart(11, ' ');

                                    report += `   ▪️ ${paddedName} ${profitStr} \n`;
                                });
                                report += `\n`;
                            });

                            report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                            report += `🚀 Generated by ETF Profit Note`;

                            // 2. Share or Copy
                            if (navigator.share) {
                                navigator.share({
                                    title: `ETF Profit Report - ${userName} `,
                                    text: report,
                                });
                            } else {
                                navigator.clipboard.writeText(report).then(() => {
                                    alert("📄 Report copied to clipboard!");
                                }).catch(err => {
                                    console.error('Failed to copy: ', err);
                                });
                            }
                        }}
                        className={`col-span-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg transition-all active:scale-95 ${activeUser === 'heekeun'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-200 hover:shadow-blue-300'
                            : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-200 hover:shadow-rose-300'
                            } `}
                    >
                        <span>📄</span>
                        <span>Share</span>
                    </button>
                    <p className="col-span-2 text-center text-xs text-gray-400 mt-1">
                        Compare performance or share weekly report.
                    </p>
                </div>

                {/* Footer Signature */}
                <div className="pb-8 pt-0 text-center">
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                        Engineered by Heekeun Lee <span className="mx-1 text-gray-300">|</span> Co-piloted by DeepMind AI
                    </p>
                </div>


                {/* VS COMPARISON MODAL */}
                {showComparison && (
                    <VsModal
                        comparisonData={comparisonData}
                        onClose={() => setShowComparison(false)}
                    />
                )}

            </div>
        </div>
    )
}

export default Dashboard
