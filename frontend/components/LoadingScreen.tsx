export default function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-5xl">💰</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        <div className="text-lg font-semibold text-gray-900 mb-2">{message}</div>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto animate-pulse"></div>
      </div>
    </div>
  )
}
