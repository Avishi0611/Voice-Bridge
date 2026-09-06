import crypto from 'node:crypto'
import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

let database

function getDatabase(databaseFile) {
  if (!database) {
    fs.mkdirSync(path.dirname(databaseFile), { recursive: true })
    database = new Database(databaseFile)
    database.pragma('journal_mode = WAL')
    database.exec(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_type TEXT NOT NULL,
        name TEXT NOT NULL,
        mobile TEXT,
        department TEXT,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS registrations_email_idx ON registrations(email);
      CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations(created_at);
    `)
  }
  return database
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, storedHash) {
  const [salt, expectedHash] = storedHash.split(':')
  const actualHash = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(actualHash, 'hex'), Buffer.from(expectedHash, 'hex'))
}

export function createRegistration(databaseFile, input) {
  const db = getDatabase(databaseFile)
  const createdAt = new Date().toISOString()
  const result = db.prepare(`
    INSERT INTO registrations (account_type, name, mobile, department, email, password_hash, created_at)
    VALUES (@accountType, @name, @mobile, @department, @email, @passwordHash, @createdAt)
  `).run({
    accountType: input.accountType,
    name: input.name.trim(),
    mobile: input.mobile?.trim() || null,
    department: input.department?.trim() || null,
    email: input.email.trim().toLowerCase(),
    passwordHash: hashPassword(input.password),
    createdAt,
  })

  return {
    id: result.lastInsertRowid,
    accountType: input.accountType,
    name: input.name.trim(),
    mobile: input.mobile?.trim() || null,
    department: input.department?.trim() || null,
    email: input.email.trim().toLowerCase(),
    createdAt,
  }
}

export function getRegistrations(databaseFile) {
  const db = getDatabase(databaseFile)
  return db.prepare(`
    SELECT id, account_type AS accountType, name, mobile, department, email, created_at AS createdAt
    FROM registrations ORDER BY created_at DESC
  `).all()
}

export function authenticateRegistration(databaseFile, email, password) {
  const db = getDatabase(databaseFile)
  const registration = db.prepare('SELECT * FROM registrations WHERE email = ? ORDER BY created_at DESC LIMIT 1').get(email.trim().toLowerCase())
  if (!registration || !verifyPassword(password, registration.password_hash)) return null

  return {
    id: registration.id,
    accountType: registration.account_type,
    name: registration.name,
    mobile: registration.mobile,
    department: registration.department,
    email: registration.email,
    createdAt: registration.created_at,
  }
}
