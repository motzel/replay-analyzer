import {writable} from "svelte/store"

const createStore = () => {
    let state = {
        value: '',
        global: true,
    };

    const {subscribe, set: storeSet} = writable(state)

    const set = newState => {
        state = newState;
        storeSet(state)
    }

    const updateValue = value => set({...state, value})

    const enableGlobal = () => set({...state, global: true})
    const disableGlobal = () => set({...state, global: false})

    return {
        subscribe,
        updateValue,
        enableGlobal,
        disableGlobal,
    }
}

const store = createStore();

export default store