'use client';

import { useState, useEffect } from 'react';

import { Separator } from './ui/separator';
import { ChartResponse, IndianMarketData, SnpData } from '@/lib/types';

const StockTracker = () => {
    const [snpData, setSnpData] = useState<SnpData|null>(null);
    const [sensexData, setSensexData] = useState<IndianMarketData|null>(null);
    const [niftyData, setNiftyData] = useState<IndianMarketData|null>(null);
    const [niftyError, setNiftyError] = useState<string | null>(null);
    const [sensexError, setSensexError] = useState<string | null>(null);
    const [snpError, setSnpError] = useState<string | null>(null);

    const fetchData = async (marketType: string, setData: Function , setError : Function) => {
        try {
            const response = await fetch(`/api/getStockMarketData?marketType=${marketType}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data for ${marketType}`);
            }
            const data = await response.json();
            setData(data);
        } catch (error: any) {
            setError(error?.message);
        }
    };

    useEffect(() => {
        fetchData('snp', setSnpData, setSnpError);
        fetchData('sensex', setSensexData, setSensexError);
        fetchData('nifty', setNiftyData, setNiftyError);
    }, [sensexError, niftyError, snpError]);

    if (niftyError && sensexError && snpError) {
        console.log(niftyError, sensexError, snpError);
        return(
            <div className='p-4 border rounded-md'>
                <div className="p-2 border rounded-md bg-card text-red-500">Unable to load market data right now.</div>
            </div>
        );
    }

    return (
        <div className="border grid grid-cols-3 gap-4 items-stretch p-4 rounded-md">
            <div className="border p-2 rounded-md font-medium text-left transition-all ease-in-out transform hover:scale-105 hover:shadow-sm bg-card">
                <p className="font-semibold">S&amp;P 500</p>
                <Separator />
                <p>{snpData?.regularMarketPrice}</p>
                <p className={snpData?.change_percentage.includes("-") ? "text-red-500" : "text-green-500"}>{snpData?.change_percentage}%</p>
            </div>
            <div className="border p-2 rounded-md font-medium text-left transition-all ease-in-out transform hover:scale-105 hover:shadow-sm bg-card">
                <p className="font-semibold">Sensex</p>
                <Separator />
                <p>{sensexData?.current_value}</p>
                <p className={sensexData?.change_percentage.includes("-") ? "text-red-500" : "text-green-500"}>{sensexData?.change_percentage}</p>
            </div>
            <div className="border p-2 rounded-md font-medium text-left transition-all ease-in-out transform hover:scale-105 hover:shadow-sm bg-card">
                <p className="font-semibold">Nifty</p>
                <Separator />
                <p>{niftyData?.current_value}</p>
                <p className={niftyData?.change_percentage.includes("-") ? "text-red-500" : "text-green-500"}>{niftyData?.change_percentage}</p>
            </div>
        </div>
    );
};

export default StockTracker;
