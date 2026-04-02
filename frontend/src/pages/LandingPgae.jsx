import { Link } from 'react-router-dom'
import { ArrowBigDown, ArrowDown, ChevronDown, ChevronUp, LocationEditIcon, MoonIcon, Search, Sun, TimerReset ,  } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useState, useRef, useEffect } from 'react'
const LandingPage = () => {
    const {theme, toggleTheme} = useTheme()
    const [city , setCity] = useState('Bangalore')
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const cities = ['Bangalore', 'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad']

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

  return (
    <>
    <div className="min-h-screen bg-linear-to-b from-gray-50 relative  to-white">
      {/* Header/Navigation */}
      <header className="bg-white border-b bg-linear-to-r dark:from-stone-800 dark:to-black transition-colors duration-200 border-gray-200 dark:border-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
           <div className='flex flex-col text-gray-500 dark:text-gray-400 gap-1'>
            <div className='flex items-center gap-2'>
              <span><LocationEditIcon size={16} /></span>Location</div>
            <div className='hover:scale-100 relative' ref={dropdownRef}>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className='city-selector-btn'
              >
                <span className='city-text'>{city}</span>
                {isOpen ? <ChevronUp size={16} className='shrink-0' /> : <ChevronDown size={16} className='shrink-0' />}
              </button>
              
              {isOpen && (
                <div 
                  className='absolute top-full left-0 mt-2 w-48 bg-gray-900/40 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden z-50 max-h-40 overflow-y-auto dropdown-scroll'
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {cities.map((cityName) => (
                    <button
                      key={cityName}
                      onClick={() => {
                        setCity(cityName)
                        setIsOpen(false)
                      }}
                      className='w-full text-left px-3 py-2 text-white hover:bg-gray-800/50 transition-colors duration-150'
                    >
                      {cityName}
                    </button>
                  ))}
                </div>
              )}
            </div>
           </div>
            
            <nav className="hidden md:flex items-center dark:text-white gap-8">
              <Link to="/" className="text-gray-700 dark:text-white hover:text-gray-900 font-medium">Home</Link>
              <Link to="/blog" className="text-gray-700 dark:text-white hover:text-gray-900 font-medium">Blog</Link>
              <Link to="/" className="text-gray-700 dark:text-white hover:text-gray-900 font-medium">About us</Link>
              <button className="text-gray-700 dark:text-white hover:text-gray-900 font-medium">EN</button>
            </nav>
            
            <div className="flex items-center gap-4">
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
      <section className="bg-linear-to-r from-green-50 px-5 to-orange-50 dark:from-stone-800 dark:to-black transition-colors duration-300 py-12 md:py-20">
        <div className='w-full z-50 max-w-2xl mb-5 mx-auto'>
          <div className='flex relative items-center gap-2 text-sm w-full  text-black dark:text-gray-50 mb-3'>
            <input type="text" className=' bg-gray-400 dark:supports-backdrop-filter:bg-white/10 p-4 opacity-95 backdrop-blur-xl pl-10 rounded-3xl w-full 
            max-w-2xl outline-0 focus:ring-2 focus:ring-blue-500' placeholder='Search for restaurants or dishes...' />
            <Search className='size-5 text-gray-500 absolute left-3 dark:text-gray-400' />
          </div>
        </div>
        <div className="max-w-7xl  pb-5 relative flex flex-col gap-5 rounded-2xl p-2.5 px-4  bg-amber-300 sm:px-6 lg:px-8">
          <div className='flex flex-col gap-3 '>
          <h1 className='font-semibold text-xl'>Gonna be A Good Day!</h1> 
            <span className='flex flex-col text-sm text-gray-700 dark:text-gray-800'>
              Free delivery for all orders above ₹500. Use code <span className='font-bold'>FREEDOM</span> at checkout. Hurry, offer ends soon!
            </span>
          </div>
            <button className='bg-black text-white font-medium p-2 w-fit rounded-xl'>
              Order Now
            </button>
            <div className='text-center right-1 top-10 opacity-75'>
              <img src="/foodpng.png" className='size-35' alt="noimg" />
            </div>
          </div>
      </section>

      {/* Explore Section */}
      <section className="py-16 md:py-24 bg-yellow-50 dark:bg-stone-900 transition-colors duration-300  ">
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
      <section className="bg-gray-50 py-16 md:py-24 dark:bg-stone-800 transition-colors duration-300">
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
      <section className=" dark:bg-black  py-16 text-center">
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
    </>
  )
}

export default LandingPage
