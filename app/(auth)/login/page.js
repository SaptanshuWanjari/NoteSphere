"use client"
import React from 'react'
import TopNav from '../../components/TopNav'
import { LuClipboardPen } from 'react-icons/lu'
import { useForm, SubmitHandler } from "react-hook-form"
import Link from 'next/link'
import { IoMdEye } from 'react-icons/io'
import { IoMdEyeOff } from 'react-icons/io'
import { useSession, signIn, signOut } from "next-auth/react"
import { CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Signing you in...");
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");

    // Redirect authenticated users to user page
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/user');
        }
    }, [status, router]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (data) => {
        setLoading(true);
        setLoadingMessage("Signing you in...");
        setLoginError("");
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
            callbackUrl: "/user"
        });
        setLoading(false);
        if (result?.error) {
            // Provide user-friendly error messages
            let errorMessage = "";
            switch (result.error) {
                case "CredentialsSignin":
                    errorMessage = "Invalid email or password. Please check your credentials and try again.";
                    break;
                case "Configuration":
                    errorMessage = "There was a problem with the server configuration. Please try again later.";
                    break;
                case "AccessDenied":
                    errorMessage = "Access denied. Please contact support if this continues.";
                    break;
                case "Verification":
                    errorMessage = "Unable to verify your account. Please try again.";
                    break;
                default:
                    errorMessage = "Login failed. Please try again or contact support if the problem persists.";
            }
            setLoginError(errorMessage);
        } else if (result?.ok) {
            window.location.href = "/user";
        }
    }
    return (
        <>
            <TopNav />
            <div className='flex justify-center items-center min-h-[calc(100vh-120px)] flex-col'>
                {loading && (
                    <div className="fixed inset-0  bg-opacity-80 flex justify-center items-center z-[9999]">
                        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6 flex flex-col justify-center items-center min-w-[200px]">
                            <CircularProgress size={40} />
                            <p className="text-sm text-gray-600 mt-3">{loadingMessage}</p>
                        </div>
                    </div>
                )}
                <div className='w-125 bg-white p-5 flex justify-center items-center flex-col rounded-xl'>

                    <div className='flex items-center justify-center mb-5'>
                        <LuClipboardPen size={50} color='white' className='bg-black p-2 rounded-xl mr-2' />
                        <h1 className='text-2xl'>NoteSphere</h1>
                    </div>
                    <h1 className='text-3xl'>Sign In</h1>
                    <p className='text-center text-gray-500'>Login to stay connected</p>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col w-full my-3'
                    >
                        <input
                            className='bg-[#f9fafb] border border-gray-300 p-2 rounded-md mb-4'
                            placeholder='Email'
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && <p className='text-red-500'>{errors.email.message}</p>}

                        <div className='relative mb-4'>
                            <input
                                type={showPassword ? "text" : "password"}
                                className='bg-[#f9fafb] border border-gray-300 p-2 rounded-md w-full pr-10'
                                placeholder='Password'
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                            {showPassword ? (
                                <IoMdEyeOff
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
                                    aria-label="Hide password"
                                    onClick={() => setShowPassword(false)}
                                />
                            ) : (
                                <IoMdEye
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
                                    aria-label="Show password"
                                    onClick={() => setShowPassword(true)}
                                />
                            )}
                        </div>
                        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                        
                        {loginError && (
                            <div className='bg-red-50 border border-red-200 rounded-md p-3 mb-4'>
                                <p className='text-red-700 text-sm flex items-center'>
                                    <span className='mr-2'>⚠️</span>
                                    {loginError}
                                </p>
                            </div>
                        )}

                        <div className='flex justify-between'>
                            <div className='flex items-center mb-4'>
                                <input {...register("checkbox")} type="checkbox" className='mr-2 rounded-full' />
                                <label className='text-gray-700'>Remember me</label>
                            </div>
                            <Link prefetch={false} href="/forgot-password" className='text-blue-500 hover:underline'>Forgot Password?</Link>
                        </div>

                        <div className='flex flex-col gap-2 mt-2 justify-center items-center'>
                            <button
                                className='btn-click w-50 bg-black text-white p-2 rounded-md hover:bg-gray-800 transition active:translate-y-1 active:scale-95'
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Login
                            </button>
                        </div>
                        <p className='text-center text-gray-500 mt-3'>Don&apos;t have an account? <Link prefetch={false} href="/register" className='text-blue-500 hover:underline'>Sign Up</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Page
