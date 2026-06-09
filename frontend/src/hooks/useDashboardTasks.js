import { useState, useEffect } from 'react'
import { API_URL, getToken } from '@/services/api'

export default function useDashboardTasks(user) {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (!user) return
    const token = getToken()

    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/assigned-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setTasks(data.data.tasks || [])
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchTasks()
  }, [user])

  return { tasks }
}