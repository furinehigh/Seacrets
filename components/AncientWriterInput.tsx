'use client'

import {Howl} from 'howler'
import { useState } from 'react'

const scribble = new Howl({src: ['/scribble2.mp3'], volume: .15})

export default function AncientWriterInput({onSubmit}: any) {
    const [value, setValue] = useState('')
    const [shown, setShown] = useState('')

    const type = (e: any) => {
        const v = e.target.value

        const char = v[v.length - 1]
        setValue(v)

        setShown(s => s + char)

        scribble.play()
    }

    return (
        <div className='bg-[#F6E7C9] border-[#7A5C3D] border-2 p-6 h-[50vh] rounded-xl overflow-auto font-pirate text-lg relative'>
            <p>{shown}</p>
            <textarea name="letter" id="letter" value={value} onChange={type} 
                className='absolute inset-0 opacity-0 pointer-events-none'
            />
            <button 
                onClick={() => onSubmit(value)}
                className='absolute bottom-4 right-4 bg-[#7A5C3D] text-white px-4 py-2 rounded'
            >
                Send
            </button>
        </div>
    )
}