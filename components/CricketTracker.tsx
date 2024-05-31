// we will be using api.cricapi.com
import axios from "axios";
import * as cheerio from 'cheerio' ;
import CricketMatchCard from "./CricketMatchCard";
import { ScrollArea } from "./ui/scroll-area";

export interface CricbuzzMatchData {
    title: string;
    href: string;
    team1: string;
    score1: string;
    team2: string;
    score2: string;
    result: string;
    matchDetails : string;
    matchState? : string | undefined;
}

async function getCricbuzzData(){
    try {
        const response  = await axios.get('https://homepage.techlism.in/api/getCricbuzzData');
        console.log(response.data);
        return response.data as CricbuzzMatchData[];
    } catch (error) {
        return [];
    }
}

export default async function CricketTracker() {
    const cricbuzzData = await getCricbuzzData();
    return(
        <ScrollArea className="grid grid-cols-1 w-full h-[165px] p-2 border rounded-md m-auto items-center align-middle">
            {cricbuzzData?.map((match, index) => (<CricketMatchCard key={index} matchData={match} />))}
        </ScrollArea>
    )

}
