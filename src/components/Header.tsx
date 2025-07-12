import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="w-full bg-[#18181b] shadow-sm sticky top-0 z-50 border-b border-gray-700">
      <nav className="container mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white">
            <span className="inline-block w-8 h-8 bg-primary-600 rounded-full mr-2"></span>
            ReWear
          </Link>
          <Link href="/" className="hover:text-primary-400 text-gray-200 transition-colors ml-4">Home</Link>
          {user && (
            <>
              <Link href="/dashboard" className="hover:text-primary-400 text-gray-200 transition-colors">Dashboard</Link>
              <Link href="/create-listing" className="hover:text-primary-400 text-gray-200 transition-colors">Create Listing</Link>
            </>
          )}
        </div>
        {/* Search Bar (disabled/hidden for now) */}
        {/* <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-md px-2 py-1 border border-gray-700 w-72">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-100 flex-1 px-2 py-1 placeholder-gray-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="text-gray-400 hover:text-primary-400 px-2">
            <span aria-label="Search" role="img">🔍</span>
          </button>
        </form> */}
        <div className="flex gap-4 items-center ml-4">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1 rounded hover:bg-primary-50 border border-primary-100 bg-gray-900 text-white">
                <span className="inline-block w-7 h-7 bg-primary-200 rounded-full text-primary-700 flex items-center justify-center font-bold">
                  {user.name ? user.name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : "")}
                </span>
                <span className="hidden md:inline text-gray-200">{user.name || user.email || ""}</span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-primary-50"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="hover:text-primary-400 text-gray-200 transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-primary-400 text-gray-200 transition-colors border border-primary-600 rounded px-3 py-1 ml-2">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
} 