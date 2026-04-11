import { Home, MenuIcon, User, Utensils, Video } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useAppContext } from "../context/AppContext"

const BottomNav = () => {
  const { user } = useAppContext();
     const navitems =[
        {path:'/' ,label:'Home', icon:Home},
        {path:'/menu' ,label:'Menu', icon:MenuIcon},
        {path:'/reel' ,label:'Reel', icon:Video},
        {path:'/food' ,label:'Food', icon:Utensils},
        {path:user?.userType === 'partner' ? '/partner/profile' : '/user/profile' ,label:'Profile', icon:User},
    ]
  return (
    <nav className="bottom-nav-responsive  z-50 border border-white/45
       px-2 py-1.5 shadow-[0_10px_32px_rgba(15,23,42,0.22)] backdrop-blur-xl
       supports-backdrop-filter:bg-white/35 dark:border-white/10 dark:bg-slate-900/55 
       dark:shadow-[0_10px_30px_rgba(2,6,23,0.55)] ">
      <div className="flex items-center justify-around gap-1">
        {navitems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `group flex min-w-14 flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-[10px] font-medium tracking-tight transition-all duration-200
           ${isActive ? 'bg-white/70 text-slate-900 shadow-sm dark:bg-slate-800/80 dark:text-slate-100' : 'text-slate-600/90 hover:bg-white/40 hover:text-slate-900 dark:text-slate-300/85 dark:hover:bg-slate-800/45 dark:hover:text-slate-100'}`}>
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav