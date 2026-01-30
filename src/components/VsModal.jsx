import React, { useState, useEffect } from 'react';

const VsModal = ({ comparisonData, onClose }) => {
    // Animation Logic
    const [animState, setAnimState] = useState({
        heekeunHeight: 0,
        geonkyungHeight: 0,
        isFinished: false
    });

    useEffect(() => {
        // Start with fluctuation ("Drumroll")
        const interval = setInterval(() => {
            setAnimState(prev => ({
                ...prev,
                heekeunHeight: Math.random() * 80 + 10, // Random 10-90%
                geonkyungHeight: Math.random() * 80 + 10,
                isFinished: false
            }));
        }, 80);

        // Finish after 1.5s
        const timeout = setTimeout(() => {
            clearInterval(interval);
            const totalMax = Math.max(comparisonData.heekeun?.total_profit || 1, comparisonData.geonkyung?.total_profit || 1);
            setAnimState({
                heekeunHeight: Math.min(((comparisonData.heekeun?.total_profit || 0) / totalMax) * 100, 100),
                geonkyungHeight: Math.min(((comparisonData.geonkyung?.total_profit || 0) / totalMax) * 100, 100),
                isFinished: true
            });
        }, 1500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [comparisonData]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
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
                    <button className="absolute top-4 right-4 text-white/50 hover:text-white" onClick={onClose}>✕</button>
                </div>

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
                                const diff = (comparisonData.heekeun?.total_profit || 0) - (comparisonData.geonkyung?.total_profit || 0);
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
                            <div className="text-gray-500 font-medium">₩{((comparisonData.heekeun?.total_equity || 0) - (comparisonData.heekeun?.total_profit || 0)).toLocaleString()}</div>
                            <div className="font-black text-blue-600">+₩{(comparisonData.heekeun?.total_profit || 0).toLocaleString()}</div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="text-gray-500 font-medium">₩{((comparisonData.geonkyung?.total_equity || 0) - (comparisonData.geonkyung?.total_profit || 0)).toLocaleString()}</div>
                            <div className="font-black text-rose-600">+₩{(comparisonData.geonkyung?.total_profit || 0).toLocaleString()}</div>
                        </div>
                    </div>

                    <button className="w-full mt-4 bg-black text-white py-3 rounded-xl font-bold uppercase tracking-wider transform active:scale-95 transition-transform shadow-lg" onClick={onClose}>Close Matchup</button>
                </div>
            </div>
        </div>
    );
};

export default VsModal;
