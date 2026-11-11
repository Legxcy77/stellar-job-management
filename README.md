# Stellar - Technical Job & Field Service Operations Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

ระบบบริหารจัดการงานช่างภาคสนาม (Field Service Operations), จัดสรรทีมช่าง, มอบหมายงาน, ติดตามความคืบหน้าแบบ Real-time, ระบบคลังพัสดุ/อุปกรณ์พร้อมระบบเบิกจ่าย, และการบันทึกประวัติกิจกรรมด้วย Audit Log ออกแบบสถาปัตยกรรมระดับองค์กรด้วย **Full-Stack Next.js 15 App Router** และ **Neon Serverless PostgreSQL**

---

##  Key Features (ฟีเจอร์หลัก)

### 1. Job & Task Management (ระบบจัดการงานซ่อมบำรุง)
- มอบหมายงานและแต่งตั้ง Lead Technician ประจำไซต์งาน
- กระจายงานตามแผนก: Electrical, Mechanical, Civil, Technical
- เช็คลิสต์ขั้นตอนการทำงาน (Sub-tasks) และรายงานสถานะ (Work Logs) พร้อมภาพ Before / After
- Digital Signature: ลงลายมือชื่อดิจิทัลรับรองการปิดงานผ่านหน้าเว็บ

### 2. Geolocation & Field Service Routing
- Interactive Map ด้วย Leaflet & OpenStreetMap ระบุพิกัดสถานที่ทำงาน
- คำนวณเส้นทางและนำทางทีมช่างไปยังจุดเกิดเหตุแบบแม่นยำ

### 3. Inventory & Spare Parts Control (คลังพัสดุและเบิกจ่าย)
- จัดการสต็อกพัสดุ/อะไหล่พร้อมระบบแจ้งเตือนเมื่อสินค้าใกล้หมด (Low Stock Warning)
- ระบบร้องขอเบิกอะไหล่ (Inventory Requests) พร้อม Flow การอนุมัติ (Pending / Approved / Rejected) โดยหัวหน้างาน

### 4. Multi-Department Incident Reports (ระบบแจ้งปัญหาข้ามแผนก)
- แจ้งปัญหา/แจ้งเหตุฉุกเฉิน (Bug, Incident, Feature Request)
- รองรับงานที่ต้องประสานงานข้ามหลายแผนก (Multi-department resolution & forward tracking)

### 5. Security, Roles & Audit Logging
- Role-based Access Control (Admin, Manager, Lead Technician, Employee) ผ่าน NextAuth
- ระบบ Audit Log บันทึกทุกความเปลี่ยนแปลงในระบบ (Who, When, What changed) เพื่อความโปร่งใส

---

## Architecture & Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts, Signature Pad
- **Backend**: Next.js API Routes (Serverless Functions), Zod Validation, NextAuth.js
- **Database**: PostgreSQL บน **Neon Cloud**
  - **Connection Pooling**: ผ่าน PgBouncer (`@neondatabase/serverless`) เพื่อประสิทธิภาพสูงสุดใน Serverless runtime
  - **ORM**: Prisma v6 พร้อม `@prisma/adapter-neon`
- **State Management**: Zustand
- **Documentation**: Swagger / OpenAPI integration (`/api-doc`)

---

## Getting Started (การติดตั้งและรันในเครื่อง)

### 1. Clone repository
```bash
git clone https://github.com/Legxcy77/tech-job-ts.git
cd tech-job-ts
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ตามตัวอย่างใน `.env.example`:
```env
DATABASE_URL="postgresql://<user>:<password>@<neon-host>-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://<user>:<password>@<neon-host>.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. เตรียมฐานข้อมูลและสร้างข้อมูลทดสอบ (Seed)
```bash
npx prisma generate
npm run seed
```

### 5. รันโปรเจกต์
```bash
# โหมดพัฒนา (Development)
npm run dev

# หรือ Build และรันโหมด Production
npm run build
npm run start
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

---

## Developer & Maintainer
- **Pawalit (Legxcy77)** - *Lead Full-Stack Developer & Architecture Maintainer*
  - GitHub: [@Legxcy77](https://github.com/Legxcy77)
