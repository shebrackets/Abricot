import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { API_URL, getToken } from '@/services/api'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          router.push('/login')
          return
        }
        const data = await res.json()
        setUser(data.data.user)
      } catch (err) {
        console.error(err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return { user, loading, logout, getToken }
}