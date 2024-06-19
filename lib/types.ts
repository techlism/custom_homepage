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

export interface IndianMarketData {
    current_value: string;
    change_point: string;
    change_percentage: string;
    date: string;
    time: string;
    status: string;
}

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

export interface SnpData {
    regularMarketPrice: number;
    chartPreviousClose: number;
    change_percentage: string;
}