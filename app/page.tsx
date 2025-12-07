'use client'

import OceanCanvas from "@/components/OceanCanvas";
import AncientWriterInput from "@/components/AncientWriterInput";
import { Suspense, useEffect, useState } from "react";
import LetterModal from "@/components/LetterModal";
import { useSearchParams } from "next/navigation";

export type Bottle = {
  id: string;
  letter: string;
  createdAt: number;
}

function Home() {
  const search = useSearchParams()
  const seacretId = search.get('seacretId')
  const [bottles, setBottles] = useState<Bottle[]>([])

  const [openedBottle, setOpenedBottle] = useState<Bottle | null>(null)
  const [isWriting, setIsWriting] = useState(false)

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/letters')

      const items = await res.json()

      setBottles(items)
    })()
  }, [])

  useEffect(() => {
    if (seacretId || seacretId !== '') {
      openBottle(bottles?.filter(b => b.id == seacretId)[0])
    }
  }, [seacretId])

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
    setBottles(prev => [...prev, newBottle])
    setIsWriting(false) // Close the writer overlay

    await fetch('/api/add-letter', {
      method: 'POST',
      body: JSON.stringify(newBottle)
    })

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
        <LetterModal text={openedBottle.letter} onClose={closeLetterModal} id={openedBottle.id} />
      )}
    </main>
  );
}

export default function AppHome(){
  return (
    <Suspense>
      <Home />
    </Suspense>
  )
}