"use client";
import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { AiFillHome } from 'react-icons/ai'
const Topbar = ({ heading }) => {
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({
            callbackUrl: '/',
            redirect: true
        });
    };

    return (
        <div className='flex items-center justify-between gap-3'>
            <div className='flex-1 h-20 bg-white p-3 rounded-xl flex items-center gap-2 mb-8'>
                <h1 className='text-gray-700 text-xl'>{heading}</h1>
            </div>
            {/* <div className='flex items-center gap-2 mb-8'>
                {session && (
                    <Link href='/' className='btn-click flex items-center h-20 text-white bg-blue-500 hover:bg-blue-600 transition-colors w-20 justify-center rounded-2xl'>
                        <AiFillHome size={24} />
                    </Link>
                )}

                {session && (
                    <button
                        onClick={handleSignOut}
                        className='btn-click flex items-center h-20 bg-red-500 hover:bg-red-600 transition-colors w-20 justify-center rounded-2xl'
                        title="Sign Out"
                    >
                        <FiLogOut size={24} color="white" />
                    </button>
                )}
            </div> */}

            <div>
                
            </div>
        </div>
    )
}

export default Topbar
