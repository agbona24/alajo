interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 animate-fade-in-up">
      <div className="text-6xl mb-4 opacity-50">{icon}</div>
      <p className="text-lg font-semibold text-gray-900 mb-2">{title}</p>
      {description && <p className="text-gray-600 mb-6">{description}</p>}

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
