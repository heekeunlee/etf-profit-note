import React, { useState, useEffect } from 'react';

const VsModal = ({ comparisonData, onClose }) => {
    // Animation Logic
    const [animState, setAnimState] = useState({
        heekeunHeight: 0,
        geonkyungHeight: 0,
        isFinished: false
    });

    useEffect(() => {
        // Simple delay to allow render at 0 height, then trigger transition
        const startTimeout = setTimeout(() => {
            const totalMax = Math.max(comparisonData.heekeun?.total_profit || 1, comparisonData.geonkyung?.total_profit || 1);
            setAnimState({
                heekeunHeight: Math.min(((comparisonData.heekeun?.total_profit || 0) / totalMax) * 100, 100),
                geonkyungHeight: Math.min(((comparisonData.geonkyung?.total_profit || 0) / totalMax) * 100, 100),
                isFinished: false
            });
        }, 100);

        // Show text/results after bar animation completes (e.g. 1.5s)
        const finishTimeout = setTimeout(() => {
            setAnimState(prev => ({
                ...prev,
                isFinished: true
            }));
        }, 1600);

        return () => {
            clearTimeout(startTimeout);
            clearTimeout(finishTimeout);
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
                    <div className="flex justify-between items-end mb-4 relative min-h-[340px]">
                        {/* Player 1 (Blue) */}
                        <div className="text-center w-1/2 pr-2 relative flex flex-col justify-end h-full">

                            <div className="mb-10 relative z-10 transition-transform duration-300"> {/* Increased margin to mb-10 for badge clearance */}
                                <div className="text-4xl mb-2 filter drop-shadow-md">🤴</div>
                                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Heekeun</div>
                                <div className={`text-lg font-black text-blue-600 tracking-tight transition-opacity duration-500 ${animState.isFinished ? 'opacity-100' : 'opacity-0'}`}>
                                    +{animState.isFinished ? (comparisonData.heekeun?.total_profit / 10000).toFixed(0) : '???'}만
                                </div>
                                {animState.isFinished && comparisonData.heekeun?.total_profit > comparisonData.geonkyung?.total_profit && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg animate-bounce whitespace-nowrap z-20">
                                        WINNER!
                                    </div>
                                )}
                            </div>

                            {/* Bar Track - Fixed Height */}
                            <div className="h-48 w-full flex items-end justify-center relative">
                                {/* The Bar */}
                                <div
                                    className="w-10 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg shadow-blue-200 shadow-lg transition-all duration-[1500ms] ease-out relative"
                                    style={{ height: `${animState.heekeunHeight}%` }}
                                >
                                    {animState.isFinished && (
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-xs text-blue-600 bg-white px-2 py-0.5 rounded-full shadow-md z-30 whitespace-nowrap">
                                            {Math.round(animState.heekeunHeight)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* VS Badge (Centered) */}
                        <div className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 pointer-events-none">
                            <span className="text-[120px] font-black italic text-gray-200">VS</span>
                        </div>

                        {/* Player 2 (Red) */}
                        <div className="text-center w-1/2 pl-2 relative flex flex-col justify-end h-full">

                            <div className="mb-10 relative z-10 transition-transform duration-300"> {/* Increased margin to mb-10 */}
                                <div className="text-4xl mb-2 filter drop-shadow-md">👸</div>
                                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Geonkyung</div>
                                <div className={`text-lg font-black text-rose-600 tracking-tight transition-opacity duration-500 ${animState.isFinished ? 'opacity-100' : 'opacity-0'}`}>
                                    +{animState.isFinished ? (comparisonData.geonkyung?.total_profit / 10000).toFixed(0) : '???'}만
                                </div>
                                {animState.isFinished && comparisonData.geonkyung?.total_profit > comparisonData.heekeun?.total_profit && (
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg animate-bounce whitespace-nowrap z-20">
                                        WINNER!
                                    </div>
                                )}
                            </div>

                            {/* Bar Track - Fixed Height */}
                            <div className="h-48 w-full flex items-end justify-center relative">
                                {/* The Bar */}
                                <div
                                    className="w-10 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-lg shadow-rose-200 shadow-lg transition-all duration-[1500ms] ease-out relative"
                                    style={{ height: `${animState.geonkyungHeight}%` }}
                                >
                                    {animState.isFinished && (
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-xs text-rose-600 bg-white px-2 py-0.5 rounded-full shadow-md z-30 whitespace-nowrap">
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
