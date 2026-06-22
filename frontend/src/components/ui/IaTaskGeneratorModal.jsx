import { useState, useEffect } from 'react'
import { API_URL, getToken } from '@/services/api'
import styles from './IaTaskGeneratorModal.module.scss'

export default function IaTaskGeneratorModal({ project, onClose, onTasksCreated }) {
  const [step, setStep] = useState('prompt')
  const [userPrompt, setUserPrompt] = useState('')
  const [tasks, setTasks] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setStep('prompt')
    setUserPrompt('')
    setTasks([])
    setError('')
    onClose()
  }

  const handleGenerate = async () => {
    if (!userPrompt.trim()) {
      setError('Veuillez décrire votre besoin avant de générer.')
      return
    }
    setIsGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/ai/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.name,
          projectDescription: project.description,
          userPrompt: userPrompt.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la génération des tâches')
      if (!data.tasks || data.tasks.length === 0) throw new Error("Aucune tâche n'a pu être générée")
      setTasks(data.tasks.map((t, i) => ({ ...t, _id: Date.now() + i })))
      setStep('review')
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la génération')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTitleChange = (id, value) =>
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, title: value } : t)))

  const handleDescriptionChange = (id, value) =>
    setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, description: value } : t)))

  const handleDeleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t._id !== id))

  const handleAddTask = () =>
    setTasks((prev) => [...prev, { _id: Date.now(), title: '', description: '' }])

  const handleConfirm = async () => {
    if (tasks.length === 0) { setError('Ajoutez au moins une tâche avant de confirmer.'); return }
    const emptyTitles = tasks.filter((t) => !t.title.trim())
    if (emptyTitles.length > 0) { setError('Toutes les tâches doivent avoir un titre.'); return }
    setIsSaving(true)
    setError('')
    try {
      const created = []
      for (const task of tasks) {
        const res = await fetch(`${API_URL}/api/projects/${project.id}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            title: task.title.trim(),
            description: task.description?.trim() || '',
            status: 'TODO',
            dueDate: null,
            assigneeIds: [],
          }),
        })
        const data = await res.json()
        if (res.ok && data.data?.task) created.push(data.data.task)
      }
      onTasksCreated(created)
      handleClose()
    } catch (err) {
      setError("Erreur lors de l'ajout des tâches au projet.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => { setStep('prompt'); setError('') }

  return (
    <div
      className={styles.overlay}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ia-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 id="ia-modal-title" className={styles.title}>
            {step === 'prompt' ? "Générer des tâches avec l'IA" : 'Relire et modifier les tâches'}
          </h2>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Fermer">✕</button>
        </div>

        <div className={styles.body}>

          {step === 'prompt' && (
            <>
              <p className={styles.description}>
                Décrivez ce que vous souhaitez accomplir dans ce projet.
                L'IA générera 5 tâches concrètes à partir de votre description.
              </p>

              <div className={styles.field}>
                <label htmlFor="ia-prompt" className={styles.label}>Votre besoin *</label>
                <textarea
                  id="ia-prompt"
                  className={styles.textarea}
                  value={userPrompt}
                  onChange={(e) => { setUserPrompt(e.target.value); if (error) setError('') }}
                  placeholder="Ex : Je veux mettre en place un système d'authentification sécurisé avec inscription, connexion et réinitialisation de mot de passe."
                  rows={5}
                />
              </div>

              <div className={styles.projectContext}>
                <strong>Contexte projet : </strong>
                {project.name}{project.description && ` — ${project.description}`}
              </div>

              {error && <p role="alert" className={styles.error}>{error}</p>}

              <div className={styles.footer}>
                <div />
                <div className={styles.footerRight}>
                  <button className={styles.btnSecondary} onClick={handleClose}>Annuler</button>
                  <button
                    className={styles.btnPrimary}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    aria-busy={isGenerating}
                  >
                    {isGenerating ? 'Génération en cours...' : 'Générer les tâches'}
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 'review' && (
            <>
              <p className={styles.taskCount}>
                {tasks.length} tâche{tasks.length > 1 ? 's' : ''} générée{tasks.length > 1 ? 's' : ''}.
                Modifiez, supprimez ou ajoutez des tâches avant de les intégrer au projet.
              </p>

              <div className={styles.taskList}>
                {tasks.map((task, index) => (
                  <div key={task._id} className={styles.taskItem}>
                    <div className={styles.taskItemHeader}>
                      <span className={styles.taskIndex}>Tâche {index + 1}</span>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteTask(task._id)}
                        aria-label={`Supprimer la tâche ${index + 1}`}
                      >
                        Supprimer
                      </button>
                    </div>
                    <div className={styles.taskFields}>
                      <input
                        type="text"
                        className={styles.input}
                        value={task.title}
                        onChange={(e) => handleTitleChange(task._id, e.target.value)}
                        placeholder="Titre de la tâche *"
                        aria-label={`Titre de la tâche ${index + 1}`}
                      />
                      <textarea
                        className={styles.textarea}
                        style={{ minHeight: '60px' }}
                        value={task.description}
                        onChange={(e) => handleDescriptionChange(task._id, e.target.value)}
                        placeholder="Description (optionnelle)"
                        aria-label={`Description de la tâche ${index + 1}`}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.addTaskBtn} onClick={handleAddTask}>
                + Ajouter une tâche
              </button>

              {error && <p role="alert" className={styles.error}>{error}</p>}

              <div className={styles.footer}>
                <button className={styles.btnSecondary} onClick={handleBack}>← Modifier le prompt</button>
                <div className={styles.footerRight}>
                  <button className={styles.btnSecondary} onClick={handleClose}>Annuler</button>
                  <button
                    className={styles.btnSuccess}
                    onClick={handleConfirm}
                    disabled={isSaving || tasks.length === 0}
                    aria-busy={isSaving}
                  >
                    {isSaving
                      ? 'Ajout en cours...'
                      : `✓ Ajouter ${tasks.length} tâche${tasks.length > 1 ? 's' : ''} au projet`}
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}