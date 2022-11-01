import { Account } from './klaviyo.interface';

export const accounts: Account[] = [
    {
        name: 'BallpointMarketing',
        apiKey: process.env.BALLPOINT_MARKETING_KLAVIYO_API_KEY || '',
        metrics: [{ metricId: 'VgT4Wf', measurement: 'count' }],
    },
    {
        name: 'CallPorter',
        apiKey: process.env.CALL_PORTER_KLAVIYO_API_KEY || '',
        metrics: [{ metricId: 'W5cFCi', measurement: 'count' }],
    },
];
