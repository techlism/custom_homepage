import DarkModeSwitch from "./ThemeSwitch"
import WeatherWidget from "./WeatherCard"

export default function WeatherAndThemeWidget(){
    return(
        <div className="flex border rounded-md p-4 align-middle justify-between items-center"> 
            <WeatherWidget/>
            <DarkModeSwitch/>
        </div>        
    )
}