export interface IItineraryActivity {
    time: string;
    activity: string;
    location: string;
    estimated_cost: string;
    notes: string;
}

export interface IItineraryDay {
    day: number;
    theme: string;
    activities: IItineraryActivity[];
}

export interface IAIPlanOutput {
    destination: string;
    duration: number;
    total_budget_estimate: number;
    days: IItineraryDay[];
    budget_breakdown: Record<string, string>;
    tips: string[];
    best_time_to_visit: string;
}

export interface ICreateItinerary {
    destinationId: string;
    title: string;
    totalDays: number;
    budgetEstimate: number;
    travelStyle: string;
    preferences?: string;
    startDate?: string; // ISO date string
}

export interface IPromptParseOutput {
    destination?: string;
    totalDays?: number;
    budgetEstimate?: number;
    travelStyle?: string;
    preferences?: string;
}

