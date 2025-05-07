"use client"
import { React, useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore.js';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from "next/image";


export default function Page() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: '',
        password: ''
    });

    const { userSignUp, isSigningUp, authUser } = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm();

        if (success === true) {
            userSignUp(formData);
        }
    };

    useEffect(() => {
        if (authUser) {
            router.push("/dashboard");
        }
    }, [authUser]);

    return (
        <div className="min-h-screen grid lg:grid-cols-1 bg-secondary">
            <div className="flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className=" rounded-xl flex items-center justify-center group-hover:bg-blue-500/20  transition-colors">
                                <Image src="/mainlogo3.png" width={150} height={200} alt="logo" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                            <p className="text-base-content opacity-60">Get started with your free account</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label htmlFor="" className="label mt-3 flex items-center gap-2">
                                <User className='size-5 text-gray-700' />
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="John George"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label htmlFor="" className="label mt-3 flex items-center gap-2">
                                <Mail className="size-5 text-gray-700" />
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="John@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label htmlFor="" className="label mt-3 flex items-center gap-2">
                                <Lock className='size-5 text-gray-700' />
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="........"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className='size-5 text-base-content opacity-40' />
                                    ) : (
                                        <Eye className='size-5 text-base-content opacity-40' />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn bg-white-500 hover:bg-gray-400 rounded-2xl  text-black w-full mt-6 flex items-center justify-center gap-2" disabled={isSigningUp}>
                            {isSigningUp ? (
                                <>
                                    <Loader2 className='w-5 h-5 animate-spin text-black' />
                                    <span className="text-sm font-medium">Signing Up...</span>
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content opacity-60">
                            Already have an account?{" "}
                            <Link href="/sign-in" className='link text-blue-800 hover:bg-blue-200 rounded underline '>Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}