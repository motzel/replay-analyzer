// TODO:
const getCurrentLocale = () => 'pl-PL'


export function formatTime(time) {
	if (!Number.isFinite(time)) return null;

	const rounded = Math.round(time)
	const minutes = Math.floor(rounded / 60)
	const seconds = padNumber(Math.round(rounded % 60))

	return Number.isFinite(time)
		? `${minutes}:${seconds}`
		: null
}

export function formatNumber(num, digits = 2, addSign = false, notANumber = null) {
	if (!Number.isFinite(num)) {
		return notANumber;
	}

	return (
		(addSign && num > 0 ? '+' : '') +
		num.toLocaleString(getCurrentLocale(), {
			minimumFractionDigits: digits,
			maximumFractionDigits: digits,
		})
	);
}

export const padNumber = (num, pad = 2) => (Array(pad).fill('0').join('') + num).slice(-pad);

export const round = (val, places = 2) => {
	if (!Number.isFinite(val)) return null;

	const mult = Math.pow(10, places);
	return Math.round((val + Number.EPSILON) * mult) / mult;
};

export function roundToPrecision(num, precision = 0.1) {
	return round(Math.floor(num / precision) * precision);
}
