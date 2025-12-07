'use client'

import OceanCanvas from "@/components/OceanCanvas";
import AncientWriterInput from "@/components/AncientWriterInput";
import { useState } from "react";

export type Bottle = {
  id: string;
  letter: string;
  createdAt: number;
}

export default function Home() {
  const [bottles, setBottles] = useState<Bottle[]>([
    { id: 'b1', letter: 'The treasure lies beneath the coral arch.', createdAt: new Date('1720-01-01').getTime() },
    { id: 'b2', letter: 'I miss the sun.', createdAt: Date.now() },
    { id: 'b3', letter: 'Look to the east at dawn.', createdAt: Date.now() - 10000000 },
  ])

  const [openedBottle, setOpenedBottle] = useState<Bottle | null>(null)
  const [isWriting, setIsWriting] = useState(false)

  const openBottle = (bottle: Bottle) => {
    // You can use your existing LetterModal here
    alert(`Message from the deep: ${bottle.letter}`); 
    // setOpenedBottle(bottle) 
  }

  const handleLetterSubmit = (text: string) => {
    const newBottle: Bottle = {
      id: `b-${Date.now()}`,
      letter: text,
      createdAt: Date.now()
    }
    setBottles(prev => [...prev, newBottle])
    setIsWriting(false) // Close the writer overlay
  }

  return (
    <main>
      <OceanCanvas 
        bottles={bottles} 
        onBottleOpen={openBottle} 
        onStartWriting={() => setIsWriting(true)} 
      />

      {isWriting && (
        <AncientWriterInput 
            onSubmit={handleLetterSubmit} 
            onClose={() => setIsWriting(false)} 
        />
      )}
    </main>
  );
}