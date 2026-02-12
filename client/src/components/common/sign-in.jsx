import { ErrorPopup } from "./error-popup"
import { Link } from "react-router-dom"
import { User, Mail, Lock } from "lucide-react"

export const SignIn = ({ image, handlesigninform, handlesigninsubmit, targetedstate, statevalue, redirectpath }) => {
    return (
        <>
            {targetedstate.error.status ? <ErrorPopup error={targetedstate.error.message} /> : null}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8 md:px-6 md:py-12">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    
                    {/* Image Section */}
                    <div className="hidden lg:flex justify-center items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                            <img
                                alt="Welcome"
                                src={image}
                                className="relative mx-auto h-auto w-full max-w-md rounded-3xl shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Form Section with Glass Effect */}
                    <div className="w-full">
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 ring-1 ring-slate-200/50 p-8 md:p-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center mb-4">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                                        <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                            <User className="w-8 h-8" />
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                                    Welcome Back!
                                </h2>
                                <p className="text-slate-500 font-medium">Sign in to access your account</p>
                            </div>

                            {/* Form */}
                            <form className="space-y-6" onSubmit={handlesigninsubmit}>
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" />
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
                                            className="block w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                                            Password
                                        </label>
                                        <Link to={redirectpath} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400" />
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
                                            className="block w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Sign In
                                </button>
                            </form>

                            {/* Mobile Image */}
                            <div className="lg:hidden mt-8 pt-8 border-t border-slate-200">
                                <img
                                    alt="Welcome"
                                    src={image}
                                    className="mx-auto h-auto w-full max-w-xs rounded-2xl shadow-lg opacity-80"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}