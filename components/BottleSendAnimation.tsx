'use client'

import { useEffect } from "react"
import {Howl} from 'howler'
import gsap from "gsap"


const cork = new Howl({src: ['/cork.mp3'], volume: .45})

export default function BottleSendAnimation({bottleSprite, onDone}: any) {
    useEffect(() => {
        cork.play()

        gsap.to(bottleSprite, {
            y: bottleSprite.y + 80,
            duration: .6,
            ease: 'back.in(2)',
            onComplete: () => {
                gsap.to(bottleSprite, {
                    y: bottleSprite.y + 600,
                    duration: 1.5,
                    ease: 'power2.in',
                    onComplete: onDone
                })
            }
        })
    }, [])

    return null

    
}