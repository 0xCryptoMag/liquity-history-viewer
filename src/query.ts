// Setup bigints to have a toJSON method for JSON.stringify()
declare global {
	interface BigInt {
		toJSON(): { $bigint: string };
	}
}

BigInt.prototype.toJSON = function () {
	return { $bigint: this.toString() };
};

import fs from 'fs/promises';
import path from 'path';

import configJson from './config.json' with { type: 'json' };
import { Address, Config, QueryPayload } from './types.js'

const config = configJson as Config;

/** Returns formatted data on liquidations, redemptions, and updates */
export default async function query(
    chain: string,
    protocol: string,
    address: Address
): Promise<QueryPayload> {
    const payload: QueryPayload = {}
}