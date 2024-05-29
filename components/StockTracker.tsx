import axios, { AxiosResponse } from "axios";
import moment from "moment-timezone";
import { Separator } from "./ui/separator";
export interface ChartResponse {
    chart: {
        result: {
            meta: {
                regularMarketPrice: number;
                chartPreviousClose: number;
            };
        }[];
    };
}

export const fetchSnP = async (): Promise<{
    regularMarketPrice: number;
    chartPreviousClose: number;
    change_percentage: string;
}> => {
    try {
        const response: AxiosResponse<ChartResponse> = await axios.get(
            "https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC"
        );
        const result = response.data.chart.result[0];

        if (result) {
            const { regularMarketPrice, chartPreviousClose } = result.meta;
            const percentage = (
                (regularMarketPrice - chartPreviousClose) /
                100
            ).toPrecision(2);
            const change_percentage =
                Number(percentage) > 0 ? `+${percentage}` : percentage;

            return {
                regularMarketPrice,
                chartPreviousClose,
                change_percentage,
            };
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        console.error(`Unable to fetch S&P.\nError: ${error}`);
        return {
            regularMarketPrice: 0,
            chartPreviousClose: 0,
            change_percentage: "",
        };
    }
};

export interface IndianMarketData {
    current_value: string;
    change_point: string;
    change_percentage: string;
    date: string;
    time: string;
    status: string;
}

let cachedSensexData: IndianMarketData | null = null;
let cachedNiftyData: IndianMarketData | null = null;
let lastFetchTimeSensex: moment.Moment | null = null;
let lastFetchTimeNifty: moment.Moment | null = null;

const fetchNewData = async (url : string, indexType : string) : Promise<IndianMarketData | null> => {
    try {
        if (url && indexType) {
            switch(indexType){
                case "sensex":
                    const response = await axios.get(url);
                    const data = response?.data["Sensex Value"];
                    let SensexData : IndianMarketData = {
                        current_value: data["current_value"],
                        change_point: data["change_point"],
                        change_percentage: data["change_percentage"],
                        date: data["date"],
                        time: data["time"],
                        status: data["status"],
                    };
                    lastFetchTimeSensex = moment.tz("Asia/Kolkata");
                    return SensexData;
                    
                case "nifty":
                    const response2 = await axios.get(url);
                    const data2 = response2?.data["Nifty Value"];
                    let NiftyData : IndianMarketData = {
                        current_value: data2["value"],
                        change_point: data2["change"],
                        change_percentage: data2["percent_change"]+"%",
                        date: data2["date"],
                        time: data2["time"],
                        status:"",
                    };
                    lastFetchTimeNifty = moment.tz("Asia/Kolkata");
                    return NiftyData;
            }        
        }
        return null;            
    } catch (error) {
        console.error(`Unable to fetch IndianMarketData.\nError: ${error}`);
        lastFetchTimeNifty = null;
        lastFetchTimeSensex = null;
        return null;
    }
};

export const fetchNiftyData = async (): Promise<IndianMarketData> => {
    const now = moment.tz("Asia/Kolkata");

    const marketOpenTime = now.clone().hour(9).minute(15).second(0); // Indian market opens at 9:15 AM
    const marketCloseTime = now.clone().hour(15).minute(30).second(0); // Indian market closes at 3:30 PM

    if (
        cachedNiftyData === null ||
        now.isBetween(marketOpenTime, marketCloseTime) ||
        (lastFetchTimeNifty !== null && now.diff(lastFetchTimeNifty, "hours") > 24)
    ) {
        // Fetch new data if no data is cached, or if the market is open, or if the cached data is more than 24 hours old
        const niftyUrl = process.env.INDIAN_STOCK_MARKET_URL_NIFTY;
        // console.log(niftyUrl);
        if(niftyUrl){
            const data = await fetchNewData(niftyUrl, "nifty");
            cachedNiftyData = data;
        }
    }

    if (cachedNiftyData === null) {
        console.error("Unable to fetch Nifty data");
        return {
            current_value: "",
            change_point: "",
            change_percentage: "",
            date: "",
            time: "",
            status: "",
        } as IndianMarketData;
    }
    return cachedNiftyData;

}

export const fetchSensexData = async (): Promise<IndianMarketData> => {
    const now = moment.tz("Asia/Kolkata");

    const marketOpenTime = now.clone().hour(9).minute(15).second(0); // Indian market opens at 9:15 AM
    const marketCloseTime = now.clone().hour(15).minute(30).second(0); // Indian market closes at 3:30 PM

    if (
        cachedSensexData === null ||
        now.isBetween(marketOpenTime, marketCloseTime) ||
        (lastFetchTimeSensex !== null && now.diff(lastFetchTimeSensex, "hours") > 24)
    ) {
        // Fetch new data if no data is cached, or if the market is open, or if the cached data is more than 24 hours old
        const sensexUrl = process.env.INDIAN_STOCK_MARKET_URL_SENSEX;
        if(sensexUrl){
            const data = await fetchNewData(sensexUrl, "sensex");
            cachedSensexData = data;
        }
    }

    if (cachedSensexData === null) {
        console.error("Unable to fetch Sensex data");
        return {
            current_value: "",
            change_point: "",
            change_percentage: "",
            date: "",
            time: "",
            status: "",
        } as IndianMarketData;
    }
    return cachedSensexData;
};

const StockTracker = async () => {
    let snpData = await fetchSnP();
    let sensexData = await fetchSensexData();
    let niftyData = await fetchNiftyData();
    return (
        <div className="border grid grid-cols-3 gap-4 items-stretch p-2 rounded-md">
            <div className="border p-2 rounded-md font-medium text-left transition-all ease-in-out transform hover:scale-105 hover:shadow-sm bg-card">
                <p className="font-semibold">S&amp;P 500</p>
                <Separator />
                <p>{snpData?.regularMarketPrice}</p>
                <p>{snpData?.change_percentage}%</p>
            </div>
            <div className="border p-2 rounded-md font-medium text-left transition-all ease-in-out transform hover:scale-105 hover:shadow-sm bg-card">
                <p className="font-semibold">Sensex</p>
                <Separator />
                <p>{sensexData?.current_value}</p>
                <p>{sensexData?.change_percentage}</p>
            </div>
            <div className="border p-2 rounded-md font-medium text-left transition-all ease-in-out transform hover:scale-105 hover:shadow-sm bg-card">
                <p className="font-semibold">Nifty</p>
                <Separator />
                <p>{niftyData?.current_value}</p>
                <p>{niftyData?.change_percentage}</p>
            </div>
        </div>
    );
};

export default StockTracker;
