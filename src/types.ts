type Mode = "live" | "range";

export interface Config {
    auth: {
        id: number;
        hash: string;
    };

    app: {
        mode: Mode;
        channelIds: string[];
        startDate?: string;
        endDate?: string;
    };
}

export interface Message {
    id: number;
    date: number;
    channel: string;
    content: string;
    hasMedia: boolean;
    views: number;
    reactions: number;
}