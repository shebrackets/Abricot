import { Mistral } from '@mistralai/mistralai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' })
  }

  const { projectName, projectDescription } = req.body

  if (!projectName) {
    return res.status(400).json({ message: 'Nom du projet requis' })
  }

  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) {
    return res.status(500).json({ message: 'Clé API Mistral non configurée' })
  }

  const client = new Mistral({ apiKey })

  const prompt = `Tu es un assistant de gestion de projet. Génère une liste de 5 tâches concrètes et actionables pour le projet suivant.

Projet : ${projectName}
${projectDescription ? `Description : ${projectDescription}` : ''}

Réponds uniquement avec un objet JSON au format suivant, sans texte avant ou après :
{
  "tasks": [
    { "title": "Titre de la tâche", "description": "Description courte et concrète" }
  ]
}`

  try {
    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      responseFormat: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    const parsed = JSON.parse(content)

    if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
      return res.status(500).json({ message: 'Format de réponse invalide' })
    }

    return res.status(200).json({ tasks: parsed.tasks })
  } catch (err) {
    console.error('Erreur Mistral:', err)
    return res.status(500).json({ message: 'Erreur lors de la génération des tâches' })
  }
}
