'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howl } from 'howler'
import { X, MailOpen } from 'lucide-react'

// --- SOUND CONFIGURATION ---
const sounds = {
  pop: new Howl({ src: ['/sounds/cork.mp3'], volume: 0.6, rate: 1.5 }), // Higher pitch for "pop"
  paper: new Howl({ src: ['/sounds/paper-crunch.mp3'], volume: 0.5 }),
  splash: new Howl({ src: ['/sounds/splash.mp3'], volume: 0.4 }),
  magic: new Howl({ src: ['/sounds/scribble.mp3'], volume: 0.2, rate: 0.5 }) // Slow scribble for reveal
}

// --- ASSETS ---
const ASSETS = {
  paperTexture: "https://i.api.dishis.tech/i/iU71U8",
  closedPaper: "/closed-paper.webp"
}

interface LetterModalProps {
  text: string
  onClose: () => void
}

export default function LetterModal({ text, onClose }: LetterModalProps) {
  const [stage, setStage] = useState<'floating' | 'uncorking' | 'extracting' | 'reading'>('floating')

  useEffect(() => {
    sounds.splash.play()
  }, [])

  const openBottle = () => {
    if (stage !== 'floating') return

    // 1. Pop the cork
    sounds.pop.play()
    setStage('uncorking')

    setTimeout(() => {
      // 2. Slide paper out
      setStage('extracting')

      setTimeout(() => {
        // 3. Unroll and Read
        sounds.paper.play()
        setStage('reading')
      }, 1000)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center font-serif">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ruthie&display=swap');
        .font-handwriting { font-family: 'Ruthie', cursive; }
      `}</style>

      {/* BACKGROUND */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"
        onClick={onClose}
      />

      <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">

        {/* CLOSE BUTTON (Only visible when reading) */}
        {stage === 'reading' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors pointer-events-auto z-50"
          >
            <X size={40} />
          </motion.button>
        )}

        {/* CONTAINER FOR BOTTLE & SCROLL */}
        <div className="relative flex flex-col items-center justify-center">

          {/* --- THE BOTTLE --- */}
          <motion.div
            className="relative z-30"
            initial={{ y: 500, rotate: 45, opacity: 0 }}
            animate={
              stage === 'floating'
                ? { y: 0, rotate: 0, opacity: 1 } // Float up
                : stage === 'reading'
                  ? { y: 300, opacity: 0, scale: 0.8 } // Fade away when reading
                  : { y: 0, rotate: 0, opacity: 1 } // Stay still during extraction
            }
            transition={{
              type: "spring",
              damping: 20,
              duration: 1.5
            }}
          >
            <div className="relative w-48 h-[500px] pointer-events-auto cursor-pointer group" onClick={openBottle}>

              {/* "Click to Open" Hint */}
              {stage === 'floating' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, repeat: Infinity, repeatType: "reverse", duration: 1 }}
                  className="absolute -top-20 left-1/2 -translate-x-1/2 text-white/90 font-pirate text-3xl whitespace-nowrap flex flex-col items-center"
                >
                  <span>Click to open</span>
                </motion.div>
              )}

              {/* Glass SVG */}
              <svg viewBox="0 0 100 300" className="w-full h-full drop-shadow-2xl filter backdrop-blur-[2px]">
                <path
                  d="M30,0 L70,0 L70,60 Q95,80 95,150 L95,280 Q95,300 50,300 Q5,300 5,280 L5,150 Q5,80 30,60 Z"
                  fill="rgba(200, 230, 255, 0.1)"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="2"
                />
                {/* Reflections */}
                <path d="M15,150 L15,260" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
                <path d="M85,150 L85,260" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
              </svg>

              {/* The Cork */}
              <motion.div
                className="absolute -top-10 left-[37.5%] w-[32%]"
                initial={{ y: 15 }} // Started inserted
                animate={
                  stage === 'floating' ? { y: 15 }
                    : { y: -150, rotate: Math.random() * 40 - 20, opacity: 0 } // Pop out
                }
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="w-12 h-16 bg-[#5d4037] rounded-sm border-b-4 border-[#3e2723]"
                  style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)' }}></div>
              </motion.div>

              {/* Scroll Inside Bottle (Static State) */}
              <motion.div
                className="absolute top-[230px] left-[70px] w-[50px] h-[180px] rounded-sm blur-[1px]"
                style={{
                  backgroundImage: `url(${ASSETS.closedPaper})`,
                  backgroundSize: '100% 100%',
                }}
                animate={
                  stage === 'extracting' || stage === 'reading'
                    ? { opacity: 0 } // Hide when real scroll comes out
                    : { opacity: 1 }
                }
              />
            </div>
          </motion.div>

          {/* --- THE SCROLL ANIMATIONS --- */}

          {/* 1. Closed Scroll Moving Out */}
          {stage === 'extracting' && (
            <motion.div
              className="absolute z-20"
              style={{
                backgroundImage: `url(${ASSETS.closedPaper})`,
                backgroundSize: '100% 100%'
              }}
              initial={{ y: 80, width: 50, height: 180, opacity: 1 }} // Inside bottle pos
              animate={{ y: -100, width: 80, height: 250, opacity: 1 }} // Move Up
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}

          {/* 2. Open Scroll (Reading Mode) */}
          <AnimatePresence>
            {stage === 'reading' && (
              <motion.div
                key="reading-scroll"
                className="absolute z-40 pointer-events-auto"
                initial={{
                  width: 100,
                  height: 250,
                  scale: 0.5,
                  y: -50
                }}
                animate={{
                  width: 600,
                  height: 800,
                  scale: 1,
                  y: 0,
                  rotate: 0
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.17, 0.67, 0.83, 0.67] // Bezier for nice unfold
                }}
              >
                {/* Paper Background */}
                <div
                  className="relative w-full h-full"
                  style={{
                    backgroundImage: `url(${ASSETS.paperTexture})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Text Container */}
                  <motion.div
                    className="absolute inset-0 w-full h-full px-20 py-32 overflow-y-auto custom-scrollbar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                  >
                    <div className="font-handwriting font-bold text-4xl leading-relaxed text-[#3e2723] whitespace-pre-wrap break-words">
                      {text}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}