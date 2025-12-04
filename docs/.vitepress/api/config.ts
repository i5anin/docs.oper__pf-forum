// src/shared/api/config.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
} from 'axios'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8002/api',
  // baseURL: 'http://api.pfforum/api',
  timeout: 15000,
  withCredentials: false,
})

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
    if (axiosError.response) {
      return `HTTP ${axiosError.response.status}`
    }
    if (axiosError.request) {
      return 'Сервер недоступен'
    }
    return axiosError.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Неизвестная ошибка'
}

export function handleResponse<T>(response: AxiosResponse<T>): T {
  return response.data
}

export function handleApiError(error: unknown): never {
  const message = extractErrorMessage(error)
  throw new Error(message)
}
