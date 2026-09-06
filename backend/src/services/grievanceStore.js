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
  return JSON.parse(contents)
}

export async function createGrievance(dataFile, input) {
  const grievances = await getGrievances(dataFile)
  const grievance = {
    ...input,
    referenceId: `VB-2026-${String(Date.now()).slice(-4)}`,
    status: 'Under Review',
    submittedAt: new Date().toISOString(),
  }
  await writeFile(dataFile, JSON.stringify([grievance, ...grievances], null, 2), 'utf8')
  return grievance
}
