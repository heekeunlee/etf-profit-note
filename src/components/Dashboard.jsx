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
    const [comparisonData, setComparisonData] = useState({ heekeun: null, geonkyung: null }) // New state for comparison
    const [showComparison, setShowComparison] = useState(false) // Modal state
    const [loading, setLoading] = useState(true)
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
                setExpandedDate(null)
            })
            .catch(err => {
                console.error("Failed to load data", err)
                setLoading(false)
            })
    }, []) // Run once on mount to fetch all, then handle active user switch via local state logic if needed or just simple switching

    // Effect to switch active data without re-fetching if data is already loaded
    useEffect(() => {
        if (comparisonData.heekeun && comparisonData.geonkyung) {
            setExpandedDate(null)
            if (activeUser === 'heekeun') {
                setData(comparisonData.heekeun)
            } else {
                setData(comparisonData.geonkyung)
            }
        }
    }, [activeUser, comparisonData])

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
                                    }`}
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
                            report += `👤 투자자  : ${userName}\n`;
                            report += `🕒 기준일  : ${formattedDate}\n`;
                            report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

                            report += `💰 1월 누적 실현손익\n`;
                            report += `   +${data.total_profit.toLocaleString()} 원\n\n`;

                            report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                            report += `[ 일자별 상세 실현손익 ]\n\n`;

                            data.records.forEach((record, index) => {
                                const dateObj = new Date(record.date);
                                const dayName = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
                                const shortDate = record.date.slice(5).replace('-', '.');

                                // Emoji number 1-9
                                const numEmoji = index < 9 ? ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'][index] : '#️⃣';

                                // Date Header
                                report += `${numEmoji} ${shortDate} (${dayName}) | +${record.daily_profit.toLocaleString()}원 (${record.daily_roi}%)\n`;

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
                                    const profitStr = `+${trade.profit.toLocaleString()}`.padStart(11, ' ');

                                    report += `   ▪️ ${paddedName} ${profitStr}\n`;
                                });
                                report += `\n`;
                            });

                            report += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
                            report += `🚀 Generated by ETF Profit Note`;

                            // 2. Share or Copy
                            if (navigator.share) {
                                navigator.share({
                                    title: `ETF Profit Report - ${userName}`,
                                    text: report,
                                }).catch(console.error);
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
                            }`}
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowComparison(false)}>
                        <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>

                            {/* Header */}
                            <div className="bg-black text-white p-4 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-red-900 opacity-50 animate-pulse"></div>
                                <h2 className="relative z-10 text-3xl font-black italic tracking-tighter uppercase transform -rotate-2" style={{ fontFamily: 'Impact' }}>
                                    🔥 MONEY WARS 🔥
                                </h2>
                                <div className="relative z-10 text-[10px] font-bold text-yellow-300 tracking-[0.5em] uppercase mt-1">
                                    Round 1: January
                                </div>
                                <button className="absolute top-4 right-4 text-white/50 hover:text-white" onClick={() => setShowComparison(false)}>✕</button>
                            </div>

                            {/* VS Content */}
                            {(() => {
                                // Animation Logic confined to this modal render
                                const [animState, setAnimState] = useState({
                                    heekeunHeight: 0,
                                    geonkyungHeight: 0,
                                    isFinished: false
                                });

                                useEffect(() => {
                                    // Start with fluctuation
                                    const interval = setInterval(() => {
                                        setAnimState(prev => ({
                                            ...prev,
                                            heekeunHeight: Math.random() * 80 + 10, // Random 10-90%
                                            geonkyungHeight: Math.random() * 80 + 10,
                                            isFinished: false
                                        }));
                                    }, 100);

                                    // Finish after 1.5s
                                    const timeout = setTimeout(() => {
                                        clearInterval(interval);
                                        const totalMax = Math.max(comparisonData.heekeun?.total_profit, comparisonData.geonkyung?.total_profit);
                                        setAnimState({
                                            heekeunHeight: (comparisonData.heekeun?.total_profit / totalMax) * 100,
                                            geonkyungHeight: (comparisonData.geonkyung?.total_profit / totalMax) * 100,
                                            isFinished: true
                                        });
                                    }, 1500);

                                    return () => {
                                        clearInterval(interval);
                                        clearTimeout(timeout);
                                    };
                                }, []);

                                return (
                                    <div className="p-6">
                                        <div className="flex justify-between items-end mb-8 relative h-64">
                                            {/* Player 1 (Blue) */}
                                            <div className="text-center w-1/2 pr-2 relative flex flex-col justify-end h-full">
                                                {animState.isFinished && comparisonData.heekeun?.total_profit > comparisonData.geonkyung?.total_profit && (
                                                    <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg animate-bounce whitespace-nowrap z-20">
                                                        WINNER!
                                                    </div>
                                                )}

                                                <div className="mb-2">
                                                    <div className="text-4xl mb-1 filter drop-shadow-md">🤴</div>
                                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Heekeun</div>
                                                    <div className={`text-lg font-black text-blue-600 tracking-tight transition-opacity duration-500 ${animState.isFinished ? 'opacity-100' : 'opacity-0'}`}>
                                                        +{animState.isFinished ? (comparisonData.heekeun?.total_profit / 10000).toFixed(0) : '???'}만
                                                    </div>
                                                </div>

                                                {/* Bar Track */}
                                                <div className="h-full w-full flex items-end justify-center relative">
                                                    {/* The Bar */}
                                                    <div
                                                        className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg shadow-blue-200 shadow-lg transition-all duration-300 ease-out relative"
                                                        style={{ height: `${animState.heekeunHeight}%` }}
                                                    >
                                                        {animState.isFinished && (
                                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-xs text-blue-600 bg-white px-1 rounded shadow-sm">
                                                                {Math.round(animState.heekeunHeight)}%
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* VS Badge (Centered) */}
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                                <div className={`bg-black text-white rounded-full p-3 border-4 border-white shadow-2xl transform transition-transform duration-700 ${animState.isFinished ? 'scale-100 rotate-0' : 'scale-110 rotate-180'}`}>
                                                    <span className="text-2xl font-black italic block leading-none">VS</span>
                                                </div>
                                            </div>

                                            {/* Player 2 (Red) */}
                                            <div className="text-center w-1/2 pl-2 relative flex flex-col justify-end h-full">
                                                {animState.isFinished && comparisonData.geonkyung?.total_profit > comparisonData.heekeun?.total_profit && (
                                                    <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg animate-bounce whitespace-nowrap z-20">
                                                        WINNER!
                                                    </div>
                                                )}

                                                <div className="mb-2">
                                                    <div className="text-4xl mb-1 filter drop-shadow-md">👸</div>
                                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Geonkyung</div>
                                                    <div className={`text-lg font-black text-rose-600 tracking-tight transition-opacity duration-500 ${animState.isFinished ? 'opacity-100' : 'opacity-0'}`}>
                                                        +{animState.isFinished ? (comparisonData.geonkyung?.total_profit / 10000).toFixed(0) : '???'}만
                                                    </div>
                                                </div>

                                                {/* Bar Track */}
                                                <div className="h-full w-full flex items-end justify-center relative">
                                                    {/* The Bar */}
                                                    <div
                                                        className="w-8 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-lg shadow-rose-200 shadow-lg transition-all duration-300 ease-out relative"
                                                        style={{ height: `${animState.geonkyungHeight}%` }}
                                                    >
                                                        {animState.isFinished && (
                                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-bold text-xs text-rose-600 bg-white px-1 rounded shadow-sm">
                                                                {Math.round(animState.geonkyungHeight)}%
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Witty Commentary - Only show after finish */}
                                        <div className={`bg-gray-50 rounded-xl p-4 mb-4 border-2 border-dashed border-gray-200 text-center transition-all duration-500 ${animState.isFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">📢 AI Commentary</h4>
                                            <p className="text-sm font-bold text-gray-800 italic">
                                                {(() => {
                                                    const diff = comparisonData.heekeun?.total_profit - comparisonData.geonkyung?.total_profit;
                                                    if (diff > 0) {
                                                        return `Looks like Heekeun is buying dinner tonight! 🍣 (+${(diff / 10000).toFixed(0)}만 lead)`;
                                                    } else if (diff < 0) {
                                                        return `Geonkyung takes the crown! Bow down to the Queen! 👑 (+${(Math.abs(diff) / 10000).toFixed(0)}만 lead)`;
                                                    } else {
                                                        return "It's a tie! Incredible! What are the odds? 🤝";
                                                    }
                                                })()}
                                            </p>
                                        </div>

                                        {/* Stats Table - Only show after finish */}
                                        <div className={`space-y-2 mb-2 transition-all duration-700 ${animState.isFinished ? 'opacity-100' : 'opacity-0'}`}>
                                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase border-b pb-1">
                                                <span>Initial Equity</span>
                                                <span>Total Profit</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="text-gray-500 font-medium">₩{(comparisonData.heekeun?.total_equity - comparisonData.heekeun?.total_profit).toLocaleString()}</div>
                                                <div className="font-black text-blue-600">+₩{comparisonData.heekeun?.total_profit.toLocaleString()}</div>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="text-gray-500 font-medium">₩{(comparisonData.geonkyung?.total_equity - comparisonData.geonkyung?.total_profit).toLocaleString()}</div>
                                                <div className="font-black text-rose-600">+₩{comparisonData.geonkyung?.total_profit.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <button className="w-full mt-4 bg-black text-white py-3 rounded-xl font-bold uppercase tracking-wider transform active:scale-95 transition-transform shadow-lg" onClick={() => setShowComparison(false)}>Close Matchup</button>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Dashboard
