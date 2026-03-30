import { Activity,  Home, User,  Utensils,  Video } from "lucide-react"
import { NavLink } from "react-router-dom"

const BottomNav = () => {
     const navitems =[
        {path:'/' ,label:'Home', icon:Home},
        {path:'/food' ,label:'Food', icon:Utensils},
        {path:'/reel' ,label:'Reel', icon:Video},
        {path:'/activity' ,label:'Activity', icon:Activity},
        {path:'/profile' ,label:'Profile', icon:User},
    ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 pb-safe
    px-4 border-t border-slate-100 dark:border-slate-800 lg:hidden transition-colors duration-200">
      <div className="flex justify-around">
        {navitems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-2 text-sm font-medium rounded-2xl transition-all duration-200
           ${isActive ? 'text-green-600 dark:text-green-400' : 'text-white'} hover:text-foreground`}>
            <item.icon className="w-5 h-5" />
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav