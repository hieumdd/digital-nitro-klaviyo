import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { load } from '../bigquery/bigquery.service';
import { accounts } from './account.const';
import { getClient, getMetricExport } from './klaviyo.service';

dayjs.extend(utc);

const parseDateRange = ({ start, end }: TPipelineOptions) => [
    start ? dayjs.utc(start) : dayjs.utc().subtract(1, 'year'),
    end ? dayjs.utc(end) : dayjs.utc(),
];

type TPipelineOptions = {
    start?: string;
    end?: string;
};

export const pipelines = async (options: TPipelineOptions) => {
    const [start, end] = parseDateRange(options);

    return Promise.all(accounts.map(async (account) => {
        const client = getClient(account.apiKey);

        return Promise.all(
            account.metrics.map(({ metricId, measurement }) =>
                getMetricExport(client, { metricId, measurement, start, end }),
            ),
        )
            .then((rows) => rows.flat())
            .then((rows) =>
                load(rows, {
                    table: `MetricExport__${account.name}`,
                    schema: [
                        { name: 'id', type: 'STRING' },
                        { name: 'name', type: 'STRING' },
                        { name: 'segment', type: 'STRING' },
                        { name: 'date', type: 'TIMESTAMP' },
                        { name: 'value', type: 'NUMERIC' },
                    ],
                }),
            );

    }));    
};
