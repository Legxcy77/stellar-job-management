# ระบบบริหารจัดการงานช่างภาคสนามและคลังอุปกรณ์ <br> (Stellar Job Management System)

แพลตฟอร์มบริหารจัดการงานบริการนอกสถานที่ การจัดสรรงานช่าง และระบบควบคุมคลังวัสดุระดับองค์กร

[English Version](README.md)

---

## ภาพรวมของระบบ (Executive Summary)

Stellar Job Management เป็นแพลตฟอร์มวิศวกรรมซอฟต์แวร์เต็มรูปแบบ (Full-Stack) ที่ออกแบบมาเพื่อรองรับองค์กรผู้ให้บริการด้านเทคนิค ผู้รับเหมางานซ่อมบำรุง และทีมช่างภาคสนาม โดยระบบทำหน้าที่รวมศูนย์การจ่ายงาน (Work Order Dispatching), การคำนวณเส้นทางและพิกัดงานผ่านระบบภูมิสารสนเทศ (GIS Routing), การยืนยันส่งมอบงานด้วยลายเซ็นดิจิทัล (Digital Proof-of-Work) ตลอดจนการควบคุมและเบิกจ่ายอะไหล่ในคลังสินค้าอย่างแม่นยำ

ระบบถูกพัฒนาขึ้นเพื่อขจัดปัญหาคอขวดในการปฏิบัติงานจริง เช่น ความล่าช้าจากการประสานงานผ่านกระดาษ การเบิกใช้วัสดุโดยไม่ได้รับการอนุมัติ และความไม่สอดคล้องกันของข้อมูลการส่งมอบงาน โดยใช้กระบวนการบันทึกสถานะตามลำดับและสร้างเอกสารดิจิทัลแบบอัตโนมัติ

---

## สถาปัตยกรรมระบบ (System Architecture)

ระบบเลือกใช้โครงสร้างสถาปัตยกรรมแบบ Modular Full-Stack บนพื้นฐานของ Next.js 15 App Router ร่วมกับการจัดการ State แบบแยกส่วน (Decoupled) และฐานข้อมูลเชิงสัมพันธ์บน Cloud

```text
[ ส่วนประสานงานผู้ใช้ (Client Layer) ]
    │
    ├── ส่วนต่อประสานเว็บ (Next.js 15, React 19, TypeScript)
    ├── การจัดการ State และ Cache (Zustand ร่วมกับ Immer, TanStack Query v5)
    └── คอมโพเนนต์ UI (Radix UI, Tailwind CSS, Recharts)
    │
[ ประตูทางเข้าและการกำหนดเส้นทาง (Gateway & Routing) ]
    │
    ├── ระบบตรวจสอบสิทธิ์ Middleware (NextAuth.js, JWT Dual-Token)
    └── Route Handlers (/api/jobs, /api/inventory, /api/reports, /api/audit-logs)
    │
[ เซอร์วิสหลักของระบบ (Core Engine Services) ]
    │
    ├── กลไกวงจรสถานะงาน (Job State Machine: Pending -> Assigned -> In Progress -> Completed)
    ├── บริการแผนที่และกำหนดเส้นทาง (Leaflet, Leaflet Routing Machine, Marker Clustering)
    ├── กลไกการสร้างเอกสารและรายงาน PDF (jsPDF ร่วมกับฟอนต์ภาษาไทย THSarabunNew)
    └── ระบบประมวลผลลายเซ็นดิจิทัล (HTML5 Canvas Vector Capture)
    │
[ ชั้นการจัดเก็บข้อมูล (Persistence Layer) ]
    │
    ├── Prisma ORM (ชั้นการเข้าถึงข้อมูลแบบ Type-Safe)
    ├── ฐานข้อมูล PostgreSQL (Neon Serverless Cloud Database / SQLite สำหรับ Local Dev)
    └── ระบบบันทึกประวัติการทำงาน (Transactional Audit Logging)
```

---

## คุณสมบัติหลักของระบบ (Core Capabilities)

### 1. การบริหารวงจรงานช่างและการจ่ายงาน (Job Lifecycle & Dispatch Management)
- สเตทแมชชีนควบคุมการเปลี่ยนสถานะของใบสั่งงานอย่างรัดกุม ตั้งแต่ `pending` (รอดำเนินการ), `assigned` (มอบหมายแล้ว), `in_progress` (กำลังปฏิบัติงาน) จนถึง `completed` (เสร็จสมบูรณ์)
- การจัดลำดับความสำคัญตามระดับความเร่งด่วน (`low`, `medium`, `high`, `urgent`) พร้อมระบบติดตามระยะเวลามาตรฐาน (SLA)
- การแบ่งแยกงานตามสายงานวิศวกรรม ได้แก่ แผนกไฟฟ้า (Electrical), เครื่องกล (Mechanical), โยธา (Civil) และเทคนิคสารสนเทศ (Technical)

### 2. การปฏิบัติการภาคสนามผ่านระบบแผนที่ (Geospatial Field Operations)
- แผนที่ตอบสนองความเร็วสูงด้วย Leaflet ร่วมกับข้อมูล OpenStreetMap
- ระบบจำลองการนำทางและคำนวณเส้นทางเดินทางของช่างแบบหลายจุดแวะ (Multi-stop Dispatch) ผ่าน Leaflet Routing Machine
- การรวมกลุ่มหมุดพิกัดหนาแน่น (Marker Clustering) เพื่อคงประสิทธิภาพการประมวลผลของเบราว์เซอร์ที่ 60 FPS
- เครื่องมือปักหมุดพิกัดตำแหน่งไซต์งานจริง สำหรับงานที่อยู่นอกเขตเลขที่อาคาร

### 3. การควบคุมคลังพัสดุและอะไหล่ (Material & Inventory Governance)
- ระบบบัญชีคลังสินค้าที่ตัดยอดสต็อกสัมพันธ์กับรหัสใบสั่งงานโดยตรง
- ขั้นตอนการเบิกจ่ายอะไหล่แบบกำหนดสิทธิ์อนุมัติ (Material Request Approval Workflow) ก่อนทำการตัดลดยอดคงเหลือจริง
- ระบบจำแนกหมวดหมู่วัสดุ ตำแหน่งจัดเก็บในคลัง และการแจ้งเตือนจุดสั่งซื้อซ้ำ (Reorder Point)

### 4. การยืนยันงานดิจิทัลและการสร้างเอกสารรายงาน (Digital Verification & Document Synthesis)
- กล่องรับลายเซ็นดิจิทัลบนเบราว์เซอร์ แปลงข้อมูลการวาดเส้นจากระบบสัมผัสหรือปากกาให้เป็นชุดข้อมูล Vector (Base64) ที่ไม่สูญเสียความละเอียด
- กระบวนการสร้างเอกสาร PDF จากฝั่งไคลเอนต์โดยใช้ `jsPDF` ร่วมกับการฝังชุดแบบอักษรภาษาไทยมาตรฐาน (`THSarabunNew`) เพื่อป้องกันปัญหาตัวอักษรผิดเพี้ยน
- การออกใบจ่ายงาน ใบส่งมอบงานที่ได้รับการลงนาม และรายงานสรุปการเบิกจ่ายวัสดุในรูปแบบ PDF และ CSV อัตโนมัติ

### 5. การควบคุมสิทธิ์การเข้าถึงและการตรวจสอบย้อนหลัง (Access Control & Governance)
- ระบบจัดการสิทธิ์ตามบทบาท (Role-Based Access Control - RBAC) แบ่งออกเป็น 4 ระดับ:
  - `Admin`: ผู้ดูแลระบบ มีสิทธิ์กำหนดค่าระบบทั้งหมด จัดการบัญชีผู้ใช้ และส่งออกรายงานเชิงสถิติ
  - `Manager`: ผู้จัดการแผนก มีสิทธิ์มอบหมายงาน ตรวจสอบตารางงานช่าง และอนุมัติคำขอเบิกวัสดุ
  - `Lead Technician`: หัวหน้าทีมช่าง มีสิทธิ์ควบคุมทีมภาคสนาม บันทึกผลการปฏิบัติงาน และลงนามตรวจรับงาน
  - `Employee`: ช่างเทคนิค มีสิทธิ์ตรวจสอบงานที่ได้รับมอบหมาย ปรับปรุงสถานะงาน และสร้างคำขอเบิกอะไหล่
- บันทึกการเปลี่ยนแปลง (Audit Log Pipeline) ที่เก็บประวัติการทำธุรกรรมของทุกคำขอ ระบุผู้กระทำ เวลา และทรัพยากรที่ถูกแก้ไขอย่างโปร่งใส

---

## เทคโนโลยีที่เลือกใช้ (Technology Stack)

| ส่วนของระบบ | เทคโนโลยี | รายละเอียดการนำไปใช้งาน |
| :--- | :--- | :--- |
| Framework | Next.js 15.0+ | สถาปัตยกรรม App Router, Server Actions และ Route Handlers |
| ภาษาที่ใช้ | TypeScript 5.0+ | กำหนดโหมด Type-Checking แบบ Strict ครอบคลุมทั้งโปรเจกต์ |
| ตัวจัดการฐานข้อมูล | Prisma Client | Type-Safe Database Client สำหรับ Query และ Migration |
| ฐานข้อมูลหลัก | PostgreSQL / SQLite | Neon Cloud Serverless Postgres (Production) / SQLite (Development) |
| ตัวจัดการ State | Zustand ร่วมกับ Immer | แยก Store ตามขอบเขตการทำงาน (Domain-Partitioned) พร้อมการจัดการ State แบบ Immutable |
| การจัดการ Server State | TanStack Query v5 | ระบบแคชข้อมูลจาก API และจัดการดึงข้อมูลใหม่อัตโนมัติในเบื้องหลัง |
| ระบบแผนที่ | Leaflet | เรนเดอร์แผนที่ เลเยอร์เส้นทาง และการจัดกลุ่มหมุดพิกัด |
| ระบบฟอร์มและการตรวจสอบ | React Hook Form & Zod | ตรวจสอบความถูกต้องของข้อมูล (Validation) ตาม Schema ทั้งหน้าบ้านและ API |
| ตารางจัดการข้อมูล | TanStack Table v8 | ตารางแสดงผลรองรับการแบ่งหน้า การเรียงลำดับ และการกรองข้อมูลแบบ Virtualized |
| เครื่องมือสร้างเอกสาร | jsPDF & Autotable | สร้างรายงานและใบงาน PDF จากเวกเตอร์พร้อมฝังฟอนต์ภาษาไทย |
| ระบบตกแต่งรูปแบบ | Tailwind CSS | Utility-First CSS Framework |

---

## โครงสร้างโปรเจกต์ (Project Structure)

```text
stellar-job-management/
├── prisma/
│   ├── schema.prisma           # โครงสร้างตารางและความสัมพันธ์ของฐานข้อมูล
│   ├── seed.ts                 # สคริปต์จำลองข้อมูลตั้งต้นสำหรับการทดสอบ
│   └── migrations/             # ประวัติการปรับปรุงฐานข้อมูล
├── public/                     # ไฟล์ภาพ สัญลักษณ์ และเนื้อหา Static
├── src/
│   ├── app/                    # รูทของ Next.js App Router
│   │   ├── (auth)/             # เส้นทางระบบยืนยันตัวตน (Login, Register)
│   │   ├── api/                # จุดรับส่งข้อมูล REST API (Jobs, Inventory, Reports, Audit)
│   │   ├── api-doc/            # หน้าแสดงเอกสาร OpenAPI / Swagger UI
│   │   └── dashboard/          # หน้าการทำงานหลักของผู้ใช้และฝ่ายบริหาร
│   ├── components/
│   │   ├── admin/              # คอมโพเนนต์จัดการผู้ใช้และสิทธิ์
│   │   ├── export/             # คอมโพเนนต์ส่งออกรายงาน PDF และ CSV
│   │   ├── forms/              # ฟอร์มบันทึกข้อมูล (JobForm, InventoryForm)
│   │   ├── global/             # คอมโพเนนต์ส่วนกลาง (DataTable, Modal, Toast)
│   │   ├── map/                # คอมโพเนนต์แผนที่และการคำนวณเส้นทาง
│   │   ├── signature/          # กล่องรับลายเซ็นดิจิทัล
│   │   └── ui/                 # คอมโพเนนต์พื้นฐานที่พัฒนาต่อจาก Radix UI
│   ├── lib/
│   │   ├── auth.ts             # เครื่องมือจัดการสิทธิ์และสร้าง Token
│   │   ├── prisma.ts           # การเชื่อมต่อ Prisma Client ระดับ Global
│   │   ├── fonts/              # ไฟล์ฟอนต์ไบนารีภาษาไทยสำหรับ jsPDF
│   │   ├── mocks/              # ชุดข้อมูลจำลองสำหรับโหมดออฟไลน์
│   │   └── validations/        # Schema ตรวจสอบความถูกต้องของข้อมูลด้วย Zod
│   └── stores/                 # Zustand Global Stores (Jobs, Inventory, UI)
├── .env.example                # แม่แบบการกำหนดค่าตัวแปรสภาพแวดล้อม
├── package.json                # ข้อมูลรายการแพ็กเกจและสคริปต์
└── tsconfig.json               # การกำหนดค่า TypeScript Compiler
```

---

## ขั้นตอนการติดตั้งและเริ่มต้นใช้งาน (Getting Started)

### สิ่งที่จำเป็นต้องมี (Prerequisites)
- Node.js เวอร์ชัน 20.0.0 ขึ้นไป
- ตัวจัดการแพ็กเกจ npm หรือ pnpm
- ฐานข้อมูล PostgreSQL (หรือใช้ SQLite สำหรับโหมด Local)

### การกำหนดตัวแปรสภาพแวดล้อม (Environment Configuration)
สร้างไฟล์ `.env` ที่โฟลเดอร์รากของโปรเจกต์โดยอ้างอิงจาก `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-secure-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### การติดตั้งแพ็กเกจและการเตรียมฐานข้อมูล

```bash
# ติดตั้ง dependencies ทั้งหมด
pnpm install

# ซิงค์โครงสร้างตารางเข้าสู่ฐานข้อมูล
npx prisma db push

# รันสคริปต์สร้างข้อมูลจำลองตั้งต้น
pnpm run seed
```

### การเริ่มรันโปรเจกต์สำหรับ Development

```bash
# รัน Development Server
pnpm run dev
```

เข้าใช้งานระบบผ่านเบราว์เซอร์ที่ `http://localhost:3000`  
และสามารถดูเอกสารจำลอง API (Swagger UI) ได้ที่ `http://localhost:3000/api-doc`

---

## มาตรฐานและคุณภาพของระบบ (Quality Assurance & Standards)

- **เอกสารกำกับ API (API Documentation)**: เอกสาร OpenAPI Specification ผ่าน Swagger UI ที่เส้นทาง `/api-doc`
- **ความปลอดภัยของประเภทข้อมูล (Type Safety)**: ควบคุมการใช้ Type อย่างเคร่งครัด ไร้การระบุ `any` ในโมเดลข้อมูลหลัก
- **การปฏิบัติตามข้อกำหนดการตรวจสอบ (Audit Compliance)**: ทุกคำขอที่มีการแก้ไขข้อมูลจะถูกบันทึกประวัติการทำรายการอย่างเป็นทางการ
