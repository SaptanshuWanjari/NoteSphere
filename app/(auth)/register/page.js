"use client"
import React, { useState } from 'react'
import TopNav from '@/app/components/TopNav'
import { signIn } from 'next-auth/react';
import { LuClipboardPen } from 'react-icons/lu'
import Link from 'next/link';
import { useForm, SubmitHandler } from "react-hook-form"
import { IoMdEye } from 'react-icons/io'
import { IoMdEyeOff } from 'react-icons/io'
import { CircularProgress } from '@mui/material';

const Page = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Creating account...");
    const [registrationError, setRegistrationError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (data) => {
        setLoading(true);
        setLoadingMessage("Creating account...");
        setRegistrationError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.username,
                    fullname: data.fullname,
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await res.json();

            if (res.ok) {
                setLoadingMessage("Signing you in...");
                // Automatically log in the user after successful registration
                const signInResult = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                    callbackUrl: "/user"
                });

                if (signInResult?.ok) {
                    window.location.href = "/user";
                } else {
                    setRegistrationError("Account created successfully, but automatic login failed. Please try logging in manually.");
                }
            } else {
                // Handle registration errors with better messages
                let errorMessage = "";
                if (result.error?.includes("already exists")) {
                    errorMessage = "An account with this email or username already exists. Please try a different one or log in instead.";
                } else if (result.error?.includes("validation")) {
                    errorMessage = "Please check that all fields are filled out correctly.";
                } else {
                    errorMessage = result.error || "Registration failed. Please try again.";
                }
                setRegistrationError(errorMessage);
            }
        } catch (err) {
            console.error("Registration error:", err);
            setRegistrationError("Network error occurred. Please check your connection and try again.");
        }
        setLoading(false);
    };

    return (
        <>
            <TopNav />
            <div className='flex justify-center items-center min-h-[calc(100vh-120px)] flex-col relative px-4 py-6'>
                {loading && (
                    <div className="fixed inset-0  bg-opacity-80 flex justify-center items-center z-[9999]">
                        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6 flex flex-col justify-center items-center min-w-[200px]">
                            <CircularProgress size={40} />
                            <p className="text-sm text-gray-600 mt-3">{loadingMessage}</p>
                        </div>
                    </div>
                )}
                <div className='w-full max-w-md sm:max-w-lg bg-white p-6 sm:p-8 flex justify-center items-center flex-col rounded-xl shadow-lg'>
                    <div className='flex items-center justify-center mb-5'>
                        <LuClipboardPen size={40} color='white' className='bg-black p-2 rounded-xl mr-2' />
                        <h1 className='text-xl sm:text-2xl'>NoteSphere</h1>
                    </div>
                    <div className='flex justify-center items-center flex-col mb-5'>
                        <h1 className='text-2xl sm:text-3xl'>Sign Up</h1>
                        <p className='text-gray-400 text-sm sm:text-base'>Create your account</p>
                    </div>

                    <form
                        onSubmit={handleSubmit(handleRegister)}
                        className='flex flex-col w-full'
                    >
                        <div className='flex flex-col sm:flex-row sm:gap-4'>

                            <div className='flex-1 mb-4'>
                                <input className='bg-[#f9fafb] border border-gray-300 p-3 rounded-md w-full text-base'
                                    type="text" {...register("username", {
                                        required: "Username is required",
                                        maxLength: {
                                            value: 20,
                                            message: "Username must be at most 20 characters"
                                        }
                                    })} placeholder='Username' />
                                {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>}
                            </div>
                            <div className='flex-1 mb-4'>
                                <input className='bg-[#f9fafb] border border-gray-300 p-3 rounded-md w-full text-base'
                                    type="text" {...register("fullname", {
                                        required: "Fullname is required",
                                        maxLength: {
                                            value: 50,
                                            message: "Fullname must be at most 50 characters"
                                        }
                                    })} placeholder='Fullname' />
                                {errors.fullname && <p className='text-red-500 text-sm mt-1'>{errors.fullname.message}</p>}
                            </div>
                        </div>
                        <input className='bg-[#f9fafb] border border-gray-300 p-3 rounded-md mb-4 text-base'
                            type="text" {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Email is not valid"
                                }
                            })} placeholder="Email" />
                        {errors.email && <p className='text-red-500 text-sm mb-2'>{errors.email.message}</p>}

                        <div className='relative mb-4'>
                            <input
                                type={showPassword ? "text" : "password"}
                                className='bg-[#f9fafb] border border-gray-300 p-3 rounded-md w-full pr-12 text-base'
                                placeholder='Password'
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/,
                                        message: "Password must contain at least one letter, one number, and one special character"
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
                        {errors.password && <p className='text-red-500 text-sm mb-2'>{errors.password.message}</p>}

                        <div className='relative mb-4'>
                            <input
                                className='bg-[#f9fafb] border border-gray-300 p-3 rounded-md w-full pr-12 text-base'
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: {
                                        matchesPreviousPassword: (value) => {
                                            const { password } = watch();
                                            return password === value || "Passwords must match";
                                        }
                                    }
                                })}
                                placeholder="Confirm Password"
                            />
                            {showConfirmPassword ? (
                                <IoMdEyeOff
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
                                    aria-label="Hide confirm password"
                                    onClick={() => setShowConfirmPassword(false)}
                                />
                            ) : (
                                <IoMdEye
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
                                    aria-label="Show confirm password"
                                    onClick={() => setShowConfirmPassword(true)}
                                />
                            )}
                        </div>
                        {errors.confirmPassword && <p className='text-red-500 text-sm mb-2'>{errors.confirmPassword.message}</p>}

                        <div className='flex items-center mb-4 gap-2'>
                            <input type="checkbox" name="checkbox" id="checkbox" />
                            <label htmlFor="checkbox" className='text-sm'>I agree to the terms and conditions</label>
                        </div>

                        {registrationError && (
                            <div className='bg-red-50 border border-red-200 rounded-md p-3 mb-4'>
                                <p className='text-red-700 text-sm flex items-center'>
                                    <span className='mr-2'>⚠️</span>
                                    {registrationError}
                                </p>
                            </div>
                        )}

                        <div className='flex flex-col gap-4 items-center'>

                            <button
                                className='btn-click w-full sm:w-50 bg-black text-white p-3 rounded-md hover:bg-gray-800 transition
                            active:translate-y-1 active:scale-95 text-base font-medium'
                                type="submit">
                                Register
                            </button>
                            <p className='text-sm'>Already have an account? <Link prefetch={false} href="/login" className='text-blue-500 hover:underline'>Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Page;
