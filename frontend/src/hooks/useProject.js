import { useState, useEffect } from 'react'
import { API_URL, getToken } from '@/services/api'

export default function useProject(id) {
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    const token = getToken()
    if (!token) return

    const fetchProject = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          fetch(`${API_URL}/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/projects/${id}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (!projectRes.ok) {
          setNotFound(true)
          return
        }

        const data = await projectRes.json()
        setProject(data.data.project)

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData.data.tasks || [])
        }
      } catch (err) {
        console.error(err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  return { project, setProject, tasks, setTasks, loading, notFound }
}