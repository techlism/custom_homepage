import axios from "axios";
import * as cheerio from 'cheerio';
import CricketMatchCard from "./CricketMatchCard";
import { ScrollArea } from "./ui/scroll-area";
import puppeteer from 'puppeteer';

export interface CricbuzzMatchData {
    title: string;
    href: string;
    team1: string;
    score1: string;
    team2: string;
    score2: string;
    result: string;
    matchDetails: string;
    matchState?: string | undefined;
}

async function fetchWithAxios() {
    try {
        const response = await axios.request({
            method: "GET",
            url: "https://cricbuzz.com/",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
                "Expires": "0"
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching with Axios:', error);
    }
}

async function fetchWithPuppeteer() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://cricbuzz.com/', { waitUntil: 'networkidle2' });
        const content = await page.content();
        await browser.close();
        return content;
    } catch (error) {
        console.error('Error fetching with Puppeteer:', error);
    }
}

async function cricbuzz() {
    const usePuppeteer = true; // Toggle this to switch between Axios and Puppeteer
    const htmlResponse = usePuppeteer ? await fetchWithPuppeteer() : await fetchWithAxios();

    if (htmlResponse) {
        const $ = cheerio.load(htmlResponse);
        const ulElements = $('ul.cb-col.cb-col-100.videos-carousal-wrapper.cb-mtch-crd-rt-itm li.cb-view-all-ga');
        const cbmatches: CricbuzzMatchData[] = [];

        ulElements.each((index, element) => {
            const href = $(element).find('a').attr('href') || "";
            const title = $(element).find('a').attr('title') || href.split("/")[1].split('-').join(' ').toUpperCase() || "";
            const team1 = $(element).find('div.cb-hmscg-tm-bat-scr span').eq(0).text();
            const score1 = $(element).find('div.cb-hmscg-tm-bat-scr .cb-ovr-flo').eq(1).text();
            const team2 = $(element).find('div.cb-hmscg-tm-bwl-scr span').eq(0).text();
            const score2 = $(element).find('div.cb-hmscg-tm-bwl-scr .cb-ovr-flo').eq(1).text();
            const result = $(element).find('div.cb-mtch-crd-state').attr('title') || '';
            const matchDetails = $(element).find('div.cb-mtch-crd-hdr div.cb-col-90').attr('title') || href.split("/")?.[3]?.split('-').join(' ').toUpperCase() || "";

            const matchData: CricbuzzMatchData = {
                title: title,
                href: "https://cricbuzz.com" + href,
                team1: team1,
                score1: score1,
                team2: team2,
                score2: score2,
                result: result,
                matchDetails: matchDetails,
            };

            cbmatches.push(matchData);
        });

        return cbmatches;
    }
}

export default async function CricketTracker() {
    const cricbuzzData = await cricbuzz();
    return (
        <ScrollArea className="grid grid-cols-1 w-full h-[175px] px-4 py-2 border rounded-md m-auto items-center align-middle">
            {cricbuzzData?.map((match, index) => (<CricketMatchCard key={index} matchData={match} />))}
        </ScrollArea>
    );
}
