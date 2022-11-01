import axios, { AxiosInstance } from 'axios';
import axiosThrottle from 'axios-request-throttle';
import { Dayjs } from 'dayjs';

import { Metric } from './klaviyo.interface';

export const getClient = (apiKey: string) => {
    const client = axios.create({
        baseURL: 'https://a.klaviyo.com/api/v1',
        params: { api_key: apiKey },
    });

    axiosThrottle.use(axios, { requestsPerSecond: 8 });

    return client;
};

type TMetricExportRequest = Metric & {
    start: Dayjs;
    end: Dayjs;
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
        })
        .catch((err) => {
            axios.isAxiosError(err) && console.log(err.response?.data);
            return Promise.reject(err);
        });
