import createLocalStorageStore from './local-storage.js'

export const DEFAULT_BUCKETS = [
    {
        label: 'Default',
        items: [
            {value: 114, label: 'Perfect', color: 'gray'},
            {value: 112, label: 'Good', color: 'green'},
            {value: 108, label: 'Ok', color: 'cyan'},
            {value: 105, label: 'Lame', color: 'violet'},
            {value: 100, label: 'Bad', color: 'orange'},
            {value: 0, label: 'WTF', color: 'red'},
        ]
    },

    {
        label: 'Pandita',
        items: [
            {value: 115, label: 'Ok', color: 'gray'},
            {value: 0, label: 'Bad', color: 'red'},
        ]
    }
]

const store = createLocalStorageStore(
    'ra-settings',
    {
        theme: 'dark',
        replaysDirectory: '.\\Replays',
        stats: {
            metric: 'avg',
            chart: 'map',
        },
        mapChart: {
            types: undefined,
        },
        hitChart: {
            defaultBucket: 0,
            buckets: DEFAULT_BUCKETS
        },
    },
    state => {
        // add new fields to the settings
        return state;
    }
)

export default store