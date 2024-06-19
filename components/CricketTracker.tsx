"use client";

import { CricbuzzMatchData } from "@/lib/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useState, useMemo } from "react";
import CricketMatchCard from "./CricketMatchCard";

export default function CricketTracker() {
    const [cricbuzzData, setCricbuzzData] = useState<
        CricbuzzMatchData[] | undefined
    >(undefined);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getCricbuzzData() {
            try {
                const response = await fetch("/api/getCricbuzzData");
                if (!response.ok) {
                    throw new Error("Bad Network Response");
                }
                const data = await response.json();
                setCricbuzzData(data);
            } catch (error: any) {
                setError(error?.message || "Error fetching data");
            }
        }

        getCricbuzzData();
    }, [error]);

    const memoizedCricbuzzData = useMemo(() => cricbuzzData, [cricbuzzData]);

    if (error) {
        return <div className="p-4 border rounded-md bg-card text-red-500">Error: {error}</div>;
    }

    return (
        <ScrollArea className="grid grid-cols-1 w-full px-4 py-2 border rounded-md m-auto items-center align-middle">
            {memoizedCricbuzzData ? (
                memoizedCricbuzzData.map((match, index) => (
                    <CricketMatchCard key={index} matchData={match} />
                ))
            ) : (
                <div className="text-lg text-pretty text-primary">
                    {"Loading..."}
                </div>
            )}
        </ScrollArea>
    );
}
