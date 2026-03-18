import PropTypes from 'prop-types'

export default function Splash({ isFading }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-300 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-label="Splash screen"
      role="img"
    >
      <div className="flex flex-col items-center gap-7">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 blur-2xl opacity-25 animate-[splashGlow_1.8s_ease-in-out_infinite]" />
          <img
            src="/saltbae.png"
            alt="돈쭐노트 로고"
            className="relative w-44 h-44 md:w-60 md:h-60 object-contain drop-shadow-2xl animate-[splashPop_650ms_cubic-bezier(.2,.9,.2,1)_both,splashFloat_2.6s_ease-in-out_700ms_infinite]"
          />
        </div>

        <div className="text-center">
          <div className="text-5xl md:text-6xl font-black tracking-tight text-white font-sans">
            돈쭐노트
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splashPop {
          0% { transform: translateY(10px) scale(0.92); opacity: 0; filter: saturate(0.95); }
          60% { transform: translateY(0px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        @keyframes splashFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes splashGlow {
          0%, 100% { opacity: 0.22; transform: scale(0.98); }
          50% { opacity: 0.34; transform: scale(1.02); }
        }
      `}</style>
    </div>
  )
}

Splash.propTypes = {
  isFading: PropTypes.bool,
}

Splash.defaultProps = {
  isFading: false,
}

