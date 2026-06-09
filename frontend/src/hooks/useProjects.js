import { useState, useEffect } from 'react'
import { API_URL, getToken } from '@/services/api'

export default function useProjects(user) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (res.ok) {
          const data = await res.json()
          setProjects(data.data.projects || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  return { projects, loading }
}