import CricketTracker from "@/components/CricketTracker";
import LinksContainer from "@/components/LinksContainer";
import SearchBar from "@/components/SearchBar";
import StockTracker from "@/components/StockTracker";
import WeatherAndThemeWidget from "@/components/WeatherAndTheme";

export default async function Home() {
  return(
	<main className="min-h-screen max-w-7xl mx-auto grid grid-cols-1 gap-4 items-center justify-center align-middle p-4">
		<SearchBar/>
		<LinksContainer />
		{/* Widgets Start */}
		<CricketTracker/>
		<WeatherAndThemeWidget/>
		<StockTracker/>
		{/* Widgets End */}
	</main>	
  )
}