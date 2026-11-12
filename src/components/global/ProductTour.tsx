"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  X, 
  MapPin, 
  Package, 
  FileCheck2, 
  ChevronRight, 
  Layers, 
  Route as RouteIcon,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface WorkflowStep {
  step: string;
  title: string;
  role: string;
  summary: string;
  link: string;
  linkText: string;
  icon: any;
  highlight: string;
}

export default function SystemGuideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const pathname = usePathname();

  const isAdminArea = pathname?.includes("/admin");

  const workflowSteps: WorkflowStep[] = [
    {
      step: "01",
      title: "การมอบหมายและจัดการงาน (Job Dispatch)",
      role: "Admin & Lead Tech",
      summary: "ผู้ดูแลระบบหรือหัวหน้าช่างทำการตรวจสอบคิวงาน มอบหมายงานให้ช่างที่รับผิดชอบตามความเชี่ยวชาญ และระบุระดับความสำคัญของงาน",
      link: isAdminArea ? "/dashboard/admin/jobs" : "/dashboard/employee/jobs",
      linkText: "ไปยังหน้ารายการงาน (Jobs)",
      icon: Layers,
      highlight: "ตรวจสอบสถานะงาน Pending, In Progress และ Done พร้อมประวัติการทำงาน",
    },
    {
      step: "02",
      title: "การจัดการเส้นทางและพิกัดงาน (GIS & Routing)",
      role: "Lead Tech & Dispatcher",
      summary: "ตรวจเช็กตำแหน่งพิกัดของไซต์งานลูกค้าบนแผนที่ Leaflet GIS และคำนวณเส้นทางการเดินทางที่ประหยัดเวลาที่สุดให้กับทีมช่าง",
      link: isAdminArea ? "/dashboard/admin/map" : "/dashboard/admin/map",
      linkText: "ไปยังหน้าแผนที่และพิกัด (Map)",
      icon: RouteIcon,
      highlight: "วิเคราะห์ Cluster พิกัดงานและความหนาแน่นของงานในแต่ละพื้นที่",
    },
    {
      step: "03",
      title: "การเบิกจ่ายและควบคุมคลังอะไหล่ (Inventory)",
      role: "Admin & Technician",
      summary: "ทีมช่างยื่นคำขอเบิกอุปกรณ์และอะไหล่ที่จำเป็นต่อการปฏิบัติงาน โดยระบบตัดสต็อกและบันทึกประวัติการเบิกใช้อัตโนมัติ",
      link: isAdminArea ? "/dashboard/admin/inventorys" : "/dashboard/employee/inventorys",
      linkText: "ไปยังระบบคลังสินค้า (Inventory)",
      icon: Package,
      highlight: "ติดตามจำนวนคงเหลือ ตรวจสอบคำขอเบิก และป้องกันอะไหล่ขาดสต็อก",
    },
    {
      step: "04",
      title: "รายงานผลและส่งมอบงานดิจิทัล (Sign & PDF Export)",
      role: "Technician & Customer",
      summary: "เมื่อปฏิบัติงานเสร็จสิ้น ช่างบันทึกผลงาน ให้ลูกค้าตรวจรับพร้อมเซ็นชื่อดิจิทัลผ่านหน้าจอ และออกใบรับรอง PDF ภาษาไทยมาตรฐาน",
      link: isAdminArea ? "/dashboard/admin/reports" : "/dashboard/employee/report",
      linkText: "ไปยังหน้ารายงานและเอกสาร (Reports)",
      icon: FileCheck2,
      highlight: "รองรับ Digital Signature และสร้างไฟล์ PDF ทันทีในระบบ",
    },
  ];

  const currentStep = workflowSteps[activeStepIndex];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-neutral-900 hover:bg-black text-white px-4 py-2.5 rounded-full shadow-xl border border-neutral-700/60 transition-all hover:scale-105 active:scale-95 text-xs font-medium cursor-pointer"
          title="คู่มือแนะนำขั้นตอนการทำงาน (System Workflow)"
        >
          <Compass size={15} className="text-neutral-300 group-hover:rotate-45 transition-transform duration-300" />
          <span>ขั้นตอนการทำงานระบบ (Flow Guide)</span>
        </button>
      </div>

      {/* Workflow Modal Backdrop & Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                    <Compass size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                      STELLAR WORKFLOW GUIDE
                    </h3>
                    <p className="text-xs text-neutral-500">
                      ลำดับขั้นตอนการทำงานหลักของระบบปฏิบัติการช่างภาคสนาม
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Step Navigation Pills */}
              <div className="px-6 pt-4 pb-2 border-b border-neutral-100 bg-white">
                <div className="grid grid-cols-4 gap-2">
                  {workflowSteps.map((s, idx) => {
                    const isActive = idx === activeStepIndex;
                    return (
                      <button
                        key={s.step}
                        onClick={() => setActiveStepIndex(idx)}
                        className={`py-2 px-3 rounded-2xl text-left transition-all border cursor-pointer ${
                          isActive
                            ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                            : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100 hover:border-neutral-300"
                        }`}
                      >
                        <div className={`text-[10px] font-mono tracking-wider ${isActive ? "text-neutral-300" : "text-neutral-400"}`}>
                          STEP {s.step}
                        </div>
                        <div className="text-xs font-medium truncate mt-0.5">
                          {s.title.split(" ")[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-900 shrink-0">
                    <currentStep.icon size={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                      <span>บทบาทที่รับผิดชอบ: {currentStep.role}</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-neutral-900">
                      {currentStep.title}
                    </h4>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-200/70 space-y-3">
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    {currentStep.summary}
                  </p>
                  <div className="pt-2 border-t border-neutral-200/60 flex items-center gap-2 text-xs text-neutral-600">
                    <span className="font-semibold text-neutral-900">จุดเด่น:</span>
                    <span>{currentStep.highlight}</span>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-neutral-400 font-mono">
                    ขั้นตอนที่ {activeStepIndex + 1} จาก {workflowSteps.length}
                  </div>

                  <div className="flex items-center gap-2">
                    {activeStepIndex < workflowSteps.length - 1 ? (
                      <button
                        onClick={() => setActiveStepIndex((prev) => prev + 1)}
                        className="px-4 py-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                      >
                        ถัดไป
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveStepIndex(0)}
                        className="px-4 py-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                      >
                        กลับไปขั้นตอนแรก
                      </button>
                    )}

                    <Link
                      href={currentStep.link}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-medium transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
                    >
                      <span>{currentStep.linkText}</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
