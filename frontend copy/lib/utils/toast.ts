// Simple toast notification utility
// For production, consider using react-hot-toast or sonner

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  duration?: number
  position?: 'top' | 'bottom'
}

class Toast {
  private container: HTMLDivElement | null = null

  private getContainer() {
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.className = 'fixed top-4 right-4 z-50 space-y-2'
      document.body.appendChild(this.container)
    }
    return this.container
  }

  private show(message: string, type: ToastType, options: ToastOptions = {}) {
    const { duration = 3000, position = 'top' } = options

    const toast = document.createElement('div')
    toast.className = `
      flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
      transform transition-all duration-300 ease-out
      ${type === 'success' ? 'bg-green-500 text-white' : ''}
      ${type === 'error' ? 'bg-red-500 text-white' : ''}
      ${type === 'info' ? 'bg-blue-500 text-white' : ''}
      ${type === 'warning' ? 'bg-orange-500 text-white' : ''}
      animate-slide-in-right
    `

    const icon = {
      success: '✓',
      error: '✗',
      info: 'ℹ',
      warning: '⚠',
    }[type]

    toast.innerHTML = `
      <span class="text-xl">${icon}</span>
      <span class="font-semibold">${message}</span>
    `

    const container = this.getContainer()
    if (position === 'bottom') {
      container.className = 'fixed bottom-4 right-4 z-50 space-y-2'
    }

    container.appendChild(toast)

    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1'
      toast.style.transform = 'translateX(0)'
    }, 10)

    // Remove after duration
    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transform = 'translateX(100%)'
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, duration)
  }

  success(message: string, options?: ToastOptions) {
    this.show(message, 'success', options)
  }

  error(message: string, options?: ToastOptions) {
    this.show(message, 'error', options)
  }

  info(message: string, options?: ToastOptions) {
    this.show(message, 'info', options)
  }

  warning(message: string, options?: ToastOptions) {
    this.show(message, 'warning', options)
  }
}

export const toast = new Toast()
