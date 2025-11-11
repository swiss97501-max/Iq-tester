// src/utils/env.ts
// ตัวช่วยอ่านและตรวจสอบ env vars แบบ fail-fast
// ถ้าอยากให้ .env ถูกโหลดในเครื่อง dev ให้ติดตั้ง dotenv (dev dependency)
// npm i -D dotenv
// แต่การโหลด dotenv ถูกห่อด้วย try/catch เพื่อไม่ให้ล้มใน environment ที่ไม่มีแพ็กเกจนี้

if (process.env.NODE_ENV !== 'production') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config()
  } catch {
    // dotenv ไม่จำเป็นต้องมีบน production runner
  }
}

type EnvKey = keyof NodeJS.ProcessEnv

export function getEnv(name: EnvKey): string {
  const val = process.env[name]
  if (val === undefined || val === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return val
}

export function getOptionalEnv(name: EnvKey, fallback?: string): string | undefined {
  const val = process.env[name]
  if (val === undefined || val === '') return fallback
  return val
}

// ตัวอย่างการใช้งานในโปรเจค (ปรับให้ตรงกับของคุณ)
export const DATABASE_URL = getEnv('DATABASE_URL')
// รหัสลับ JWT: ในเครื่อง dev อาจมี fallback แต่ห้ามใช้ fallback ใน production
export const JWT_SECRET = process.env.JWT_SECRET ?? (process.env.NODE_ENV === 'production' ? getEnv('JWT_SECRET') : 'dev-secret')
export const NEXT_PUBLIC_API_URL = getOptionalEnv('NEXT_PUBLIC_API_URL')
