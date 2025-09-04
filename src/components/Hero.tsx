'use client'
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple CRM for
            <span className="text-blue-600"> Modern Teams</span>
          </h1>
          

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Manage your customers, track deals, and grow your business with our intuitive CRM platform.
          </p>


          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => router.push('/auth/login')} className="cursor-pointer btn-primary px-8 py-4 text-lg">
              Get Started Free
            </button>
          </div>


          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Management</h3>
              <p className="text-gray-600 text-sm">Organize all customer information in one place</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sales Pipeline</h3>
              <p className="text-gray-600 text-sm">Track deals through every stage of your funnel</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile Access</h3>
              <p className="text-gray-600 text-sm">Work from anywhere with our mobile app</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}