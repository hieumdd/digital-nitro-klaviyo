import { pipelines } from './pipeline.service';

const pipelineCases: [string, [string, string] | [undefined, undefined]][] = [
    // ['auto', [undefined, undefined]],
    [`manual`, ['2022-01-01', '2022-11-01']],
];

describe('Pipeline', () => {
    it.each(pipelineCases)('Service %p', async (_, [start, end]) => {
        return pipelines({ start, end })
            .then((insights) => {
                console.log(insights);
            })
            .catch((err) => {
                console.log(err);
                return Promise.reject(err);
            });
    });
});
