'use client'

import {Howl} from 'howler'
import { useEffect, useState } from 'react'

const scribble = new Howl({src: ['/scribble.mp3'], volume: .25})

export default function AncientTextWriter({text}: {text: string}) {
    const [shown, setShown] = useState('')

    useEffect(() => {
        let i = 0
        const loop = () => {
            if (i< text.length) {
                setShown(s => s + text[i])
                scribble.play()
                i++
                setTimeout(loop, 40 + Math.random() * 50)
            }
        }
        loop()


    }, [text])

    return (
        <p className='font-pirate whitespace-pre-wrap text-[22px] leading-8'>
            {shown}
        </p>
    )
}