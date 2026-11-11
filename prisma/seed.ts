import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MOCK_USERS } from '../src/lib/mocks/user';
import { MOCK_INVENTORIES } from '../src/lib/mocks/inventory';

const prisma = new PrismaClient();

const DEPT_OPTIONS = ["Electrical", "Mechanical", "Civil", "Technical"];

// Real-world job templates tailored for each department
const DEPT_JOB_TEMPLATES: Record<string, Array<{ title: string; type: string; desc: string; priority: string }>> = {
  Electrical: [
    { title: "ติดตั้งระบบ Solar Rooftop 10kW อาคารสำนักงานใหญ่", type: "installation", desc: "ติดตั้งแผงโซลาร์เซลล์ Tier-1 อินเวอร์เตอร์ On-Grid พร้อมระบบเชื่อมต่อสายส่งของการไฟฟ้า", priority: "high" },
    { title: "ซ่อมบำรุงตู้ควบคุมระบบไฟฟ้า MDB ประจำปี โรงงาน 1", type: "maintenance", desc: "ทำความสะอาด กวดขันขั้วต่อ ตรวจสอบค่าความต้านทานฉนวนและตรวจจับความร้อนด้วยกล้อง Thermal Scan", priority: "medium" },
    { title: "เปลี่ยนชุดหลอดไฟ LED High Bay 150W โกดังสินค้า", type: "repair", desc: "รื้อถอนโคมไฟเก่าที่ชำรุด 12 จุด และติดตั้งโคม LED ประหยัดพลังงานเพื่อเพิ่มความสว่าง", priority: "low" },
    { title: "แก้ไขระบบไฟฟ้าลัดวงจรและไฟดับฉุกเฉิน อาคาร B", type: "emergency", desc: "ตรวจหาจุดลัดวงจร เปลี่ยนเซอร์กิตเบรกเกอร์ และทดสอบระบบจ่ายไฟฉุกเฉินให้กลับมาใช้งานได้ปกติ", priority: "urgent" },
    { title: "ติดตั้งระบบสำรองไฟ UPS 30kVA สำหรับห้อง Server Data Center", type: "installation", desc: "เดินสายเมนทองแดง ติดตั้ง Breaker Interlock และทดสอบ Battery Load Test เต็มพิกัด", priority: "high" },
    { title: "ตรวจสอบระบบล่อฟ้าและระบบกราวด์ Earth Resistance อาคาร C", type: "maintenance", desc: "วัดค่าความต้านทานหลักดิน ตรวจสอบสภาพตัวนำลงดินและสายอากาศล่อฟ้าประจำปี", priority: "medium" },
    { title: "ติดตั้งหม้อแปลงไฟฟ้า 500kVA และระบบสวิตช์เกียร์", type: "installation", desc: "ลงแท่นหม้อแปลง ต่อขั้วแรงสูง-แรงต่ำ พร้อมทดสอบค่าความเป็นฉนวนน้ำมันหม้อแปลง", priority: "urgent" },
  ],
  Mechanical: [
    { title: "ตรวจเช็คและเปลี่ยนถ่ายสารทำความเย็นระบบ Chiller อาคาร 2", type: "maintenance", desc: "ตรวจสอบแรงดัน ดูแลระบบคอมเพรสเซอร์ และเปลี่ยนน้ำมันหล่อลื่นตามรอบระยะเวลาใช้งาน", priority: "high" },
    { title: "ซ่อมปั๊มน้ำ Booster Pump เสียงดังและแรงดันน้ำตก อาคารคอนโด", type: "repair", desc: "ถอดเปลี่ยน Mechanical Seal ลูกปืนแบริ่ง และตั้งศูนย์เพลาขับพร้อมทดสอบแรงดันน้ำ", priority: "urgent" },
    { title: "ล้างและทำความสะอาดระบบท่อลมระบายอากาศ Duct Cleaning โซนครัวกลาง", type: "maintenance", desc: "ขจัดคราบไขมันในท่อลม ทำความสะอาดพัดลม Exhaust และเปลี่ยนฟิลเตอร์กรองกลิ่น", priority: "medium" },
    { title: "แก้ไขเหตุน้ำแอร์รั่วซึมหยดลงฝ้าเพดานห้องประชุม VIP", type: "emergency", desc: "เป่าล้างท่อน้ำทิ้ง ตรวจสอบถาดน้ำทิ้ง และแก้ไขฉนวนหุ้มท่อน้ำยาที่ฉีกขาด", priority: "urgent" },
    { title: "เปลี่ยนสายพานและลูกปืนพัดลมส่งลมเย็น AHU Unit 4", type: "repair", desc: "เปลี่ยนสายพาน V-Belt ตั้งความตึง อัดจาระบีลูกปืน และวัดค่าแรงสั่นสะเทือน", priority: "medium" },
    { title: "ตรวจสอบและทดสอบระบบหัวกระจายน้ำดับเพลิง Fire Sprinkler System", type: "maintenance", desc: "ทดสอบการทำงานของ Flow Switch ตรวจเช็คเกจวัดแรงดัน และล้างตะแกรงกรอง Strainer", priority: "high" },
  ],
  Civil: [
    { title: "ซ่อมรอยแตกร้าวและเคลือบสารกันซึมดาดฟ้าอาคารจอดรถ", type: "repair", desc: "สกัดเปิดรอยแตก ยิง Polyurethane Sealant และทาสารกันซึมอะคริลิกสะท้อนความร้อน 3 ชั้น", priority: "high" },
    { title: "ปรับปรุงระดับพื้นทางลาดผู้พิการและทาสีเส้นจราจร Epoxy", type: "installation", desc: "เทปูนปรับระดับพื้นผิว ติดตั้งราวจับสแตนเลส และทาสีกันลื่น Polyurethane", priority: "medium" },
    { title: "แก้ไขท่อน้ำทิ้งหลักอุดตันและน้ำเอ่อล้นบริเวณชั้น B1", type: "emergency", desc: "ใช้งูเหล็กและเครื่องฉีดน้ำแรงดันสูงทะลวงท่อ ตรวจสอบบ่อดักไขมัน และดูดตะกอนสิ่งปฏิกูล", priority: "urgent" },
    { title: "เปลี่ยนแผ่นฝ้าทีบาร์ยิปซัมที่ชำรุดจากปัญหาน้ำรั่ว 15 แผ่น", type: "repair", desc: "รื้อถอนแผ่นฝ้าเดิมที่ขึ้นรา เปลี่ยนโครงคร่าวทีบาร์ที่บิดงอ และติดตั้งแผ่นใหม่ให้เรียบเนียน", priority: "low" },
    { title: "ตรวจสอบโครงสร้างคานและเสาอาคารเก่าตามรอบ 5 ปี", type: "maintenance", desc: "ตรวจสอบรอยร้าวคอนกรีต ทดสอบค่าคาร์บอเนชั่น และตรวจวัดการแอ่นตัวของโครงสร้าง", priority: "medium" },
  ],
  Technical: [
    { title: "ติดตั้งกล้องวงจรปิด IP Camera 4K 16 จุด พร้อมเซิร์ฟเวอร์ NVR", type: "installation", desc: "เดินสายสัญญาณ UTP Cat6 ต่อไฟเลี้ยง PoE คอนฟิกระบบบันทึกภาพ และทดสอบดูผ่านมือถือ", priority: "high" },
    { title: "ซ่อมแซมระบบ Access Control สแกนใบหน้าขัดข้อง ประตูทางเข้า", type: "repair", desc: "ตรวจสอบระบบ Magnetic Lock เปลี่ยน Power Supply 12V 5A และอัปเดต Firmware ตัวเครื่อง", priority: "urgent" },
    { title: "เดินสายสัญญาณ Fiber Optic Single Mode ข้ามอาคาร A ไปอาคาร B", type: "installation", desc: "ร้อยท่อ HDPE ทำการ Splice หัวต่อด้วย Fusion Splicer และวัดค่าการลดทอนด้วย OTDR", priority: "medium" },
    { title: "ติดตั้งระบบเซนเซอร์วัดอุณหภูมิและความชื้น IoT ในห้อง Server", type: "installation", desc: "ติดตั้งเซนเซอร์ไร้สาย เชื่อมต่อ Gateway และส่งสัญญาณแจ้งเตือนอัตโนมัติเมื่ออุณหภูมิสูงเกิน", priority: "medium" },
    { title: "คอนฟิก Firewall FortiGate และแยก VLAN แต่ละแผนกเพื่อความปลอดภัย", type: "maintenance", desc: "อัปเดต Signature ไวรัส ตั้งค่านโยบาย Security Policy ป้องกันการบุกรุก และจำกัด Bandwidth", priority: "high" },
    { title: "ตรวจสอบและแก้ไขระบบตู้สาขาโทรศัพท์ IP-PBX สายหลุดบ่อย", type: "repair", desc: "ตรวจสอบ SIP Trunk คุณภาพ Packet Loss ทดสอบการโทรเข้า-ออก และปรับแต่งค่า QoS", priority: "medium" },
  ],
};

const SAMPLE_COMPANIES = [
  { name: "บริษัท สยาม พาวเวอร์ โซลูชั่น จำกัด", taxId: "0105556012345", phone: "02-123-4567", addr: "88/1 ถนนรัชดาภิเษก แขวงจตุจักร เขตจตุจักร กรุงเทพฯ" },
  { name: "โรงแรม แกรนด์ พลาซ่า โฮเต็ล แอนด์ สวีทส์", taxId: "0105557098765", phone: "02-987-6543", addr: "123 ถนนสุขุมวิท ซอย 21 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ" },
  { name: "คอนโดมิเนียม ไฮดรา ลักชูรี่ เรสซิเดนซ์", taxId: "0105558034567", phone: "02-456-7890", addr: "456 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพฯ" },
  { name: "บริษัท ไทย โลจิสติกส์ พาร์ค จำกัด (มหาชน)", taxId: "0107559045678", phone: "02-789-0123", addr: "99 หมู่ 3 ถนนบางนา-ตราด กม.18 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ" },
  { name: "โรงพยาบาล อินเตอร์เนชั่นแนล เมดิคอล เซ็นเตอร์", taxId: "0105560056789", phone: "02-345-6789", addr: "78 ถนนพระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ" },
  { name: "ศูนย์การค้า เมกา ไลฟ์สไตล์ มอลล์", taxId: "0105561067890", phone: "02-678-9012", addr: "234 ถนนเพชรบุรีตัดใหม่ แขวงบางกะปิ เขตห้วยขวาง กรุงเทพฯ" }
];

async function main() {
  console.log('🚀 Start comprehensive system seeding...');

  try {
    await prisma.auditLog.deleteMany();
    await prisma.report.deleteMany();
    await prisma.workLog.deleteMany();
    await prisma.task.deleteMany();
    await prisma.job.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('Clean up note:', e);
  }
  console.log('🗑️ Database cleared.');

  // 2. Seed Users
  const passwordHash = await bcrypt.hash('password123', 10);
  for (const u of MOCK_USERS) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        imageUrl: u.imageUrl,
        password: passwordHash,
        phone: u.phone,
        status: u.status,
      },
    });
  }
  console.log('👤 Users seeded.');

  // 3. Seed Inventories
  for (const inv of MOCK_INVENTORIES) {
    await prisma.inventory.upsert({
      where: { id: inv.id },
      update: {},
      create: {
        id: inv.id,
        name: inv.name,
        category: inv.category,
        quantity: inv.quantity,
        unit: inv.unit,
        price: inv.price,
        location: inv.location,
        status: inv.status,
      },
    });
  }
  console.log('📦 Inventories seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
