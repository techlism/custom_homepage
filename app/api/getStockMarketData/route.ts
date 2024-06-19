import axios, { AxiosResponse } from 'axios';
import moment from 'moment-timezone';
import { NextResponse } from 'next/server';
import { ChartResponse, IndianMarketData, SnpData } from "@/lib/types";

const fetchSnP = async (): Promise<SnpData> => {
  try {
    const response: AxiosResponse<ChartResponse> = await axios.get(
      "https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC"
    );
    const result = response.data.chart.result[0];

    if (result) {
      const { regularMarketPrice, chartPreviousClose } = result.meta;
      const percentage = (
        (regularMarketPrice - chartPreviousClose) /
        chartPreviousClose * 100
      ).toPrecision(2);
      const change_percentage =
        Number(percentage) > 0 ? `+${percentage}%` : `${percentage}%`;

      return {
        regularMarketPrice,
        chartPreviousClose,
        change_percentage,
      } as SnpData;
    } else {
      throw new Error("Unable to fetch S&P 500 data");
    }
  } catch (error : any) {
    throw new Error(`Unable to fetch S&P 500 data.\nError: ${error?.message}`);
  }
};

let cachedSensexData: IndianMarketData | null = null;
let cachedNiftyData: IndianMarketData | null = null;
let lastFetchTimeSensex: moment.Moment | null = null;
let lastFetchTimeNifty: moment.Moment | null = null;

const fetchNewData = async (url: string, indexType: string): Promise<IndianMarketData | null> => {
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
    console.error(`Unable to fetch ${indexType} data.\nError: ${error}`);
    return null;
  }
};

const fetchNiftyData = async (): Promise<IndianMarketData> => {
  const now = moment.tz("Asia/Kolkata");
  const marketOpenTime = now.clone().hour(9).minute(15).second(0);
  const marketCloseTime = now.clone().hour(15).minute(30).second(0);

  if (
    cachedNiftyData === null ||
    now.isBetween(marketOpenTime, marketCloseTime) ||
    (lastFetchTimeNifty !== null && now.diff(lastFetchTimeNifty, "hours") > 24)
  ) {
    const niftyUrl = process.env.INDIAN_STOCK_MARKET_URL_NIFTY;
    if (niftyUrl) {
      cachedNiftyData = await fetchNewData(niftyUrl, "nifty");
      lastFetchTimeNifty = now;
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
};

const fetchSensexData = async (): Promise<IndianMarketData> => {
  const now = moment.tz("Asia/Kolkata");
  const marketOpenTime = now.clone().hour(9).minute(15).second(0);
  const marketCloseTime = now.clone().hour(15).minute(30).second(0);

  if (
    cachedSensexData === null ||
    now.isBetween(marketOpenTime, marketCloseTime) ||
    (lastFetchTimeSensex !== null && now.diff(lastFetchTimeSensex, "hours") > 24)
  ) {
    const sensexUrl = process.env.INDIAN_STOCK_MARKET_URL_SENSEX;
    if (sensexUrl) {
      cachedSensexData = await fetchNewData(sensexUrl, "sensex");
      lastFetchTimeSensex = now;
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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const marketType = url.searchParams.get('marketType');

  if (!marketType) {
    return NextResponse.json({ error: 'Market type is required' }, { status: 400 });
  }

  try {
    let data;
    switch (marketType.toLowerCase()) {
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
        return NextResponse.json({ error: 'Invalid market type' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error : any) {
    return NextResponse.json({ error: error?.message || "An error occured" }, { status: 500 });
  }
}
