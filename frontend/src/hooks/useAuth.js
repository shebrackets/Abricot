import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { API_URL } from '@/services/api'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
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
  }, [router])

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const getToken = () => localStorage.getItem('token')

  return { user, loading, logout, getToken }
}