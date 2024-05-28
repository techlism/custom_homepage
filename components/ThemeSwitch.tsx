"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react" ;
import { useTheme } from "next-themes"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

import { Button } from "./ui/button"

const DarkModeSwitch = () =>{  
  const { theme, setTheme } = useTheme();

  const changeTheme = () => {
    setTimeout(() => {
      if(theme === 'light') setTheme('dark');
      else if(theme === 'dark') setTheme('light');
    }, 150);
  
  }

  return(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-[9%] flex justify-center align-middle items-center min-h-[90px] p-2 rounded-md border bg-card">
            <button onClick={changeTheme} className="transition-colors bg-transparent
              border-0 hover:bg-transparent">
            { theme==='light' ? 
              <Moon size={35} />
              :
              <Sun size={35} />
            }
          </button>
          </div>    

        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {theme==='dark' ? 'Light' : 'Dark'} mode</p>
        </TooltipContent>
        </Tooltip>
    </TooltipProvider>   
  )
}
export default DarkModeSwitch;