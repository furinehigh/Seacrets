'use client'

import { useEffect, useRef } from 'react'

export default function OceanCanvas({ bottles, onBottleOpen }: any) {
    const oceanRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ocean = oceanRef.current!
        const bottleEls: HTMLDivElement[] = []

        // create bottle dom nodes
        bottles.forEach(b => {
            const el = document.createElement('div')

            el.style.position = 'absolute'
            el.style.width = '49px'
            el.style.height = '126px'
            el.style.backgroundImage = 'url(/bottle.webp)'
            el.style.backgroundSize = 'contain'
            el.style.backgroundRepeat = 'no-repeat'
            el.style.cursor = 'pointer'
            el.style.userSelect = 'none'
            el.style.zIndex = Math.random() > 0.5 ? '5' : '15'
            el.onclick = () => onBottleOpen(b)

            ocean.appendChild(el)
            bottleEls.push(el)
        })

        // bottle motion
        const wave = { t: 0 }

        const params = bottleEls.map(el => {
            const baseY = ocean.clientHeight * (0.9)
            const baseX = Math.random() * ocean.clientWidth
            const phase = Math.random() * 999
            const amp = 12 + Math.random() * 13
            const drift = 0.25 + Math.random() * 0.15

            el.style.transform = `translate(${baseX}px, ${baseY}px)`

            return { el, baseX, baseY, phase, amp, drift }
        })

        let frame: number

        const loop = () => {
            wave.t += 0.01

            params.forEach(p => {
                // sine bobbing
                const y = p.baseY + Math.sin(wave.t + p.phase) * p.amp
                const rot = Math.sin(wave.t + p.phase) * 2 // degrees

                // slow drift
                p.baseX += p.drift
                if (p.baseX > ocean.clientWidth + 80) p.baseX = -80

                // apply
                p.el.style.transform =
                    `translate(${p.baseX}px, ${y}px) rotate(${rot}deg)`
            })

            frame = requestAnimationFrame(loop)
        }

        loop()

        return () => cancelAnimationFrame(frame)
    }, [])

    return (
        <div
            ref={oceanRef}
            style={{
                width: '100vw',
                position: 'relative',
                overflowX: 'hidden',
                overflowY: 'scroll',
                background:
                    'linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%)'
            }}
        >
            <div className='h-[30vh] w-full relative flex justify-center items-center flex-col font-pirate'>
                <h1 className=' text-9xl font-bold'>Seacrets</h1>
                <p>Write your secrets and throw it in the global sea for others to read</p>
            </div>
            <div className='relative'>
                <svg
                    className="waves"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                    shapeRendering="auto"
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '50vh',
                        minHeight: '60px',
                        maxHeight: '180px',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}
                >
                    <defs>
                        <path
                            id="gentle-wave"
                            d="M-160 44c30 0 58-18 88-18s 58 18 88 18
             58-18 88-18 58 18 88 18 v44h-352z"
                        />
                    </defs>
                    <g className="parallax">
                        <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
                        <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                        <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                        <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
                    </g>
                </svg>
                <div className='h-[500vh] w-full bg-white'>

                </div>
            </div>
            {/* the CSS waves below */}

            <style jsx>{`
        .parallax > use {
          animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
        }
        .parallax > use:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 7s;
        }
        .parallax > use:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 10s;
        }
        .parallax > use:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 13s;
        }
        .parallax > use:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 20s;
        }
        @keyframes move-forever {
          0% {
            transform: translate3d(-90px,0,0);
          }
          100% {
            transform: translate3d(85px,0,0);
          }
        }
      `}</style>
        </div>
    )
}
