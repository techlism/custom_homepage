'use client'
// import axios from "axios";
// import * as cheerio from 'cheerio';
// import CricketMatchCard from "./CricketMatchCard";
// import { ScrollArea } from "./ui/scroll-area";
import { CricbuzzMatchData } from "@/lib/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useState } from "react";
import CricketMatchCard from "./CricketMatchCard";

// async function fetchCricbuzzHTML() {
//     try {
//         const response = await axios.request({
//             method: "GET",
//             url: "https://cricbuzz.com/",
//             headers: {
//                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
//                 "Cache-Control": "no-cache",
//                 "Pragma": "no-cache",
//                 "Expires": "0"
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching with Axios:', error);
//     }
// }

// async function cricbuzz() {
//     const htmlResponse =  await fetchCricbuzzHTML();

//     if (htmlResponse) {
//         const $ = cheerio.load(htmlResponse);
//         const ulElements = $('ul.cb-col.cb-col-100.videos-carousal-wrapper.cb-mtch-crd-rt-itm li.cb-view-all-ga');
//         const cbmatches: CricbuzzMatchData[] = [];

//         ulElements.each((index, element) => {
//             const href = $(element).find('a').attr('href') || "";
//             const title = $(element).find('a').attr('title') || href.split("/")[1].split('-').join(' ').toUpperCase() || "";
//             const team1 = $(element).find('div.cb-hmscg-tm-bat-scr span').eq(0).text();
//             const score1 = $(element).find('div.cb-hmscg-tm-bat-scr .cb-ovr-flo').eq(1).text();
//             const team2 = $(element).find('div.cb-hmscg-tm-bwl-scr span').eq(0).text();
//             const score2 = $(element).find('div.cb-hmscg-tm-bwl-scr .cb-ovr-flo').eq(1).text();
//             const result = $(element).find('div.cb-mtch-crd-state').attr('title') || '';
//             const matchDetails = $(element).find('div.cb-mtch-crd-hdr div.cb-col-90').attr('title') || href.split("/")?.[3]?.split('-').join(' ').toUpperCase() || "";

//             const matchData: CricbuzzMatchData = {
//                 title: title,
//                 href: "https://cricbuzz.com" + href,
//                 team1: team1,
//                 score1: score1,
//                 team2: team2,
//                 score2: score2,
//                 result: result,
//                 matchDetails: matchDetails,
//             };

//             cbmatches.push(matchData);
//         });

//         return cbmatches;
//     }
// }


function useCricbuzzData() {
    const [cricbuzzData, setCricbuzzData] = useState<CricbuzzMatchData[] | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getCricbuzzData() {
            try {
                const response = await fetch("/api/getCricbuzzData");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setCricbuzzData(data);
            } catch (error : any) {
                setError(error?.message || 'Error fetching data');
            }
        }

        getCricbuzzData();
    }, []);

    return { cricbuzzData, error };
}

export default function CricketTracker() {
    const { cricbuzzData, error } = useCricbuzzData();

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <ScrollArea className="grid grid-cols-1 w-full px-4 py-2 border rounded-md m-auto items-center align-middle">
            {cricbuzzData ? (
                cricbuzzData.map((match, index) => (
                    <CricketMatchCard key={index} matchData={match} />
                ))
            ) : (
                <div className="text-lg text-pretty text-primary">{'Loading...'}</div>
            )}
        </ScrollArea>
    );
}
