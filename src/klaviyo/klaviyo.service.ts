import axios, { AxiosInstance } from 'axios';
import axiosThrottle from 'axios-request-throttle';
import { Dayjs } from 'dayjs';

import { Measurement } from './klaviyo.enum';

export const getClient = () => {
    const client = axios.create({
        baseURL: 'https://a.klaviyo.com/api/v1',
        params: { api_key: process.env.KLAVIYO_API_KEY || '' },
    });

    axiosThrottle.use(axios, { requestsPerSecond: 8 });

    return client;
};

type TMetricExportRequest = {
    metricId: string;
    start: Dayjs;
    end: Dayjs;
    measurement: Measurement;
};

type TMetricExportResponse = {
    metric: {
        id: string;
        name: string;
    };
    results: {
        segment: string;
        data: {
            date: string;
            values: number[];
        }[];
    }[];
};

const METRIC_COUNT = 10000;

export const getMetricExport = (
    client: AxiosInstance,
    { metricId, start, end, measurement }: TMetricExportRequest,
) =>
    client
        .request<TMetricExportResponse>({
            url: `/metric/${metricId}/export`,
            params: {
                start: start.format('YYYY-MM-DD'),
                end: end.format('YYYY-MM-DD'),
                measurement,
                count: METRIC_COUNT,
            },
        })
        .then((res) => res.data)
        .then((res) => {
            const { id, name } = res.metric;

            return res.results.flatMap(({ segment, data }) =>
                data.map(({ date, values }) => ({
                    id,
                    name,
                    segment,
                    date,
                    value: values.pop(),
                })),
            );
        });
