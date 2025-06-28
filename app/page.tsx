import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gamepad2, Shield, Store, Users, Music, Trophy } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Elite Games</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/admin/signin">
                <Button>Admin Portal</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Elite Trivia Gaming
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600"> Platform</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Experience premium trivia games with comprehensive admin management, e-commerce integration, 
            and sophisticated user tier systems. Built for scalability and production deployment.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/games">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                <Trophy className="mr-2 h-5 w-5" />
                Play Games
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg">
                <Store className="mr-2 h-5 w-5" />
                Browse Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900">Platform Features</h3>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive gaming platform with advanced administration capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">RBAC Admin System</CardTitle>
                <CardDescription>
                  5-tier admin roles with granular permissions for complete platform control
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <Gamepad2 className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">Game Management</CardTitle>
                <CardDescription>
                  Straight and Nested Card trivia games with category-based question pools
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Store className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">E-commerce Platform</CardTitle>
                <CardDescription>
                  Full-featured shop for board games and merchandise with order management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">User Tier System</CardTitle>
                <CardDescription>
                  Free and Premium tiers with subscription management and exclusive features
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                  <Music className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle className="text-xl">Background Music</CardTitle>
                <CardDescription>
                  Custom music upload system with admin tracks and premium user uploads
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Analytics & Scoring</CardTitle>
                <CardDescription>
                  Comprehensive game scoring, user analytics, and performance tracking
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Admin Roles Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Administrative Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { role: 'Super Admin', desc: 'Full platform control', color: 'red' },
              { role: 'Dev Admin', desc: 'Development & content', color: 'blue' },
              { role: 'Shop Admin', desc: 'E-commerce management', color: 'green' },
              { role: 'Content Admin', desc: 'Questions & categories', color: 'purple' },
              { role: 'Customer Admin', desc: 'User support', color: 'orange' }
            ].map((admin, index) => (
              <div key={index} className={`p-6 rounded-lg border-2 border-${admin.color}-200 bg-${admin.color}-50 text-center hover:shadow-md transition-shadow`}>
                <div className={`h-12 w-12 bg-${admin.color}-500 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{admin.role}</h4>
                <p className="text-sm text-gray-600">{admin.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Elite Games</span>
              </div>
              <p className="text-gray-400">
                Premium trivia gaming platform with comprehensive admin management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/games" className="hover:text-white transition-colors">Games</Link></li>
                <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
                <li><Link href="/premium" className="hover:text-white transition-colors">Premium</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Admin</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin/signin" className="hover:text-white transition-colors">Admin Login</Link></li>
                <li><Link href="/admin/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Elite Games Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}