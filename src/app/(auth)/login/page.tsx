"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, LockKeyhole, MailIcon, Eye, EyeClosed, ShieldCheck, Wrench, UserCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<"email" | "password">("email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleNext = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (step === "email" && isEmailValid) {
            setStep("password");
        }
    };

    const handleQuickLogin = async (demoEmail: string, roleTitle: string) => {
        setIsLoading(true);
        setError(null);
        toast.info(`กำลังเข้าสู่ระบบในฐานะ: ${roleTitle}...`);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: demoEmail,
                password: "password123",
            });

            if (result?.error) {
                // If cloud password fails, try fallback default
                const retry = await signIn("credentials", {
                    redirect: false,
                    email: demoEmail,
                    password: "password123",
                });

                if (retry?.error) {
                    setError("ไม่สามารถเข้าสู่ระบบ Guest ได้ โปรดตรวจสอบการเชื่อมต่อฐานข้อมูล");
                    toast.error("เข้าสู่ระบบไม่สำเร็จ");
                    return;
                }
            }

            toast.success(`ยินดีต้อนรับสู่โหมดทดสอบ: ${roleTitle}`);
            router.refresh();
            router.push("/");
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
                toast.error("เข้าสู่ระบบไม่สำเร็จ", {
                    description: "โปรดตรวจสอบอีเมลและรหัสผ่านของคุณ"
                });
            } else {
                toast.success("เข้าสู่ระบบสำเร็จ");
                router.refresh();
                router.push("/");
            }
        } catch (error) {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-50 px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg p-8 sm:p-10 space-y-6 bg-white rounded-3xl border border-neutral-200/80 shadow-2xl"
            >
                <form
                    onSubmit={step === "email" ? handleNext : handleSubmit}
                    className="space-y-6"
                >
                    {/* Logo Section */}
                    <div className="w-full grid place-content-center">
                        <div className="flex items-center gap-3 justify-center">
                            <img
                                src="/Logo_Stella_6.png"
                                alt="Logo"
                                className="h-14 w-auto object-contain"
                            />
                        </div>
                    </div>

                    <div className="text-black text-center space-y-1.5">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Stellar Job System</h1>
                        <p className="text-neutral-500 text-sm">ระบบบริหารจัดการงานช่างภาคสนามและคลังอุปกรณ์</p>
                    </div>

                    <hr className="border-neutral-100" />

                    {/* Email Field - Step 1 */}
                    {step === "email" && (
                        <motion.div
                            key="email-field"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <label className="block text-sm font-medium ml-3 text-gray-700 mb-1.5">
                                อีเมลผู้ใช้งาน (Email address)
                            </label>
                            <div className="flex items-center gap-2 w-full text-gray-700 bg-gray-50 border border-gray-300 rounded-2xl overflow-clip p-1 focus-within:ring-2 focus-within:ring-black transition-all">
                                <MailIcon size={20} className="text-neutral-400 ml-3" />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full py-2.5 text-gray-700 bg-transparent outline-none text-sm"
                                    placeholder="name@example.com"
                                    autoFocus
                                />
                                {isEmailValid && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        type="submit"
                                        className="w-10 h-10 grid place-content-center font-semibold text-white bg-black rounded-xl hover:bg-neutral-800 cursor-pointer mr-1"
                                    >
                                        <ArrowRight size={20} />
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Password Field - Step 2 */}
                    {step === "password" && (
                        <motion.div
                            key="password-field"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 mb-4 bg-gray-50 p-2 px-4 rounded-full w-fit mx-auto cursor-pointer border border-gray-200" onClick={() => setStep("email")}>
                                <span className="text-sm text-gray-600">{email}</span>
                                <span className="text-xs text-blue-500 font-medium hover:underline">เปลี่ยน</span>
                            </div>

                            <div className="relative flex items-center text-gray-700 bg-gray-50 border border-gray-300 rounded-2xl overflow-clip px-4 py-1 focus-within:ring-2 focus-within:ring-black transition-all">
                                <LockKeyhole size={20} className="text-neutral-400" />
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2.5 text-gray-700 bg-transparent outline-none text-sm"
                                    placeholder="ใส่รหัสผ่านของคุณ"
                                    autoFocus
                                />
                                <span onClick={() => setPasswordVisible(!passwordVisible)} className="cursor-pointer text-neutral-400">
                                    {passwordVisible ? <Eye size={18} /> : <EyeClosed size={18} />}
                                </span>
                            </div>

                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-gray-500 hover:text-black hover:underline"
                                >
                                    ลืมรหัสผ่าน?
                                </Link>
                            </div>

                            {error && (
                                <p className="text-sm text-center text-red-500">{error}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 font-semibold text-white shadow-lg bg-black rounded-2xl hover:bg-neutral-800 disabled:bg-gray-400 cursor-pointer text-sm"
                            >
                                {isLoading ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ (Sign In)"}
                            </Button>
                        </motion.div>
                    )}

                    {/* Interactive Guest Demo Mode Section */}
                    <div className="pt-5 border-t border-dashed border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles size={14} className="text-amber-500" />
                                โหมดทดสอบสำหรับผู้ประเมิน (One-Click Demo)
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono">No Signup Needed</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {/* Role 1: Admin */}
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleQuickLogin("somchai.a@techjob.com", "ผู้ดูแลระบบ (Admin)")}
                                className="p-3 bg-neutral-900 text-white rounded-2xl flex flex-col items-start gap-1 hover:bg-black transition-all hover:scale-[1.02] text-left border border-black shadow-sm disabled:opacity-50"
                            >
                                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                                    <ShieldCheck size={14} />
                                    <span>Admin</span>
                                </div>
                                <span className="text-[11px] text-neutral-300 leading-tight">บริหารภาพรวม & คลัง</span>
                            </button>

                            {/* Role 2: Lead Technician */}
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleQuickLogin("wichai.t@techjob.com", "หัวหน้าทีมช่าง (Lead Tech)")}
                                className="p-3 bg-neutral-50 text-neutral-900 rounded-2xl flex flex-col items-start gap-1 hover:bg-neutral-100 transition-all hover:scale-[1.02] text-left border border-neutral-300 shadow-sm disabled:opacity-50"
                            >
                                <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold">
                                    <Wrench size={14} />
                                    <span>Lead Tech</span>
                                </div>
                                <span className="text-[11px] text-neutral-500 leading-tight">แผนที่นำทาง & จ่ายงาน</span>
                            </button>

                            {/* Role 3: Field Employee */}
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => handleQuickLogin("sompong.t@techjob.com", "ช่างปฏิบัติการ (Field Tech)")}
                                className="p-3 bg-neutral-50 text-neutral-900 rounded-2xl flex flex-col items-start gap-1 hover:bg-neutral-100 transition-all hover:scale-[1.02] text-left border border-neutral-300 shadow-sm disabled:opacity-50"
                            >
                                <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                                    <UserCheck size={14} />
                                    <span>Technician</span>
                                </div>
                                <span className="text-[11px] text-neutral-500 leading-tight">เซ็นชื่อ & ปิดงาน</span>
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
