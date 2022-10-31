import createLocalStorageStore from './local-storage.js'

const store = createLocalStorageStore(
    'ra-settings',
    {
        theme: 'dark',
        replaysDirectory: '.\\Replays',
        stats: {
            metric: 'avg',
        },
        mapChart: {},
        accChart: {},
    },
    state => {
        // add new fields to the settings
        return state;
    }
)

export default store