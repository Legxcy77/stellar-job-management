"use client";

import { useEffect, useCallback } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { HelpCircle, Sparkles } from "lucide-react";

export default function ProductTour() {
  const startTour = useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: "เสร็จสิ้น (Done)",
      nextBtnText: "ถัดไป (Next) →",
      prevBtnText: "← ย้อนกลับ (Back)",
      steps: [
        {
          element: "#tour-sidebar",
          popover: {
            title: "เมนูหลัก (Navigation Hub)",
            description: "เข้าถึงฟังก์ชันทั้งหมดของระบบ: งานที่ได้รับมอบหมาย, แผนที่ GPS, คลังวัสดุ และรายงานเชิงวิศวกรรม",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#tour-stats",
          popover: {
            title: "ภาพรวมการดำเนินงาน (Operational Metrics)",
            description: "ตรวจสอบสถิติจำนวนงานที่รอดำเนินการ (Pending), กำลังปฏิบัติงาน (In Progress) และงานที่ปิดสำเร็จแล้วแบบเรียลไทม์",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tour-jobs-table",
          popover: {
            title: "กระดานบริหารงานช่าง (Job Management)",
            description: "ตรวจสอบรายละเอียดงาน มอบหมายงานให้ช่างเทคนิค ติดตามสถานะความเร่งด่วน และเบิกจ่ายอะไหล่",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#tour-map-link",
          popover: {
            title: "ระบบแผนที่และนำทาง (GIS & Route Optimization)",
            description: "คลิกเพื่อดูหมุดพิกัดไซต์งานของลูกค้า นำทางช่างด้วย Leaflet Routing และตรวจเช็กความหนาแน่นของงานในแต่ละพื้นที่",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#tour-export-button",
          popover: {
            title: "ออกรายงานดิจิทัล (PDF & CSV Synthesis)",
            description: "ส่งออกใบสั่งงาน ใบรับรองงานพร้อมลายเซ็น และสรุปการเบิกจ่ายอะไหล่เป็น PDF ภาษาไทยมาตรฐาน THSarabunNew",
            side: "left",
            align: "center",
          },
        },
      ],
      onDestroyStarted: () => {
        localStorage.setItem("has_seen_stellar_tour", "true");
        driverObj.destroy();
      },
    });

    driverObj.drive();
  }, []);

  useEffect(() => {
    // Auto-trigger tour on first visit if not yet seen
    const hasSeen = localStorage.getItem("has_seen_stellar_tour");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        startTour();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [startTour]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={startTour}
        className="group flex items-center gap-2.5 bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-full shadow-2xl border border-white/20 transition-all hover:scale-105 active:scale-95 text-xs font-medium"
        title="แนะนำการใช้งานระบบ (System Walkthrough)"
      >
        <Sparkles size={14} className="text-amber-400 animate-pulse" />
        <span>แนะนำระบบ (Tour)</span>
        <HelpCircle size={14} className="text-neutral-400 group-hover:text-white" />
      </button>
    </div>
  );
}
