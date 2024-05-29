import Link from "next/link";
import { CricbuzzMatchData } from "./CricketTracker";
import { Separator } from "./ui/separator";
export default function CricketMatchCard({matchData} : {matchData : CricbuzzMatchData}){
    return(
        <Link href={matchData.href}>
            <div className="bg-card rounded-md border p-2 hover:shadow-sm transform ease-in-out transition-all my-2">
                {matchData.matchDetails && <p className="opacity-80">{matchData.matchDetails}</p>}                
                {matchData.matchDetails && <Separator/>}
                <p className="font-semibold my-2">{matchData.title}</p>
                <div className="flex flex-row align-middle items-center">
                    <div className="mr-2 text-lg">
                        <p>{matchData.team1}</p>
                        <p>{matchData.score1}</p>
                    </div>
                    <div className="w-[2px] bg-secondary rounded-sm min-h-10 mr-2" />
                    <div className="text-lg">
                        <p>{matchData.team2}</p>
                        <p>{matchData.score2}</p>
                    </div>
                </div>
                {matchData.result && <p className="text-md text-primary">{matchData.result}</p>}
            </div>       
        </Link>
    )
}