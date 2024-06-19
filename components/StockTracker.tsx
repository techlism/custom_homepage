'use client';

import { useState, useEffect } from 'react';
import { Separator } from './ui/separator';
import { IndianMarketData, SnpData } from '@/lib/types';
import { RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';

const fetchSnP = async (): Promise<SnpData> => {
    try {
        const response = await axios.get("https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC");
        const result = response.data.chart.result[0];
        console.log(result);
        if (result) {
            const { regularMarketPrice, chartPreviousClose } = result.meta;
            const percentage = ((regularMarketPrice - chartPreviousClose) / chartPreviousClose * 100).toPrecision(2);
            const change_percentage = Number(percentage) > 0 ? `+${percentage}%` : `${percentage}%`;

            return { regularMarketPrice, chartPreviousClose, change_percentage } as SnpData;
        } else {
            throw new Error("Unable to fetch S&P 500 data");
        }
    } catch (error: any) {
        throw new Error(`Unable to fetch S&P 500 data.\nError: ${error?.message}`);
    }
};

const fetchNewData = async (url: string, indexType: string): Promise<IndianMarketData> => {
    try {
        const response = await axios.get(url);
        const data = indexType === "sensex" ? response?.data["Sensex Value"] : response?.data["Nifty Value"];
        const commonData: IndianMarketData = {
            current_value: data["current_value"] || data["value"],
            change_point: data["change_point"] || data["change"],
            change_percentage: data["change_percentage"] || data["percent_change"] + "%",
            date: data["date"],
            time: data["time"],
            status: data["status"] || "",
        };
        return commonData;
    } catch (error) {
        throw new Error(`Unable to fetch ${indexType} data.\nError: ${error}`);
    }
};

const fetchNiftyData = async (): Promise<IndianMarketData> => {
    const niftyUrl = process.env.NEXT_PUBLIC_INDIAN_STOCK_MARKET_URL_NIFTY;
    console.log(niftyUrl);
    if (niftyUrl) {
        return await fetchNewData(niftyUrl, "nifty");
    } else {
        throw new Error("Nifty URL is not defined");
    }
};

const fetchSensexData = async (): Promise<IndianMarketData> => {
    const sensexUrl = process.env.NEXT_PUBLIC_INDIAN_STOCK_MARKET_URL_SENSEX;
    console.log(sensexUrl);
    if (sensexUrl) {
        return await fetchNewData(sensexUrl, "sensex");
    } else {
        throw new Error("Sensex URL is not defined");
    }
};

const StockTracker = () => {
    const [snpData, setSnpData] = useState<SnpData | null>(null);
    const [sensexData, setSensexData] = useState<IndianMarketData | null>(null);
    const [niftyData, setNiftyData] = useState<IndianMarketData | null>(null);
    const [niftyError, setNiftyError] = useState<string | null>(null);
    const [sensexError, setSensexError] = useState<string | null>(null);
    const [snpError, setSnpError] = useState<string | null>(null);

    const fetchData = async (marketType: string, setData: Function, setError : Function) => {
        try {
            let data;
            switch (marketType) {
                case 'snp':
                    data = await fetchSnP();
                    break;
                case 'sensex':
                    data = await fetchSensexData();
                    break;
                case 'nifty':
                    data = await fetchNiftyData();
                    break;
                default:
                    throw new Error(`Invalid market type: ${marketType}`);
            }
            setData(data);
        } catch (error: any) {
            setError(error?.message || `Unable to fetch ${marketType} data`);
        }
    };

    useEffect(() => {
        fetchData('snp', setSnpData, setSnpError);
        fetchData('sensex', setSensexData, setSensexError);
        fetchData('nifty', setNiftyData, setNiftyError);
    }, [snpError, sensexError, niftyError]);

    if (snpError && sensexError && niftyError) {
        return (
            <div className='p-4 border rounded-md'>
                <div className="p-2 border rounded-md bg-card text-red-500">Unable to load market data right now.</div>
            </div>
        );
    }

    function fetchAllDataManually() {
        fetchData('snp', setSnpData, setSnpError);
        fetchData('sensex', setSensexData, setSensexError);
        fetchData('nifty', setNiftyData, setNiftyError);
    }

    return (
        <div className="border flex justify-between gap-4 items-stretch p-4 rounded-md">
            <div className="border p-2 rounded-md font-medium text-left transition-all ease-in-out transform hover:scale-105 hover:shadow-sm bg-card w-[29%]">
                <p className="font-semibold">S&amp;P 500</p>
                <Separator className='my-2' />
                <p>{snpData?.regularMarketPrice}</p>
                <p className={snpData?.change_percentage.includes("-") ? "text-red-500" : "text-green-500"}>{snpData?.change_percentage}</p>
            </div>
            <div className="border p-2 rounded-md font-medium text-left transition-all ease-in-out transform hover:scale-105 hover:shadow-sm bg-card w-[29%]">
                <p className="font-semibold">Sensex</p>
                <Separator className='my-2' />
                <p>{sensexData?.current_value}</p>
                <p className={sensexData?.change_percentage.includes("-") ? "text-red-500" : "text-green-500"}>{sensexData?.change_percentage}</p>
            </div>
            <div className="border p-2 rounded-md font-medium text-left transition-all ease-in-out transform hover:scale-105 hover:shadow-sm bg-card w-[29%]">
                <p className="font-semibold">Nifty</p>
                <Separator className='my-2' />
                <p>{niftyData?.current_value}</p>
                <p className={niftyData?.change_percentage.includes("-") ? "text-red-500" : "text-green-500"}>{niftyData?.change_percentage}</p>
            </div>
            <div className="border p-2 rounded-md font-medium bg-card flex justify-center items-center align-middle w-[11.3%]">
                <Button onClick={fetchAllDataManually} className='bg-transparent hover:bg-transparent text-primary hover:opacity-85'>
                    <RefreshCcw size={35} />
                </Button>
            </div>
        </div>
    );
};

export default StockTracker;
