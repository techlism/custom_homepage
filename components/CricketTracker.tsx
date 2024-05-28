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
}

async function cricbuzz() {
    try {
        const response = await axios.get('https://cricbuzz.com');
        const htmlResponse = response.data;

        if (htmlResponse) {
            const $ = cheerio.load(htmlResponse);
            const ulElements = $('ul.cb-col.cb-col-100.videos-carousal-wrapper.cb-mtch-crd-rt-itm');
            const cbmatches : CricbuzzMatchData[] = [];
            ulElements.each((index, element) => {
                const title = $(element).find('a').attr('title');
                const href = $(element).find('a').attr('href') || "";
                const team1 = $(element).find('div.cb-hmscg-tm-bat-scr span').eq(0).text();
                const score1 = $(element).find('div.cb-hmscg-tm-bat-scr .cb-ovr-flo').eq(1).text();
                const team2 = $(element).find('div.cb-hmscg-tm-bwl-scr span').eq(0).text();
                const score2 = $(element).find('div.cb-hmscg-tm-bwl-scr .cb-ovr-flo').eq(1).text();
                const result = $(element).find('div.cb-mtch-crd-state').text() || '';
                const matchDetails = $(element).find('div.cb-mtch-crd-hdr div.cb-col-90').attr('title') || "";
                // console.log(matchDetails);
                const matchData : CricbuzzMatchData = {
                    title: title || "",
                    href: "https://cricbuzz.com" + href,
                    team1: team1,
                    score1: score1,
                    team2: team2,
                    score2: score2,
                    result: result,
                    matchDetails : matchDetails
                };
            
                cbmatches.push(matchData);
            });

            return cbmatches;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export default async function CricketTracker() {
    const cricbuzzData = await cricbuzz();
    return(
        <ScrollArea className="grid grid-cols-1 w-full h-[155px] p-2 border rounded-md m-auto">
            {cricbuzzData?.map((match, index) => (<CricketMatchCard key={index} matchData={match} />))}
        </ScrollArea>
    )

}
