import { CricbuzzMatchData } from "@/components/CricketTracker";
import axios from "axios";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

async function cricbuzz() {
    try {
        const response = await axios.request({
            method: "GET",
            url: "https://cricbuzz.com/",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
            }
        })
        const htmlResponse = response.data;
        if (htmlResponse) {
            const $ = cheerio.load(htmlResponse);
            const ulElements = $('ul.cb-col.cb-col-100.videos-carousal-wrapper.cb-mtch-crd-rt-itm li.cb-view-all-ga');
            const cbmatches : CricbuzzMatchData[] = [];

            ulElements.each((index, element) => {
                
                const href = $(element).find('a').attr('href') || "";
                const title = $(element).find('a').attr('title') || href.split("/")[1].split('-').join(' ').toUpperCase() || "";
                const team1 = $(element).find('div.cb-hmscg-tm-bat-scr span').eq(0).text();
                const score1 = $(element).find('div.cb-hmscg-tm-bat-scr .cb-ovr-flo').eq(1).text();
                const team2 = $(element).find('div.cb-hmscg-tm-bwl-scr span').eq(0).text();
                const score2 = $(element).find('div.cb-hmscg-tm-bwl-scr .cb-ovr-flo').eq(1).text();
                const result = $(element).find('div.cb-mtch-crd-state').attr('title') || '';
                const matchDetails = $(element).find('div.cb-mtch-crd-hdr div.cb-col-90').attr('title') || href.split("/")?.[3]?.split('-').join(' ').toUpperCase() || "";        
                // console.log(matchState);

                // console.log(matchDetails);
                const matchData : CricbuzzMatchData = {
                    title: title,
                    href: "https://cricbuzz.com" + href,
                    team1: team1,
                    score1: score1,
                    team2: team2,
                    score2: score2,
                    result: result,
                    matchDetails : matchDetails,    
                };
            
                cbmatches.push(matchData);
            });

            return cbmatches;
        }
    } catch (error : any) {
        return error;
    }
}

export async function GET(){
    try {
        const cricbuzzData = await cricbuzz();
        return NextResponse.json(cricbuzzData, { status: 200 });
    } catch (error : any) {
        console.trace(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}