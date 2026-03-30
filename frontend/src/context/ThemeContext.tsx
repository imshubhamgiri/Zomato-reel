import { createContext, useContext, useEffect, useState } from "react";


const ThemeContext = createContext({
    theme:'light',
    toggleTheme:()=>{}
});

export function ThemeProvider({ children }: {children: React.ReactNode}) {
    const [theme, settheme] = useState(()=> localStorage.getItem('theme')|| 
    window.matchMedia("(prefers-color-scheme:dark)").matches?"dark" : "light")

    useEffect(() => {
     const root = window.document.documentElement;
     if (theme === 'dark') {
       root.classList.add('dark');
     } else {
       root.classList.remove('dark');
     }
     localStorage.setItem('theme', theme);
    }, [theme])
    
    const toggleTheme =()=>{
        settheme((prev) => (prev === "light" ? "dark" : "light"))
    }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );

}

export function useTheme(){
  const context = useContext(ThemeContext);
  if(context === undefined){
      throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
