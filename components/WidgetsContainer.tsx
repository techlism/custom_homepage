import CricketTracker from "./CricketTracker";
import StockTracker from "./StockTracker";
import DarkModeSwitch from "./ThemeSwitch";
import WeatherWidget from "./WeatherCard";

export default function WidgetContainer(){
    return(
        <div className="grid grid-cols-1 items-center gap-4 w-full">
            <div className="flex border rounded-md p-2 align-middle justify-between items-center"> 
                <WeatherWidget/>
                <DarkModeSwitch/>
            </div>
            
            <CricketTracker/>
            <StockTracker/>
        </div>
    )
}