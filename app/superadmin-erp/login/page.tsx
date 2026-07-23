"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ShieldAlert } from "lucide-react";
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

export default function SuperAdminERPLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Sign In Logic
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Invalid credentials");

        if (data.role === "super_admin") {
          router.push("/superadmin-erp");
        } else {
          throw new Error("Unauthorized role. You are not a Super Admin.");
        }
      } else {
        // Sign Up Logic
        const res = await fetch("/api/admin/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, password, role: "super_admin" }),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");
        
        // After successful sign up, toggle to login
        setIsLogin(true);
        setError("Registration successful! Please sign in.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-[#0f172a] py-8 px-6 text-center text-white relative">
          <div className="flex justify-center mb-4 relative z-10">
            <div className="bg-white p-2 rounded-lg shadow-lg inline-block">
              <div className="font-bold text-[#0f172a] text-2xl tracking-tight w-10 h-10 flex items-center justify-center">
                 <ShieldAlert className="w-6 h-6" />
              </div>
            </div>
          </div>
          <h2 className="text-sm font-medium tracking-widest uppercase relative z-10 text-white/90">
            Super Admin ERP
          </h2>
          <div className="flex justify-center mt-6 border-b border-white/20">
             <button onClick={() => { setIsLogin(true); setError(""); }} className={`px-4 py-2 text-sm font-semibold transition-all ${isLogin ? 'border-b-2 border-white text-white' : 'text-white/60 hover:text-white'}`}>Sign In</button>
             <button onClick={() => { setIsLogin(false); setError(""); }} className={`px-4 py-2 text-sm font-semibold transition-all ${!isLogin ? 'border-b-2 border-white text-white' : 'text-white/60 hover:text-white'}`}>Sign Up</button>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className={`text-sm p-3 rounded-lg text-center border ${error.includes('successful') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {error}
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 pr-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f172a]" placeholder="Super Admin Name" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full pl-10 pr-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f172a]" placeholder="+91 9876543210" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                  placeholder="superadmin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-xs mt-2">
                <label className="flex items-center text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#0f172a] shadow-sm focus:ring-[#0f172a] mr-2" />
                  Remember me
                </label>
                <button type="button" onClick={() => setIsForgotModalOpen(true)} className="text-gray-600 hover:underline bg-transparent border-none p-0 cursor-pointer">Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 mt-4 rounded-lg shadow-md text-sm font-medium text-white bg-[#0f172a] hover:bg-slate-800 focus:outline-none transition-colors disabled:opacity-50"
            >
              {loading ? "Processing..." : (isLogin ? "→] Secure Sign In" : "Create Super Admin")}
            </button>
          </form>
        </div>
      </div>
      
      <ForgotPasswordModal 
        isOpen={isForgotModalOpen} 
        onClose={() => setIsForgotModalOpen(false)} 
        role="user" 
      />
    </div>
  );
}
