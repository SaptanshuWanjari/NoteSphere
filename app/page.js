import TopNav from './components/TopNav'
import Link from 'next/link'
import Note from './components/Note'
import { CiCalendar } from 'react-icons/ci'
import { FaRegClipboard, FaCamera, FaStar, FaRegStar } from 'react-icons/fa'
import { CiSettings } from 'react-icons/ci'
import { HiDotsHorizontal } from 'react-icons/hi'

export default function Home() {
  const SAMPLE_NOTE_HTML = `
    <h1>Getting started</h1>
    <p>Welcome! Create notes with rich formatting, star favorites, and find them instantly.</p>
    <h3>Tips</h3>
    <ul>
      <li>Use headings, lists, quotes, and code.</li>
      <li>Archive notes to keep your space tidy.</li>
      <li>Deleted notes move to Bin and can be restored.</li>
    </ul>
  `;

  return (
    <>
      <TopNav />
      {/* Hero */}
      <section className="rounded-2xl bg-white p-8 md:p-12 mb-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-block px-3 py-1 rounded-md bg-[#f3f6fd] border border-[#eee] text-xs tracking-wide text-black mb-4">Simple, fast, delightful</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-black">Your thoughts, neatly organized</h1>
            <p className="text-gray-600 text-lg mt-4">A lightweight notes experience that keeps focus on what matters—writing and recalling your ideas.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link prefetch={false} href="/register" className="btn-click bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition active:translate-y-1 active:scale-95">Create free account</Link>
              <Link prefetch={false} href="/login" className="btn-click bg-[#f3f6fd] text-black px-6 py-3 rounded-md border border-[#eee] hover:bg-white transition">Sign in</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-black border border-[#eee]"></span> No clutter</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-black border border-[#eee]"></span> Private by default</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-black border border-[#eee]"></span> Works everywhere</div>
            </div>
          </div>

          <div>
            <div className="rounded-xl p-1 bg-[#f3f6fd]">
              <div className="rounded-xl bg-white p-6">
                {/* App Header Mockup */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-black">Your Notes</h3>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded text-black">All Notes (3)</span>
                    <span className="px-2 py-1 text-gray-500">Archived</span>
                    <span className="px-2 py-1 text-gray-500">Favorites</span>
                  </div>
                </div>
                
                {/* Notes Grid Mockup */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Note 1 */}
                  <div className="bg-[#f9f9f9] rounded-lg p-4 border-b-4 border-[#87baf5] group hover:bg-[#87baf5] transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-1 border rounded w-6 h-6 flex items-center justify-center">
                        <CiCalendar size={14} />
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar size={10} className="text-yellow-500" />
                        <HiDotsHorizontal size={12} className="text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-sm mb-2 group-hover:text-white">Meeting Notes</h4>
                    <p className="text-xs text-gray-600 group-hover:text-white line-clamp-2">Discussed project timeline and upcoming deadlines...</p>
                    <div className="text-xs text-gray-500 group-hover:text-white mt-2">Dec 15</div>
                  </div>
                  
                  {/* Note 2 */}
                  <div className="bg-[#f9f9f9] rounded-lg p-4 border-b-4 border-[#8ac3a3] group hover:bg-[#8ac3a3] transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-1 border rounded w-6 h-6 flex items-center justify-center">
                        <FaRegClipboard size={12} />
                      </div>
                      <div className="flex items-center gap-1">
                        <FaRegStar size={10} className="text-gray-400" />
                        <HiDotsHorizontal size={12} className="text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-sm mb-2 group-hover:text-white">Shopping List</h4>
                    <p className="text-xs text-gray-600 group-hover:text-white line-clamp-2">• Groceries • Coffee • Office supplies...</p>
                    <div className="text-xs text-gray-500 group-hover:text-white mt-2">Dec 14</div>
                  </div>
                  
                  {/* Note 3 */}
                  <div className="bg-[#f9f9f9] rounded-lg p-4 border-b-4 border-[#f0864a] group hover:bg-[#f0864a] transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-1 border rounded w-6 h-6 flex items-center justify-center">
                        <FaCamera size={12} />
                      </div>
                      <div className="flex items-center gap-1">
                        <FaRegStar size={10} className="text-gray-400" />
                        <HiDotsHorizontal size={12} className="text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-sm mb-2 group-hover:text-white">Photo Ideas</h4>
                    <p className="text-xs text-gray-600 group-hover:text-white line-clamp-2">Sunset shots, city architecture, street photography...</p>
                    <div className="text-xs text-gray-500 group-hover:text-white mt-2">Dec 13</div>
                  </div>
                  
                  {/* Note 4 */}
                  <div className="bg-[#f9f9f9] rounded-lg p-4 border-b-4 border-[#88d8b0] group hover:bg-[#88d8b0] transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-1 border rounded w-6 h-6 flex items-center justify-center">
                        <CiSettings size={14} />
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar size={10} className="text-yellow-500" />
                        <HiDotsHorizontal size={12} className="text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-bold text-sm mb-2 group-hover:text-white">Project Setup</h4>
                    <p className="text-xs text-gray-600 group-hover:text-white line-clamp-2">Environment variables, database config...</p>
                    <div className="text-xs text-gray-500 group-hover:text-white mt-2">Dec 12</div>
                  </div>
                </div>
                
                <p className="text-gray-500 text-sm mt-4 text-center">Rich formatting, color themes, and instant search—all in a clean interface.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implemented features */}
      {/* <section className="rounded-2xl bg-white p-8 mb-10">
        <h3 className="text-2xl font-semibold text-black mb-4">Implemented features</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-gray-700">
          {[
            'Rich text editor (headings, lists, quotes, code)',
            'Instant search across your notes',
            'Favorites to pin important notes',
            'Archive / Unarchive for organization',
            'Bin with restore and permanent delete',
            'View and Edit modals for quick actions',

          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-black border border-[#eee]"></span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section> */}

      {/* How it works */}
      <section className="rounded-2xl bg-white p-8 md:p-10 mb-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-black mb-2">How it works</h3>
          <p className="text-gray-600">Three simple steps to organized thinking</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[#87baf5] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h4 className="text-lg font-semibold text-black mb-2">Write</h4>
            <p className="text-gray-600">Capture thoughts with rich formatting. Add headings, lists, code blocks, and more with our intuitive editor.</p>
          </div>
          
          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[#8ac3a3] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h4 className="text-lg font-semibold text-black mb-2">Organize</h4>
            <p className="text-gray-600">Use colors, favorites, and archive to keep everything tidy. Star important notes and archive old ones.</p>
          </div>
          
          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-[#f0864a] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h4 className="text-lg font-semibold text-black mb-2">Find</h4>
            <p className="text-gray-600">Instant search across all your notes. Find what you need in seconds, not minutes.</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link prefetch={false} href="/register" className="btn-click bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition active:translate-y-1 active:scale-95">Start writing for free</Link>
        </div>
      </section>

      {/* Stats strip */}
      <section className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="rounded-xl bg-white p-6 text-center">
          <p className="text-3xl font-bold text-black">2x</p>
          <p className="text-gray-600">Faster capture speed</p>
        </div>
        <div className="rounded-xl bg-white p-6 text-center">
          <p className="text-3xl font-bold text-black">99.9%</p>
          <p className="text-gray-600">Sync reliability</p>
        </div>
        <div className="rounded-xl bg-white p-6 text-center">
          <p className="text-3xl font-bold text-black">0</p>
          <p className="text-gray-600">Learning curve</p>
        </div>
      </section>

      {/* Feature snippets */}
      <section className="rounded-2xl bg-white p-8 mb-10">
        <h3 className="text-2xl font-semibold text-black mb-4">Quick feature snippets</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#eee] p-4">
            <p className="text-black font-medium mb-3">Instant search</p>
            <div className="rounded-md bg-[#f3f6fd] border border-[#eee] p-3">
              <div className="h-10 rounded-md bg-white border border-[#eee] flex items-center px-3 text-gray-500">Type to filter…</div>
              <div className="mt-3 grid gap-2">
                <div className="h-3 rounded bg-white border border-[#eee]"></div>
                <div className="h-3 rounded bg-white border border-[#eee]"></div>
                <div className="h-3 rounded bg-white border border-[#eee]"></div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#eee] p-4">
            <p className="text-black font-medium mb-3">Rich formatting</p>
            <div className="rounded-md bg-[#f3f6fd] border border-[#eee] p-3">
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 rounded bg-white border border-[#eee] text-xs">B</span>
                <span className="px-2 py-1 rounded bg-white border border-[#eee] italic text-xs">I</span>
                <span className="px-2 py-1 rounded bg-white border border-[#eee] underline text-xs">U</span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Bold</strong>, <em>italic</em>, and <u>underline</u> with lists and quotes.</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#eee] p-4">
            <p className="text-black font-medium mb-3">Trash & restore</p>
            <div className="rounded-md bg-[#f3f6fd] border border-[#eee] p-3">
              <div className="grid gap-2">
                <div className="h-3 rounded bg-white border border-[#eee]"></div>
                <div className="h-3 rounded bg-white border border-[#eee]"></div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 rounded-md bg-black text-white text-xs">Restore</span>
                <span className="px-2 py-1 rounded-md bg-white border border-[#eee] text-xs">Delete</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[#eee] p-4">
            <p className="text-black font-medium mb-3">Secure login</p>
            <div className="rounded-md bg-[#f3f6fd] border border-[#eee] p-3">
              <div className="grid gap-2">
                <div className="h-10 rounded-md bg-white border border-[#eee]"></div>
                <div className="h-10 rounded-md bg-white border border-[#eee]"></div>
              </div>
              <div className="mt-3 h-8 rounded-md bg-black text-white text-xs flex items-center justify-center">Sign in</div>
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="rounded-2xl bg-white p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-black">Start capturing your best ideas</h2>
            <p className="text-gray-600">Join free and sync across your devices.</p>
          </div>
          <div className="flex gap-3">
            <Link prefetch={false} href="/register" className="btn-click bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition active:translate-y-1 active:scale-95">Get started</Link>
            <Link prefetch={false} href="/login" className="btn-click bg-[#f3f6fd] text-black px-6 py-3 rounded-md border border-[#eee] hover:bg-white transition">I already have an account</Link>
          </div>
        </div>
      </section>
    </>
  )
}
