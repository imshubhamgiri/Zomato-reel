import { Link } from 'react-router-dom'
import { MoonIcon, Sun, TimerReset ,  } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
const LandingPage = () => {
    const {theme, toggleTheme} = useTheme()
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">FoodReel</span>
              <span className="text-orange-500 text-xl">🍽️</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Blog</Link>
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">About us</Link>
              <button className="text-gray-700 hover:text-gray-900 font-medium">EN</button>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link to="/user/login" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 font-medium">
                Login
              </Link>
              <button className="text-2xl">🛒</button>
             <div className="mt-auto  border-slate-100 dark:border-slate-800 ">
                 <button
                     onClick={() => {toggleTheme() , console.log(theme)}}
                     className=" w-full flex items-center justify-center gap-2 rounded-lg p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                         >
                         {theme === "light" ? <MoonIcon /> : <Sun />}
                 </button>
             </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-linear-to-r from-green-50 to-orange-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 leading-tight">
                Order food online from your favourite local restaurants.
              </h1>
              
              <p className="text-gray-600 text-lg">
                Freshly made food delivered to your door.
              </p>
              
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center bg-white rounded-full px-4 py-3 border border-gray-200">
                  <span className="text-orange-500 text-xl mr-3">📍</span>
                  <input 
                    type="text" 
                    placeholder="Enter your location" 
                    className="flex-1 outline-none text-gray-700"
                  />
                </div>
                <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 font-medium transition">
                  🔍 Search
                </button>
              </div>
            </div>
            
            {/* Right Content - Image */}
            <div className="relative hidden md:block">
              <div className="bg-linear-to-br from-lime-300 to-green-400 rounded-full w-96 h-96 flex items-center justify-center mx-auto">
                <div className="text-center">
                  <div className="text-6xl mb-4">🥗</div>
                  <p className="text-green-800 font-semibold">Fresh & Healthy</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Delivery Stats */}
          <div className="mt-12 flex items-center gap-4">
            <div className="bg-orange-500 rounded-full w-12 h-12 flex items-center justify-center text-white text-xl">
              ✓
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">200k+</p>
              <p className="text-gray-600">People Delivered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-16 md:py-24 bg-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="hidden md:block">
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center h-96">
                <div className="text-6xl">🚴</div>
              </div>
            </div>
            
            {/* Right - Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-green-800">
                Being confused in choosing food? Try scrolling through food reels and choose what you are craving for😋
              </h2>
              
              <p className="text-gray-600 text-lg">
                Discover restaurant recommendations from our community. See trending dishes, read reviews from other users, and find exactly what you're in the mood for.
              </p>
              
              <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 font-medium text-lg transition inline-flex items-center gap-2">
                👉 Explore
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wide selection of restaurants
              </h3>
              <p className="text-gray-600">
                We offer a wide selection of restaurants, shop our diverse stores and choose what you love.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Easy ordering process
              </h3>
              <p className="text-gray-600">
                We offer the fastest delivery, all orders all items, quick and easy through the app or via website.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition flex flex-col items-center">
              <div className="text-5xl mb-4 "><TimerReset className='size-8 text-emerald-300'/></div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fast delivery
              </h3>
              <p className="text-gray-600">
                We offer the fastest delivery, all orders all items, quick and easy through the app or via website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-linear-to-r from-purple-300 via-gray-10 to-orange-900 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to order your favorite food?
          </h2>
          <Link to="/user/login" className="bg-white text-green-600 px-8 py-3 rounded-full hover:bg-gray-100 font-bold text-lg inline-block transition">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
