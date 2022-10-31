import {derived} from "svelte/store";
import search from "./search.js";
import replays from "./replays.js";

const filteredReplays = derived([search, replays], ([$search, $replays]) => {
    return $replays
        ?.filter(r => {
            if (!$search?.value) return true;

            let passing = false

            passing ||= r?.info?.songName?.toLowerCase()?.indexOf($search?.value?.toLowerCase()) >= 0 ?? false
            passing ||= r?.info?.mapper?.toLowerCase()?.indexOf($search?.value?.toLowerCase()) >= 0 ?? false
            passing ||= r?.info?.playerName?.toLowerCase()?.indexOf($search?.value?.toLowerCase()) >= 0 ?? false

            return passing
        })
})

export default filteredReplays