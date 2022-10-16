export const LAYERS_COUNT = 3
export const LINES_COUNT = 4

export const getPositionIdx = (lineLayer, lineIdx) => {
    if (!Number.isFinite(lineLayer) || !Number.isFinite(lineIdx)) return null;

    let idx = (LAYERS_COUNT - 1 - lineLayer) * LINES_COUNT + lineIdx;
    if (idx < 0 || idx > LAYERS_COUNT * LINES_COUNT - 1) idx = 0;

    return idx;
}