import {writable} from "svelte/store"

const createStore = (theme = 'dark') => {
    let state = theme;

    const {subscribe, set: storeSet} = writable(state)

    const set = theme => {
        if (!['light', 'dark'].includes(theme)) return state;

        state = theme;
        storeSet(state)
    }

    return {
        subscribe,
        set,
    }
}

const store = createStore();

export default store