import type React from "react"
import { CreditCard, Lock, Pin, StickyNote } from "lucide-react"

interface EmptyStateProps {
  activeTab: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ activeTab }) => {
  const icons = {
    passwords: Lock,
    notes: StickyNote,
    pins: Pin,
    cards: CreditCard,
  }

  const Icon = icons[activeTab as keyof typeof icons] || Lock

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
      <div className="rounded-xl bg-gray-100 p-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">No {activeTab} Selected</h3>
        <p className="text-sm text-gray-500">Select an entry to view its details</p>
      </div>
    </div>
  )
}

