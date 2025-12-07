'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howl } from 'howler'
import { X } from 'lucide-react'

// --- SOUND CONFIGURATION ---
const sounds = {
    scribble: new Howl({ src: ['/sounds/scribble.mp3'], volume: 0.4, rate: 1.2 }),
    paper: new Howl({ src: ['/sounds/paper-crunch.mp3'], volume: 0.5 }),
    cork: new Howl({ src: ['/sounds/cork.mp3'], volume: 0.6 }),
    splash: new Howl({ src: ['/sounds/splash.mp3'], volume: 0.6 })
}

// --- ASSETS ---
const ASSETS = {
    paperTexture: "https://i.api.dishis.tech/i/iU71U8",
    quillImage: "/quill.png",
    bottleTexture: "rgba(255, 255, 255, 0.2)",
    closedPaper: "/closed-paper.webp"
}

export default function AncientBottleMessage({ onSubmit, onClose }: { onSubmit: (text: string) => void, onClose: () => void }) {
    const [text, setText] = useState('')
    const [stage, setStage] = useState<'writing' | 'rolling' | 'bottling' | 'corking' | 'dropping' | 'done'>('writing')
    const [quillPos, setQuillPos] = useState({ x: 0, y: 0 })

    // Refs for tracking text position
    const textContainerRef = useRef<HTMLDivElement>(null)
    const mirrorRef = useRef<HTMLDivElement>(null)
    const endMarkerRef = useRef<HTMLSpanElement>(null)

    // --- QUILL TRACKING LOGIC ---
    useEffect(() => {
        const updateQuillPosition = () => {
            if (endMarkerRef.current && textContainerRef.current) {
                const markerRect = endMarkerRef.current.getBoundingClientRect()
                const containerRect = textContainerRef.current.getBoundingClientRect()

                setQuillPos({
                    x: markerRect.left - containerRect.left,
                    y: markerRect.top - containerRect.top
                })
            }
        }

        const t = setTimeout(updateQuillPosition, 10)
        window.addEventListener('resize', updateQuillPosition)
        return () => {
            clearTimeout(t)
            window.removeEventListener('resize', updateQuillPosition)
        }
    }, [text, stage])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value
        setText(newVal)

        if (newVal.length > text.length) {
            const id = sounds.scribble.play()
            sounds.scribble.rate(0.9 + Math.random() * 0.4, id)
        }
    }

    // --- ANIMATION SEQUENCE ---
    const startSequence = () => {
        if (!text.trim()) return

        // 1. Roll the paper
        sounds.paper.play()
        setStage('rolling')

        setTimeout(() => {
            // 2. Put in bottle
            setStage('bottling')

            setTimeout(() => {
                // 3. Cork the bottle
                sounds.cork.play()
                setStage('corking')

                setTimeout(() => {
                    // 4. Drop into ocean
                    setStage('dropping')

                    setTimeout(() => {
                        // 5. Splash and Finish
                        sounds.splash.play()
                        setTimeout(() => {
                            onSubmit(text)
                        }, 1500)
                    }, 600)
                }, 800)
            }, 1500)
        }, 1500)
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
            <div className="relative w-full h-full flex flex-col items-center justify-center">

                <AnimatePresence mode="wait">

                    {/* --- STAGE 1: WRITING --- */}
                    {stage === 'writing' && (
                        <motion.div
                            key="writing-stage"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.5 } }}
                            className="relative w-[600px] h-[850px]"
                        >
                            <button onClick={onClose} className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors">
                                <X size={32} />
                            </button>

                            <div
                                ref={textContainerRef}
                                className="relative w-full h-full"
                                style={{
                                    backgroundImage: `url(${ASSETS.paperTexture})`,
                                    backgroundSize: '100% 100%',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                <textarea
                                    value={text}
                                    onChange={handleChange}
                                    className="absolute inset-0 w-full h-full px-20 py-36 text-transparent bg-transparent z-10 resize-none outline-none font-handwriting text-4xl leading-relaxed caret-transparent"
                                    spellCheck={false}
                                    autoFocus
                                />

                                <div className="absolute inset-0 w-full h-full px-20 py-36 z-0 whitespace-pre-wrap break-words font-handwriting text-4xl font-semibold leading-relaxed text-[#3e2723]">
                                    {text}
                                </div>

                                <div
                                    ref={mirrorRef}
                                    className="absolute inset-0 w-full h-full px-13 py-8 -z-10 whitespace-pre-wrap break-words font-handwriting text-4xl leading-relaxed opacity-0 pointer-events-none"
                                >
                                    {text}<span ref={endMarkerRef}>|</span>
                                </div>

                                <motion.div
                                    className="absolute z-20 pointer-events-none origin-bottom-left"
                                    animate={{
                                        x: quillPos.x + 40,
                                        y: quillPos.y + 40,
                                    }}
                                    transition={{ type: "tween", ease: "linear", duration: 0.05 }}
                                >
                                    <motion.img
                                        src={ASSETS.quillImage}
                                        alt="Quill"
                                        className="w-32 h-auto drop-shadow-2xl"
                                        style={{ transform: 'translate(0, -100%) rotate(15deg)' }}
                                        animate={{
                                            rotate: [15, 12, 15],
                                            y: [0, -5, 0]
                                        }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    />
                                </motion.div>
                            </div>

                            {text.length > 0 && (
                                <motion.button
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    onClick={startSequence}
                                    className="fixed bottom-24 left-1/2 -translate-x-1/2 px-8 py-3 bg-[#4a3022] text-[#e0c9a6] font-pirate text-3xl rounded border-2 border-[#8d6e63] shadow-xl hover:scale-105 transition-transform z-50"
                                >
                                    Seal & Cast Away
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    {/* --- STAGE 2-5: ANIMATION --- */}
                    {(stage !== 'writing') && (
                        <div className="relative w-full h-full flex flex-col items-center justify-center perspective-[1000px]">

                            <AnimatePresence>
                                {stage !== 'dropping' && (
                                    <>
                                        {/* 1. The Open Paper Squeezes and Fades Out */}
                                        <motion.div
                                            key="open-scroll-transition"
                                            className="absolute z-20 bg-transparent"
                                            style={{
                                                backgroundImage: `url(${ASSETS.paperTexture})`,
                                                backgroundSize: '100% 100%'
                                            }}
                                            initial={{ width: 600, height: 850, opacity: 1 }}
                                            animate={
                                                stage === 'rolling'
                                                    ? {
                                                        height: 400, // Squeeze effect
                                                        width: 500,
                                                        opacity: 0,
                                                        scale: 0.8
                                                    }
                                                    : { opacity: 0 } // Stay hidden in later stages
                                            }
                                            transition={{ duration: 0.8, ease: "easeInOut" }}
                                        />

                                        {/* 2. The Closed Scroll Appears and Moves into Bottle */}
                                        <motion.div
                                            key="closed-scroll-transition"
                                            className="absolute z-20 bg-transparent"
                                            style={{
                                                backgroundImage: `url(${ASSETS.closedPaper})`,
                                                backgroundSize: '100% 100%'
                                            }}
                                            initial={{ width: 100, height: 250, opacity: 0, scale: 0.5 }}
                                            animate={
                                                stage === 'rolling'
                                                    ? {
                                                        opacity: 1,
                                                        scale: 1.2, // Show nicely in center
                                                        y: 0
                                                    }
                                                    : (stage === 'bottling' || stage === 'corking')
                                                        ? {
                                                            // Match dimensions of the static scroll inside bottle
                                                            width: 50,
                                                            height: 180,
                                                            opacity: 1,
                                                            scale: 1,
                                                            y: 80, // Move down into bottle
                                                            rotate: 0
                                                        }
                                                        : {}
                                            }
                                            transition={{
                                                duration: stage === 'rolling' ? 0.8 : 1.2,
                                                delay: stage === 'rolling' ? 0.4 : 0, // Wait for squeeze before appearing
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </>
                                )}
                            </AnimatePresence>

                            {/* THE BOTTLE */}
                            <motion.div
                                className="relative z-30"
                                initial={{ opacity: 0, scale: 0.8, y: 200 }}
                                animate={
                                    stage === 'rolling'
                                        ? { opacity: 0 }
                                        : stage === 'bottling' || stage === 'corking'
                                            ? { opacity: 1, scale: 1, y: 0 }
                                            : stage === 'dropping'
                                                ? { y: 800, rotate: -45, opacity: 1 }
                                                : {}
                                }
                                transition={{ duration: 1 }}
                            >
                                <div className="relative w-48 h-[500px]">
                                    {/* Glass SVG */}
                                    <svg viewBox="0 0 100 300" className="w-full h-full drop-shadow-2xl filter backdrop-blur-[2px]">
                                        <path
                                            d="M30,0 L70,0 L70,60 Q95,80 95,150 L95,280 Q95,300 50,300 Q5,300 5,280 L5,150 Q5,80 30,60 Z"
                                            fill="rgba(200, 230, 255, 0.1)"
                                            stroke="rgba(255, 255, 255, 0.4)"
                                            strokeWidth="2"
                                        />
                                        <path d="M15,150 L15,260" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />
                                        <path d="M85,150 L85,260" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
                                    </svg>

                                    {/* Scroll Inside Bottle (Shown when dropping to ensure it stays with bottle) */}
                                    {stage === 'dropping' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute top-[230px] left-[70px] w-[50px] h-[180px] rounded-sm blur-[2px]"
                                            style={{
                                                backgroundImage: `url(${ASSETS.closedPaper})`,
                                                backgroundSize: '100% 100%',
                                            }}
                                        />
                                    )}

                                    {/* The Cork */}
                                    <motion.div
                                        className="absolute -top-10 left-[37%] w-[32%]"
                                        initial={{ y: -100, opacity: 0 }}
                                        animate={
                                            stage === 'corking' || stage === 'dropping'
                                                ? { y: 15, opacity: 1 }
                                                : { y: -100, opacity: 0 }
                                        }
                                        transition={{ type: 'spring', bounce: 0.3 }}
                                    >
                                        <div className="w-12 h-16 bg-[#5d4037] rounded-sm border-b-4 border-[#3e2723]"
                                            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)' }}></div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* SPLASH */}
                            {stage === 'dropping' && (
                                <motion.div
                                    className="absolute bottom-0 w-full flex justify-center items-end pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.5 } }}
                                >
                                    <div className="w-[300px] h-[100px] bg-blue-500/30 blur-xl rounded-full scale-y-50"></div>
                                </motion.div>
                            )}

                        </div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}