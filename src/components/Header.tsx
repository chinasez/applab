'use client'
import { useRouter } from "next/navigation";


export default function Header() {
    const router = useRouter();
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">/</span>
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">AppLab</span>
          </div>


          <div className="flex items-center space-x-4">
            <button onClick={() => router.push('/auth/login')} className="cursor-pointer btn-secondary">Login</button>
            <button onClick={() => router.push('/auth/register')} className="cursor-pointer btn-primary">Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  );
}