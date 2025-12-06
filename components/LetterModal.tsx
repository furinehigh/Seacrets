'use client'

import { X } from "lucide-react"
import AncientTextWriter from "./AncientTextWriter"





export default function LetterModal({bottle, onClose}: any) {
    if (!bottle) return null


    return(
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
            <div className="bg-[#F6E7C9] border-4 border-[#7A5C3D] shadow-xl p-6 rounded-xl w-[70vw] h-[70vh] overflow-auto font-ancient relative">
                <AncientTextWriter text={bottle.letter} />
                <button onClick={onClose} className="absolute top-4 right-4"><X /></button>
            </div>
        </div>
    )
}