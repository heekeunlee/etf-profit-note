import PropTypes from 'prop-types'

export default function Splash({ isFading }) {
  const title = '돈쭐노트'

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-label="Splash screen"
      role="img"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={`${import.meta.env.BASE_URL}saltbae.png`}
            alt="돈쭐노트 로고"
            className="w-44 h-44 md:w-60 md:h-60 object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.18)] animate-[splashPop_650ms_cubic-bezier(.2,.9,.2,1)_both]"
          />
        </div>

        <div className="text-center">
          <div
            className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 font-sans"
            aria-label={title}
          >
            {Array.from(title).map((ch, i) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={`${ch}-${i}`}
                className="inline-block opacity-0 animate-[splashType_900ms_steps(1,end)_forwards]"
                style={{ animationDelay: `${350 + i * 120}ms` }}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splashPop {
          0% { transform: translateY(10px) scale(0.92); opacity: 0; filter: saturate(0.95); }
          60% { transform: translateY(0px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        @keyframes splashType {
          0% { opacity: 0; transform: translateY(6px); filter: blur(1.5px); }
          100% { opacity: 1; transform: translateY(0px); filter: blur(0px); }
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

