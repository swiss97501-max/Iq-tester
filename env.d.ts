// TypeScript declaration for process.env — ปรับตามตัวแปรที่โปรเจคต้องการ
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    DATABASE_URL: string
    JWT_SECRET?: string
    NEXT_PUBLIC_API_URL?: string
    // เพิ่มตัวแปรอื่นๆ ของโปรเจ���คุณที่นี่
  }
}
export {}