export const capitalize = str => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export const padNumber = (num, pad = 2) => Number.isFinite(num) ? (Array(pad).fill('0').join('') + num).slice(-pad) : '';