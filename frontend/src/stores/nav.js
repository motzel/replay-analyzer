import {writable} from "svelte/store"
import {router} from 'tinro';

const createStore = () => {
    let state = [];

    const {subscribe, set: storeSet} = writable(state)

    const set = newState => {
        state = newState;
        storeSet(state)
    }

    const push = url => {
        set([url, ...state])
    }

    const pop = () => {
        const url = state.shift();

        set(state);

        return url;
    }

    const replace = url => {
        if (!state.length) {
            push(url);
            return;
        }

        state[state.length - 1] = url;

        set(state);
    }

    const go = url => {
        push(url);

        router.goto(url);
    }

    const back = () => {
        const currentUrl = pop();
        const prevUrl = pop();

        router.goto(prevUrl ?? '/replays');
    }

    return {
        subscribe,
        push,
        pop,
        replace,
        go,
        back,
    }
}

const store = createStore();

export default store