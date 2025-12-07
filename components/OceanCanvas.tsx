'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Feather } from 'lucide-react'
import { Howl } from 'howler' // <--- IMPORT HOWLER
import { Bottle as BottleType } from '@/app/page'

// ... (Keep VisualBottle type definitions) ...
type VisualBottle = BottleType & {
  yOffset: number
  scale: number
  sandLevel: number
  isSinking: boolean
  glassColor: string
  scrollColor: string
  speed: number
  direction: 'left' | 'right'
  startDelay: number
  rotationStrength: number
}

// ... (Keep useSound hook for short SFX like bubbles/clicks - it's fine for those) ...
const useSound = (src: string, volume: number = 0.5) => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
  
    useEffect(() => {
      audioRef.current = new Audio(src)
      audioRef.current.volume = volume
    }, [src, volume])
  
    const play = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
    }, [])
  
    return play
}

// ... (Keep Bubbles, Fish, Seaweed, and Bottle components exactly as they were) ...
const Bubbles = ({ isHovered }: { isHovered: boolean }) => (
    <AnimatePresence>
      {isHovered &&
        [...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, x: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              y: -50 - Math.random() * 40,
              x: (Math.random() - 0.5) * 30,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              top: -5,
              left: '50%',
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              borderRadius: '50%',
              background: 'rgba(100, 116, 139, 0.5)',
              pointerEvents: 'none',
              zIndex: 100,
            }}
          />
        ))}
    </AnimatePresence>
)

const Fish = () => {
  const depth = Math.random() * 3000 + 500
  const duration = 20 + Math.random() * 30
  const delay = Math.random() * -50
  const isRight = Math.random() > 0.5 

  return (
    <motion.div
      className="absolute pointer-events-none opacity-60"
      style={{ top: depth, zIndex: 15 }}
      initial={{ x: isRight ? '-20vw' : '120vw' }}
      animate={{ x: isRight ? '120vw' : '-20vw' }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      <svg 
        width="60" height="30" viewBox="0 0 60 30" 
        style={{ transform: isRight ? 'scaleX(1)' : 'scaleX(-1)' }}
      >
        <path d="M55,15 Q40,0 20,5 Q0,10 0,15 Q0,20 20,25 Q40,30 55,15 Z M55,15 L60,5 M55,15 L60,25" fill="#475569" />
        <circle cx="45" cy="12" r="1.5" fill="white" />
        <path d="M40,15 Q35,15 32,18" stroke="rgba(0,0,0,0.2)" fill="none" />
      </svg>
    </motion.div>
  )
}

const Seaweed = ({ side, depth, scale }: { side: 'left' | 'right', depth: number, scale: number }) => {
  return (
    <div 
      className="absolute pointer-events-none opacity-50 z-10"
      style={{ 
        left: side === 'left' ? 0 : 'auto', 
        right: side === 'right' ? 0 : 'auto', 
        top: depth, 
        transform: `scale(${scale}) ${side === 'right' ? 'scaleX(-1)' : ''}`, 
        filter: 'blur(0.5px)'
      }}
    >
      <svg width="100" height="300" viewBox="0 0 100 300" style={{ overflow: 'visible' }}>
        <path d="M-20,280 Q10,260 50,280 T100,300 L-20,300 Z" fill="#334155" />
        <path 
          d="M20,280 Q-10,200 20,150 T20,0" 
          fill="none" 
          stroke={depth > 2000 ? "#1e293b" : "#334155"} 
          strokeWidth="12" 
          strokeLinecap="round"
          className="sway-plant"
        />
        <path 
           d="M40,290 Q60,220 30,140 T50,20" 
           fill="none" 
           stroke={depth > 2000 ? "#334155" : "#475569"} 
           strokeWidth="8" 
           strokeLinecap="round"
           className="sway-plant-delayed"
        />
      </svg>
    </div>
  )
}

const Bottle = ({ data, onClick, playBubble }: { data: VisualBottle; onClick: () => void, playBubble: () => void }) => {
    const [isHovered, setIsHovered] = useState(false)
  
    const xVariant = {
      animate: {
        x: data.direction === 'right' ? ['-20vw', '120vw'] : ['120vw', '-20vw'],
        transition: {
          duration: data.speed,
          repeat: Infinity,
          ease: "linear",
          delay: data.startDelay
        }
      }
    }
  
    const physicsVariant = {
      animate: {
        y: data.isSinking ? [0, -30, 0, 30, 0] : [0, -15, 0], 
        rotate: [
          data.rotationStrength, 
          data.rotationStrength + (data.isSinking ? 15 : 5), 
          data.rotationStrength
        ],
        transition: {
          duration: data.isSinking ? 10 : 3 + Math.random(),
          repeat: Infinity,
          ease: "easeInOut",
        }
      }
    }
  
    const handleHover = () => {
      setIsHovered(true)
      if(Math.random() > 0.5) playBubble()
    }
  
    return (
      <motion.div
        style={{
          position: 'absolute',
          top: `${data.yOffset}px`,
          width: `${60 * data.scale}px`,
          height: `${140 * data.scale}px`,
          zIndex: data.isSinking ? 20 : 50,
        }}
        variants={xVariant}
        animate="animate"
      >
        <motion.div
          className="w-full h-full cursor-pointer group relative"
          variants={physicsVariant}
          animate="animate"
          whileHover={{ transition: { duration: 0.3 } }}
          onHoverStart={handleHover}
          onHoverEnd={() => setIsHovered(false)}
          onClick={onClick}
        >
          <Bubbles isHovered={isHovered} />
  
          <svg viewBox="0 0 80 200" className="w-full h-full drop-shadow-md" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id={`scrollGrad-${data.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={data.scrollColor} stopOpacity="0.9" />
                <stop offset="30%" stopColor="#fff" stopOpacity="0.8" />
                <stop offset="60%" stopColor={data.scrollColor} stopOpacity="1" />
                <stop offset="100%" stopColor={data.scrollColor} stopOpacity="0.7" />
              </linearGradient>
  
              <linearGradient id={`glassGrad-${data.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor={data.glassColor} />
              </linearGradient>
            </defs>
  
            <path
              d="M20,0 L60,0 L60,50 Q75,60 75,100 L75,180 Q75,200 40,200 Q5,200 5,180 L5,100 Q5,60 20,50 Z"
              fill="rgba(0,0,0,0.05)"
              stroke="#4b5563"
              strokeWidth="1.5"
            />
  
            {data.sandLevel > 0 && (
              <path
                d={`M6,${198 - data.sandLevel * 50} 
                   Q40,${190 - data.sandLevel * 50} 74,${198 - data.sandLevel * 50} 
                   L74,180 Q74,198 40,198 Q6,198 6,180 Z`}
                fill="#d4b483"
                stroke="none"
              />
            )}
  
            <g transform={`translate(25, ${120 - (data.sandLevel * 30)}) rotate(${data.isSinking ? 20 : -5})`}>
               <rect x="0" y="0" width="30" height="70" rx="2" fill={`url(#scrollGrad-${data.id})`} />
               <line x1="5" y1="10" x2="25" y2="10" stroke="#78350f" strokeWidth="1" opacity="0.3" />
               <line x1="5" y1="20" x2="20" y2="20" stroke="#78350f" strokeWidth="1" opacity="0.3" />
               <circle cx="15" cy="35" r="5" fill="#991b1b" /> 
               <rect x="0" y="32" width="30" height="6" fill="#991b1b" opacity="0.5" />
            </g>
  
            <path
              d="M20,0 L60,0 L60,50 Q75,60 75,100 L75,180 Q75,200 40,200 Q5,200 5,180 L5,100 Q5,60 20,50 Z"
              fill={`url(#glassGrad-${data.id})`}
              className="pointer-events-none"
              style={{ mixBlendMode: 'multiply' }}
            />
            
            <path d="M65,70 L65,170" stroke="rgba(255,255,255,0.8)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
            <path d="M15,70 L15,100" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
  
            <rect x="26" y="-6" width="28" height="24" rx="2" fill="#5c4033" stroke="#3e2723" strokeWidth="1" />
          </svg>
        </motion.div>
      </motion.div>
    )
}

// --- Main Canvas ---
export default function OceanCanvas({ bottles, onBottleOpen, onStartWriting }: { bottles: BottleType[], onBottleOpen: (b: BottleType) => void, onStartWriting?: () => void }) {
  const { scrollY } = useScroll()
  const waveContainerY = useTransform(scrollY, [0, 1000], [0, -300]) 
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0])
  
  const [visualBottles, setVisualBottles] = useState<VisualBottle[]>([])
  const [isMuted, setIsMuted] = useState(true)
  
  // --- UPDATED MUSIC REFERENCE ---
  const bgMusicRef = useRef<Howl | null>(null)
  
  const playBubble = useSound('/sounds/bubble.mp3', 0.2)
  const playClick = useSound('/sounds/letter-open.mp3', 0.6)

  // --- UPDATED TOGGLE MUTE LOGIC ---
  const toggleMute = () => {
    setIsMuted(!isMuted)
    
    // Initialize sound if it doesn't exist
    if (!bgMusicRef.current) {
        bgMusicRef.current = new Howl({
            src: ['/sounds/ocean.wav'],
            loop: true,
            volume: 0.1,
            // html5: false is default and important for gapless looping
        })
    }

    if (isMuted) {
         // User is Unmuting
         bgMusicRef.current.play()
         bgMusicRef.current.fade(0, 0.1, 1500) // Smooth fade in
    } else {
         // User is Muting
         bgMusicRef.current.fade(0.1, 0, 500) // Smooth fade out
         setTimeout(() => {
             bgMusicRef.current?.pause()
         }, 500)
    }
  }

  // --- CLEANUP ON UNMOUNT ---
  useEffect(() => {
      return () => {
          if (bgMusicRef.current) {
              bgMusicRef.current.unload()
          }
      }
  }, [])

  useEffect(() => {
    const oceanDepth = Math.max(2000, bottles.length * 150) 
    const processed = bottles.map((b) => {
      const isSinking = Math.random() > 0.6
      const direction = Math.random() > 0.5 ? 'right' : 'left'
      const speed = isSinking ? 60 + Math.random() * 60 : 25 + Math.random() * 20
      const yOffset = isSinking 
        ? 150 + Math.random() * (oceanDepth - 200) 
        : -30 + Math.random() * 60 

      return {
        ...b,
        yOffset,
        scale: 0.7 + Math.random() * 0.4,
        sandLevel: isSinking ? 0.2 + Math.random() * 0.5 : 0,
        isSinking,
        glassColor: isSinking ? 'rgba(50, 60, 70, 0.2)' : 'rgba(100, 200, 200, 0.1)',
        scrollColor: '#fef3c7',
        speed,
        direction,
        startDelay: Math.random() * -100,
        rotationStrength: (Math.random() * 30) - 15
      }
    })
    setVisualBottles(processed)
  }, [bottles])

  return (
    <div className="relative w-full bg-gradient-to-b from-blue-200 via-blue-400 to-gray-400 overflow-hidden font-pirate" 
         style={{ height: '330vh' }}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Berkshire+Swash&display=swap');
        .font-pirate { font-family: 'Berkshire Swash', serif; }
        .sway-plant { animation: sway 5s ease-in-out infinite alternate; transform-origin: bottom center; }
        .sway-plant-delayed { animation: sway 7s ease-in-out infinite alternate -2s; transform-origin: bottom center; }
        @keyframes sway { 0% { transform: rotate(-5deg); } 100% { transform: rotate(5deg); } }
      `}</style>

      {/* --- UI Controls --- */}
      <div className="fixed top-8 right-8 z-50 flex gap-4">
        <button 
          onClick={toggleMute}
          className="bg-white/80 p-3 rounded-full hover:bg-white shadow-lg backdrop-blur-sm transition-all text-slate-700"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <motion.div 
        style={{ opacity: titleOpacity }}
        className="fixed top-20 left-0 w-full text-center z-10 pointer-events-none"
      >
        <h1 className="text-7xl md:text-9xl text-gray-800 opacity-90 tracking-tighter drop-shadow-sm">Seacrets</h1>
        <p className="text-gray-700 text-xl md:text-2xl mt-4">Drifting through the pale waters</p>
      </motion.div>

      {/* --- Write Button --- */}
      <motion.button
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] group cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { playClick(); if(onStartWriting) onStartWriting(); }}
      >
        <div className="relative flex items-center justify-center w-64 h-16">
          <div className="absolute inset-0 bg-[#fef3c7] rounded-sm shadow-xl border-2 border-[#b45309] transform skew-x-[-10deg] group-hover:skew-x-[-5deg] transition-all duration-300">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50"></div>
          </div>
          <div className="relative flex items-center gap-3 text-[#78350f] font-bold text-xl z-10">
             <Feather className="w-6 h-6 animate-pulse" />
             <span>Write a Seacret</span>
          </div>
        </div>
      </motion.button>

      {/* --- Ocean Layer --- */}
      <motion.div style={{ y: waveContainerY }} className="relative w-full z-20 mt-[35vh]">
        <div className="absolute top-0 left-0 w-full h-[4000px] pointer-events-none z-50">
          <div className="relative w-full h-full pointer-events-auto">
            
            {visualBottles.map((b) => (
              <Bottle key={b.id} data={b} onClick={() => { playClick(); onBottleOpen(b); }} playBubble={playBubble} />
            ))}

            {Array.from({length: 12}).map((_, i) => <Fish key={i} />)}

            {Array.from({length: 8}).map((_, i) => (
              <>
                 <Seaweed key={`l-${i}`} side="left" depth={800 + (i * 400)} scale={0.8 + Math.random()} />
                 <Seaweed key={`r-${i}`} side="right" depth={1000 + (i * 400)} scale={0.8 + Math.random()} />
              </>
            ))}
          </div>
        </div>

        <svg className="waves w-full h-[150px]" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255, 255, 255, 0.7)" /> 
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(229, 231, 235, 0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(209, 213, 219, 0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#f3f4f6" /> 
          </g>
        </svg>

        <div className="w-full h-[4000px] bg-gradient-to-b from-gray-100 to-gray-400 relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>
      </motion.div>

      <style jsx>{`
        .parallax > use { animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite; }
        .parallax > use:nth-child(1) { animation-delay: -2s; animation-duration: 7s; }
        .parallax > use:nth-child(2) { animation-delay: -3s; animation-duration: 10s; }
        .parallax > use:nth-child(3) { animation-delay: -4s; animation-duration: 13s; }
        .parallax > use:nth-child(4) { animation-delay: -5s; animation-duration: 20s; }
        @keyframes move-forever {
          0% { transform: translate3d(-90px,0,0); }
          100% { transform: translate3d(85px,0,0); }
        }
      `}</style>
    </div>
  )
}