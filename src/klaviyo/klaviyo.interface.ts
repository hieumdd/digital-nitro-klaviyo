export type Metric = {
    metricId: string;
    measurement: 'count';
}

export type Account = {
    name: string;
    apiKey: string;
    metrics: Metric[];
};
