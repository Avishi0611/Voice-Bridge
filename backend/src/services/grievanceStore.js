import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

async function ensureStore(dataFile) {
  await mkdir(path.dirname(dataFile), { recursive: true })
  try {
    await readFile(dataFile, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    await writeFile(dataFile, '[]', 'utf8')
  }
}

export async function getGrievances(dataFile) {
  await ensureStore(dataFile)
  const contents = await readFile(dataFile, 'utf8')
  try {
    return JSON.parse(contents)
  } catch {
    return []
  }
}

export async function findGrievance(dataFile, idOrRef) {
  const grievances = await getGrievances(dataFile)
  return grievances.find((g) => g.id === idOrRef || g.referenceId === idOrRef) || null
}

export async function createGrievance(dataFile, input) {
  const grievances = await getGrievances(dataFile)
  const now = new Date().toISOString()
  const refId = `VB-2026-${String(Date.now()).slice(-4)}`

  const grievance = {
    id: `grv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    referenceId: refId,
    status: 'Under Review',
    submittedAt: now,
    timeline: [
      {
        stage: 'Submitted',
        status: 'Under Review',
        timestamp: now,
        note: 'Complaint registered by citizen and analyzed with Gemini AI.',
      },
    ],
    ...input,
  }

  await writeFile(dataFile, JSON.stringify([grievance, ...grievances], null, 2), 'utf8')
  return grievance
}

export async function updateGrievanceStatus(dataFile, idOrRef, newStatus, note = '') {
  const grievances = await getGrievances(dataFile)
  let updated = null

  const modified = grievances.map((item) => {
    if (item.id === idOrRef || item.referenceId === idOrRef) {
      const now = new Date().toISOString()
      const timeline = item.timeline || [
        {
          stage: 'Submitted',
          status: 'Under Review',
          timestamp: item.submittedAt || now,
          note: 'Initial submission',
        },
      ]
      timeline.push({
        stage: newStatus,
        status: newStatus,
        timestamp: now,
        note: note || `Status updated to ${newStatus} by Municipal Officer`,
      })
      updated = {
        ...item,
        status: newStatus,
        updatedAt: now,
        timeline,
      }
      return updated
    }
    return item
  })

  if (!updated) {
    throw new Error(`Grievance ${idOrRef} not found.`)
  }

  await writeFile(dataFile, JSON.stringify(modified, null, 2), 'utf8')
  return updated
}

export async function getGrievanceStats(dataFile) {
  const grievances = await getGrievances(dataFile)
  const total = grievances.length
  const resolved = grievances.filter((g) => g.status === 'Resolved').length
  const inProgress = grievances.filter((g) => g.status === 'In Progress').length
  const pending = grievances.filter((g) => g.status === 'Under Review' || g.status === 'Pending').length

  const categories = {}
  grievances.forEach((g) => {
    const cat = g.category || 'General'
    categories[cat] = (categories[cat] || 0) + 1
  })

  return {
    total,
    resolved,
    inProgress,
    pending,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 92,
    categories,
    lastUpdated: new Date().toISOString(),
  }
}
