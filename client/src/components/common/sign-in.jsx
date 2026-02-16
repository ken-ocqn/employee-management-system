import { ErrorPopup } from "./error-popup"
import { Link } from "react-router-dom"
import { User, Mail, Lock } from "lucide-react"

export const SignIn = ({ handlesigninform, handlesigninsubmit, targetedstate, statevalue, redirectpath, children }) => {
    return (
        <>
            {targetedstate.error.status ? <ErrorPopup error={targetedstate.error.message} /> : null}
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-indigo-100 flex items-center justify-center px-4 py-8 overflow-hidden relative">
                {/* Decorative background blobs */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="w-full max-w-lg relative z-10 transition-all duration-500 transform hover:scale-[1.01]">
                    {/* Form Section with Glass Effect */}
                    <div className="bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 ring-1 ring-white/20 p-8 md:p-12">

                        {/* Interactive Children (Role Switcher) */}
                        <div className="mb-10 flex justify-center">
                            {children}
                        </div>

                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center mb-6">
                                <div className="relative group">
                                    <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                    <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 transition-all duration-300">
                                        <User className="w-10 h-10" />
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                                Welcome Back!
                            </h2>
                            <p className="text-slate-500 font-semibold text-lg">Sign in to your portal</p>
                        </div>

                        {/* Form */}
                        <form className="space-y-8" onSubmit={handlesigninsubmit}>
                            {/* Email Field */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-sm font-black text-slate-800 uppercase tracking-wider ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={statevalue.email}
                                        onChange={handlesigninform}
                                        placeholder="you@example.com"
                                        className="block w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-white/60 backdrop-blur-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-8 focus:ring-blue-500/5 transition-all duration-300 font-bold shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between ml-1">
                                    <label htmlFor="password" className="block text-sm font-black text-slate-800 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <Link to={redirectpath} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-all hover:underline underline-offset-4">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={statevalue.password}
                                        onChange={handlesigninform}
                                        placeholder="••••••••"
                                        className="block w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-white/60 backdrop-blur-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-8 focus:ring-blue-500/5 transition-all duration-300 font-bold shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg py-5 rounded-2xl shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] mt-4"
                            >
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
