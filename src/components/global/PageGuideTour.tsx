"use client";

import { useCallback } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "@/styles/driver-custom.css";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";

interface TourStep {
  element?: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
  };
}

export default function PageGuideTour() {
  const pathname = usePathname();

  const getPageTourSteps = useCallback((): TourStep[] => {
    // 1. Jobs List Page
    if (pathname?.includes("/jobs")) {
      return [
        {
          element: "#tour-jobs-header",
          popover: {
            title: "กระดานบริหารงาน (Jobs Management)",
            description: "ศูนย์รวมใบสั่งงานทั้งหมดของระบบ สามารถติดตามสถานะงาน กรองตามประเภท หรือค้นหาตามเลขที่งาน",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-jobs-actions",
          popover: {
            title: "ปุ่มคำสั่งหลัก (Action Toolbar)",
            description: "ส่งออกรายงานสรุปงานทั้งหมดเป็น CSV หรือสร้างใบงานใหม่สำหรับส่งต่อให้ทีมช่างภาคสนาม",
            side: "bottom",
            align: "end",
          },
        },
        {
          element: "#tour-jobs-filter",
          popover: {
            title: "ระบบคัดกรองข้อมูล (Advanced Filter)",
            description: "กรองงานตามความเร่งด่วน (Urgent, High, Normal), แผนกที่รับผิดชอบ, สถานะงาน หรือช่วงวันที่สร้างงาน",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tour-jobs-table",
          popover: {
            title: "ตารางรายการงาน (Interactive Data Table)",
            description: "แสดงรหัสงาน, ชื่องาน, สถานะปัจจุบัน, ช่างผู้รับผิดชอบ และกำหนดเวลา สามารถคลิกดูรายละเอียดหรือจัดเรียงลำดับความสำคัญได้",
            side: "top",
            align: "center",
          },
        },
      ];
    }

    // 2. Map Page
    if (pathname?.includes("/map")) {
      return [
        {
          element: "#tour-map-container",
          popover: {
            title: "แผนที่พิกัดงาน (GIS Interactive Map)",
            description: "แสดงหมุดพิกัดไซต์งานของลูกค้าแบบ Cluster ช่วยให้เห็นภาพรวมความหนาแน่นของงานในแต่ละโซน",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tour-map-sidebar",
          popover: {
            title: "รายการหมุดพิกัด (Job Locations)",
            description: "คลิกเลือกงานที่ต้องการเพื่อโฟกัสพิกัดบนแผนที่และเรียกดูรายละเอียดเส้นทางทันที",
            side: "right",
            align: "start",
          },
        },
      ];
    }

    // 3. Inventory Page
    if (pathname?.includes("/inventory")) {
      return [
        {
          element: "#tour-inventory-header",
          popover: {
            title: "ระบบคลังวัสดุและอุปกรณ์ (Inventory Warehouse)",
            description: "ตรวจสอบสต็อกคงเหลือของอะไหล่และเครื่องมือวิศวกรรม พร้อมแจ้งเตือนเมื่อสินค้าใกล้หมดสต็อก",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tour-inventory-table",
          popover: {
            title: "ตารางรายการอะไหล่ (Stock Items)",
            description: "แสดงรหัสสินค้า, จำนวนคงเหลือในคลัง, หมวดหมู่อะไหล่ และประวัติการเบิกจ่ายไปใช้งาน",
            side: "top",
            align: "center",
          },
        },
      ];
    }

    // 4. Reports Page
    if (pathname?.includes("/report")) {
      return [
        {
          element: "#tour-reports-header",
          popover: {
            title: "ระบบออกเอกสารและรายงาน (Reports & PDF Synthesis)",
            description: "สรุปผลการปฏิบัติงานของช่าง ออกใบรับรองงานเสร็จสิ้นพร้อมลายเซ็นลูกค้าในรูปแบบ PDF ภาษาไทย",
            side: "bottom",
            align: "start",
          },
        },
      ];
    }

    // 5. Default Dashboard Overview
    return [
      {
        element: "#tour-sidebar",
        popover: {
          title: "เมนูหลัก (Navigation Bar)",
          description: "เข้าถึงฟังก์ชันงานทั้งหมด: ตารางงาน, แผนที่ GIS, คลังอะไหล่ และรายงานผล",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#tour-global-search",
        popover: {
          title: "ระบบค้นหาด่วน (Global Search)",
          description: "ค้นหาใบงาน, ผู้ใช้งาน หรืออุปกรณ์ได้ทันทีจากทุกหน้าของระบบ",
          side: "bottom",
          align: "center",
        },
      },
    ];
  }, [pathname]);

  const startPageTour = () => {
    const steps = getPageTourSteps();
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      popoverClass: "stellar-driver-theme",
      doneBtnText: "เข้าใจแล้ว (Done)",
      nextBtnText: "ถัดไป →",
      prevBtnText: "← ย้อนกลับ",
      steps: steps.map((s) => ({
        element: s.element,
        popover: {
          ...s.popover,
        },
      })),
      onDestroyStarted: () => {
        driverObj.destroy();
      },
    });

    driverObj.drive();
  };

  return (
    <button
      onClick={startPageTour}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black border border-neutral-300/80 transition-all cursor-pointer shadow-sm active:scale-95"
      title="อธิบายส่วนประกอบของหน้านี้ (Page Tour)"
    >
      <HelpCircle size={14} className="text-neutral-500" />
      <span>อธิบายหน้านี้ (Tour)</span>
    </button>
  );
}

