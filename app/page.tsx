import LinksContainer from "@/components/LinksContainer";
import SearchBar from "@/components/SearchBar";
import WidgetContainer from "@/components/WidgetsContainer";

export default async function Home() {
  return(
	<div className="min-h-screen max-w-7xl mx-auto grid grid-cols-1 items-center justify-center align-middle p-4">
		<SearchBar/>
		{/* <div className="grid grid-cols-2 items-center align-middle justify-center lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 w-full mx-auto"> */}
			<LinksContainer />
			<WidgetContainer/>		
		{/* </div> */}
	</div>	
  )
}