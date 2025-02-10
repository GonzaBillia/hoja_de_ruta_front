// FloatingActionButton.tsx
'use client'
import { Button } from '@/components/ui/button'
import {  QrCode } from 'lucide-react'

export default function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-4 z-50">
      <Button
        variant="default"
        className="rounded-xl w-full mx-auto px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Escanear"
      >
        <QrCode className="h-8 w-8" />
      </Button>
    </div>
  )
}
