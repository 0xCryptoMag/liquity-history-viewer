export function formatBigInt(value: bigint, precision: bigint): string {
	const negative = value < 0n;
	const absValue = negative ? -value : value;
	const intPart = absValue / precision;
	const fracPart = absValue % precision;
	if (fracPart === 0n) {
		const str = intPart.toString();
		return negative ? `-${str}` : str;
	}
	const decimals = precision.toString().length - 1;
	const fracStr = fracPart
		.toString()
		.padStart(decimals, '0')
		.replace(/0+$/, '');
	const result = `${intPart}.${fracStr}`;
	return negative ? `-${result}` : result;
}

export function formatTimestamp(timestamp: bigint): string {
	const d = new Date(Number(timestamp) * 1000);
	const month = d.toLocaleString('en-US', {
		month: 'short',
		timeZone: 'UTC'
	});
	const day = d.getUTCDate().toString().padStart(2, '0');
	const year = d.getUTCFullYear();
	const hour = d.getUTCHours();
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const hour12 = hour % 12 || 12;
	const h = hour12.toString().padStart(2, '0');
	const min = d.getUTCMinutes().toString().padStart(2, '0');
	const sec = d.getUTCSeconds().toString().padStart(2, '0');
	return `${month} ${day}, ${year} ${h}:${min}:${sec} ${ampm} UTC`;
}
