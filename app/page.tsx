'use client'

import AncientWriterInput from "@/components/AncientWriterInput";
import LetterModal from "@/components/LetterModal";
import OceanCanvas from "@/components/OceanCanvas";
import { X } from "lucide-react";
import { useState } from "react";

type Bottle =  {
  id: string;
  letter: string;
}

export default function Home() {
  const [bottles, setBottles] = useState<Bottle[]>([
    {
      id: 'b1',
      letter: 'Test message 1'
    },
    {
      id: 'b2',
      letter: 'Test message 2'
    }
  ])

  const [openedBottle, setOpenedBottle] = useState<Bottle | null>(null)
  const [writerVisible, setWriterVisible] = useState(false)

  const openBottle = (bottle: Bottle) => {
    setOpenedBottle(bottle)
  }

  const closeModal = () => {
    setOpenedBottle(null)
    setWriterVisible(false)
  }


  const startWriting = () => {
    setWriterVisible(true)
  }


  const submitLetter = (value: string) => {
    const newBottle: Bottle = {
      id: 'b' + Date.now(),
      letter: value
    }

    setBottles(prev => [...prev, newBottle])

    setWriterVisible(false)

    setOpenedBottle(null)
  }
  return (
    <main className="w-full h-screen flex flex-col">
      <OceanCanvas bottles={bottles} onBottleOpen={openBottle} />

    </main>
  );
}
