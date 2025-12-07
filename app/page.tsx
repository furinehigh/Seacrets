'use client'

import OceanCanvas from "@/components/OceanCanvas";
import AncientWriterInput from "@/components/AncientWriterInput";
import { useEffect, useState } from "react";
import LetterModal from "@/components/LetterModal";

export type Bottle = {
  id: string;
  letter: string;
  createdAt: number;
}

export default function Home() {
  const [bottles, setBottles] = useState<Bottle[]>([])

  const [openedBottle, setOpenedBottle] = useState<Bottle | null>(null)
  const [isWriting, setIsWriting] = useState(false)

  useEffect(() => {
    (async () => {
      const res= await fetch('/api/letters')

      const items = await res.json()

      setBottles(items)
    })()
  }, [])

  const openBottle = (bottle: Bottle) => {
    // You can use your existing LetterModal here
    setOpenedBottle(bottle) 
  }

  const handleLetterSubmit = async (text: string) => {
    const newBottle: Bottle = {
      id: `b-${Date.now()}`,
      letter: text,
      createdAt: Date.now()
    }

    await fetch('/api/add-letter', {
      method: 'POST',
      body: JSON.stringify(newBottle)
    })

    setBottles(prev => [...prev, newBottle])
    setIsWriting(false) // Close the writer overlay
  }

  const closeLetterModal = () => {
    setOpenedBottle(null)
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

      {openedBottle && !isWriting && (
        <LetterModal text={openedBottle.letter} onClose={closeLetterModal} />
      )}
    </main>
  );
}