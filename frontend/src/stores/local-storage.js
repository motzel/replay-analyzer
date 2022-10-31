import {writable} from "svelte/store"

export default (key, initial = null, onStateRetrieved = null) => {
    let state = initial;

    try {
        state = JSON.parse(localStorage.getItem(key)) ?? initial
    }
    catch(err) {
        state = initial;
    }

    if (onStateRetrieved) state = onStateRetrieved(state)

    const {subscribe, set: storeSet} = writable(state)

    const set = newState => {
        localStorage.setItem(key, JSON.stringify(newState))

        state = newState;
        storeSet(newState)
    }

    return {
        subscribe,
        set,
    }
}