import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { load } from '../bigquery/bigquery.service';
import { Measurement } from './klaviyo.enum';
import { getClient, getMetricExport } from './klaviyo.service';

dayjs.extend(utc);

type TPipelineOptions = {
    start?: string;
    end?: string;
};

const parseDateRange = ({ start, end }: TPipelineOptions) => [
    start ? dayjs.utc(start) : dayjs.utc().subtract(1, 'year'),
    end ? dayjs.utc(end) : dayjs.utc(),
];

export const pipeline = async (options: TPipelineOptions) => {
    const [start, end] = parseDateRange(options);

    const client = getClient();

    return getMetricExport(client, {
        metricId: 'VgT4Wf',
        measurement: Measurement.COUNT,
        start,
        end,
    }).then((rows) =>
        load(rows, {
            table: 'MetricExport',
            schema: [
                { name: 'id', type: 'STRING' },
                { name: 'name', type: 'STRING' },
                { name: 'segment', type: 'STRING' },
                { name: 'date', type: 'TIMESTAMP' },
                { name: 'value', type: 'NUMERIC' },
            ],
        }),
    );
};
