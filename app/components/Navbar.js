"use client";
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CiSearch } from 'react-icons/ci'
import { GrNotes } from 'react-icons/gr'
import { FaPlus } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa'
import { LuClipboardPen } from 'react-icons/lu'
import { signOut, useSession } from 'next-auth/react'
import { useSearch } from '../contexts/SearchContext'
import { CgProfile } from 'react-icons/cg'
import { CgLogOut } from 'react-icons/cg';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const Navbar = () => {
    const { data: session } = useSession();
    const { searchQuery, updateSearchQuery, clearSearch } = useSearch();
    const router = useRouter();
    const [selectValue, setSelectValue] = useState("");

    const handleSignOut = () => {
        signOut({
            callbackUrl: '/login',
        });
    };

    const handleSearchChange = (e) => {
        updateSearchQuery(e.target.value);
    };

    const handleSearchClear = () => {
        clearSearch();
    };

    const handleSelectChange = (value) => {
        switch (value) {
            case 'profile':
                router.push('/profile');
                break;
            case 'logout':
                handleSignOut();
                break;
            default:
                break;
        }
        // Reset the select value after action
        setTimeout(() => setSelectValue(""), 100);
    };

    return (
        <div>
            <nav className='bg-white p-4 md:p-5 rounded-2xl flex flex-col md:fixed md:h-screen md:w-72 md:items-center overflow-y-auto'>
                <div className='flex items-center justify-between md:justify-center gap-3 w-full mb-4'>
                    <div className='flex items-center'>
                        <LuClipboardPen size={36} />
                        <h1 className="text-2xl md:text-3xl font-bold">NoteSphere</h1>
                    </div>
                </div>

                {session && (
                    <div className='flex space-x-4 items-center w-full mb-4 p-3 bg-gray-50 rounded-lg'>
                        <div className=''>
                            <h1 className='text-2xl md:text-3xl font-semibold '>Welcome Back</h1>
                            <Select value={selectValue} onValueChange={handleSelectChange} className="flex-1 shadow-md">
                                <SelectTrigger className="border-none cursor-pointer ">
                                    <h1 className='text-2xl md:text-3xl font-semibold truncate'>{session.user?.name || session.user?.email}</h1>
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="profile" className="w-57 px-4 py-2 text-md cursor-pointer flex items-center gap-2 ">
                                        <CgProfile size={20} />
                                        <span>Profile</span>
                                    </SelectItem>
                                    <hr />
                                    <SelectItem value="logout" className="w-57 px-4 py-2 text-md cursor-pointer flex items-center gap-2">
                                        <CgLogOut size={20} />
                                        <span>Logout</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                <hr className='opacity-50 w-full mb-5 mt-5' />
                <div className='btn-click relative w-full mb-4 bg-[#f3f6fd] rounded-md'>
                    <CiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none text-gray-500' />
                    <input
                        type="text"
                        placeholder='Search notes...'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className='p-2 pl-10 pr-8 rounded-md w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                    />
                    {searchQuery && (
                        <button
                            onClick={handleSearchClear}
                            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                            title="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
                <div className='relative flex w-full gap-2 overflow-x-auto md:overflow-visible md:flex-col no-scrollbar'>


                    <Link prefetch={false} href="/create" className='btn-click nav-item bg-black text-white hover:bg-gray-800 transition-colors whitespace-nowrap'>
                        <FaPlus color='white' />
                        <span className='p-1'>Add New</span>
                    </Link>
                    <Link prefetch={false} href="/user" className='btn-click nav-item text-black hover:bg-gray-100 transition-colors whitespace-nowrap'>
                        <GrNotes />
                        <span className='p-1'>All Notes</span>
                    </Link>
                    <Link prefetch={false} href="/bin" className='btn-click nav-item text-black hover:bg-gray-100 transition-colors whitespace-nowrap'>
                        <FaTrash />
                        <span className='p-1'>Bin</span>
                    </Link>

                </div>

            </nav>
        </div>
    )
}

export default Navbar
