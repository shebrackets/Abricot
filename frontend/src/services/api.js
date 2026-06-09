export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const getToken = () => localStorage.getItem('token')

export const removeToken = () => localStorage.removeItem('token')