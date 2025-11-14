import { useState } from 'react'
import { AxiosError } from 'axios'

interface APIState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useAPI<T = any>() {
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = async (apiCall: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null })

    try {
      const data = await apiCall()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const axiosError = error as AxiosError<any>
      const errorMessage = axiosError.response?.data?.message ||
                          axiosError.response?.data?.error ||
                          'Something went wrong. Please try again.'

      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }

  const reset = () => {
    setState({ data: null, loading: false, error: null })
  }

  return { ...state, execute, reset }
}

export default useAPI
