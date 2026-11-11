# Stellar Job Management System
Enterprise Field Operations, Service Dispatch, and Material Control Platform

[ภาษาไทย (Thai Version)](README.th.md)

## Executive Summary

Stellar Job Management is a full-stack engineering platform designed for technical service organizations, maintenance contractors, and field service teams. The system centralizes work order dispatching, GPS route optimization, digital proof-of-work, and spare parts inventory tracking into a unified, high-concurrency architecture.

The platform addresses core operational bottlenecks in service businesses: eliminating paper-based task coordination, preventing unauthorized material withdrawals, and standardizing task verification through digital signatures and dynamic document generation.

---

## System Architecture

The application adopts a modular full-stack architecture built on Next.js 15 App Router, decoupled state management, and cloud-native relational databases.

```text
[ Client Layer ]
    │
    ├── Web Interface (Next.js 15, React 19, TypeScript)
    ├── State & Cache (Zustand with Immer, TanStack Query v5)
    └── UI Components (Radix UI, Tailwind CSS, Recharts)
    │
[ Gateway & Routing ]
    │
    ├── Middleware Authentication Guard (NextAuth.js, JWT Dual-Token)
    └── Route Handlers (/api/jobs, /api/inventory, /api/reports, /api/audit-logs)
    │
[ Core Engine Services ]
    │
    ├── Job Dispatch & State Machine (Pending -> Assigned -> In Progress -> Completed)
    ├── GIS & Routing Service (Leaflet, Leaflet Routing Machine, Marker Clustering)
    ├── Document & PDF Synthesis Engine (jsPDF with Embedded THSarabunNew Font)
    └── Digital Signature Processor (HTML5 Canvas Vector Capture)
    │
[ Persistence Layer ]
    │
    ├── Prisma ORM (Type-Safe Query Layer)
    ├── PostgreSQL (Neon Serverless Cloud Database / SQLite Local Mode)
    └── Audit Logging Pipeline (Transactional Action Logs)
```

---

## Core Capabilities

### 1. Job Lifecycle and Dispatch Management
- Deterministic state transition engine handling work order lifecycles: `pending`, `assigned`, `in_progress`, and `completed`.
- Priority-driven scheduling (`low`, `medium`, `high`, `urgent`) with SLA tracking.
- Departmental segmentation covering Electrical, Mechanical, Civil, and Information Technology domains.

### 2. Geospatial Field Operations
- Interactive map interface leveraging Leaflet and OpenStreetMap.
- Real-time technician route plotting and multi-stop dispatch calculations using Leaflet Routing Machine.
- High-density site clustering through Leaflet MarkerCluster to maintain 60 FPS rendering performance.
- Visual coordinate picker for dispatchers creating work orders at unaddressed locations.

### 3. Material and Inventory Governance
- Automated stock ledger tracking item withdrawals linked directly to job order IDs.
- Multi-tier material request workflow requiring administrative approval prior to stock balance deductions.
- Category filtering, warehouse location tracking, and reorder threshold alerting.

### 4. Digital Verification and Document Synthesis
- Browser-based signature capture pad converting touch/stylus input into lossless base64 vector records.
- Client-side PDF generation pipeline using `jsPDF` configured with embedded Thai typography (`THSarabunNew`), eliminating character encoding corruption.
- Automated generation of dispatch slips, work completion certificates, and material requisition reports.

### 5. Access Control and Governance
- Role-Based Access Control (RBAC) enforced across four administrative tiers:
  - `Admin`: Full system configuration, user provisioning, and financial exports.
  - `Manager`: Departmental job assignment, schedule oversight, and inventory approvals.
  - `Lead Technician`: Field team supervision, work logging, and job sign-offs.
  - `Employee`: Assigned task execution, status updates, and supply requests.
- Transactional audit log pipeline recording system mutations with actor ID, timestamp, and target resource.

---

## Technology Stack

| Domain | Technology | Implementation Detail |
| :--- | :--- | :--- |
| Framework | Next.js 15.0+ | App Router, Server Actions, Route Handlers |
| Language | TypeScript 5.0+ | Strict type checking enabled |
| Database ORM | Prisma Client | Type-safe schema migrations and relational queries |
| Primary Database | PostgreSQL / SQLite | Neon Cloud Serverless Postgres (Production) / SQLite (Development) |
| State Management | Zustand & Immer | Domain-partitioned stores with immutable state mutations |
| Server State | TanStack Query v5 | Automatic background refetching and mutation caching |
| Geospatial | Leaflet | Client-side map rendering with custom marker overlays |
| Form & Validation | React Hook Form & Zod | Strict schema validation across frontend and API layers |
| Data Presentation | TanStack Table v8 | Virtualized pagination, multi-column sorting, and filtering |
| Document Engine | jsPDF & Autotable | Programmatic vector PDF compilation with custom fonts |
| Styling | Tailwind CSS | Utility-first responsive design system |

---

## Project Structure

```text
stellar-job-management/
├── prisma/
│   ├── schema.prisma           # Data schema definitions and relational constraints
│   ├── seed.ts                 # Database seeding script for development and testing
│   └── migrations/             # Incremental database migration history
├── public/                     # Static assets, logos, and public icons
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── (auth)/             # Authentication routes (login, registration)
│   │   ├── api/                # REST API endpoints (jobs, inventory, reports, audit)
│   │   ├── api-doc/            # OpenAPI / Swagger UI interface
│   │   └── dashboard/          # Protected administrative and operational views
│   ├── components/
│   │   ├── admin/              # User management and authorization interfaces
│   │   ├── export/             # PDF and CSV reporting engines
│   │   ├── forms/              # Validated input forms (JobForm, InventoryForm)
│   │   ├── global/             # Reusable UI components (DataTable, Modal, Toast)
│   │   ├── map/                # Leaflet mapping and routing components
│   │   ├── signature/          # Canvas signature capture components
│   │   └── ui/                 # Primitive UI library (Radix UI wrappers)
│   ├── lib/
│   │   ├── auth.ts             # Authentication utilities and token resolvers
│   │   ├── prisma.ts           # Global Prisma client instance
│   │   ├── fonts/              # Embedded binary font files for PDF rendering
│   │   ├── mocks/              # Offline and testing data sets
│   │   └── validations/        # Zod validation schemas for API inputs
│   └── stores/                 # Zustand global client stores (jobs, inventory, ui)
├── .env.example                # Template for environment configuration
├── package.json                # Project dependencies and script declarations
└── tsconfig.json               # TypeScript compiler configuration
```

---

## Getting Started

### Prerequisites
- Node.js version 20.0.0 or higher
- npm or pnpm package manager
- PostgreSQL instance (or local SQLite fallback)

### Environment Configuration
Create a `.env` file in the root directory by referencing the configuration template:

```bash
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-secure-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Installation and Database Migration

```bash
# Install dependencies
pnpm install

# Push schema changes to the database
npx prisma db push

# Populate initial mock data and administrative accounts
pnpm run seed
```

### Local Development

```bash
# Start development server
pnpm run dev
```

Navigate to `http://localhost:3000` to access the application. The interactive API documentation is available at `http://localhost:3000/api-doc`.

---

## Quality Assurance and Standards

- **API Documentation**: Interactive OpenAPI specifications powered by Swagger UI available on the `/api-doc` route.
- **Type Safety**: Zero explicit `any` usage in core data models; end-to-end typing from database layer to UI components.
- **Audit Compliance**: All state-modifying requests generate immutable audit log records containing user context and timestamp data.
