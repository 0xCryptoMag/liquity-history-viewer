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
import { type AddressLike } from 'ethers';

import configJson from './config.json' with { type: 'json' };
import { Config, Protocol, QueryPayload } from '../types/types.js'

const config = configJson as Config;                                                                                  

/**
 * Returns formatted data on liquidations, redemptions, and updates
 * @param chain The abbreviation for the chain
 * @param protocol The protocol to perform the query on
 * @param address The address 
 */
export default async function query(
    targetChain: string,
    targetProtocol: string,
    address: AddressLike
): Promise<QueryPayload> {
    const payload: QueryPayload = {};
	const protocol = await Protocol.create(
		config[targetChain].protocols[targetProtocol],
		config[targetChain].rpc
	)

	await getUserEventLogs(payload)


	payload.totalDeposits = await updateDatastore()
}

/**
 * Obtains the trove update events logs for the user
 * @param chain The abbreviation for the chain
 * @param payload The payload object to append user logs to
 */
async function getUserEventLogs(
	chain: string,
	payload: QueryPayload
): Promise<void> {
	payload.troveManagerTroveUpdated = await getEventLogs()
	payload.borrowerOperationsTroveUpdated = await getEventLogs()
	payload.collateralSurplusCollUpdatedBalance = await getEventLogs()
	payload.borrowerOperationsTroveCreated
	payload.combinedTroveUpdated = [
		...payload.troveManagerTroveUpdated,
		...payload.borrowerOperationsTroveUpdated
	].sort((a, b) => a[1] - b[1])
}

/**
 * The app keeps the logs of ALL stability pool deposits for all users.
 * The effects of liquidations on stability pool depositors are based on the
 * users ownership percentage of the pool, so all deposits must be known
 * @param chain The abbreviation for the chain
 * @param protocol The protocol to update the logs for
 */
async function getSharedHistoricalLogs(
	chain: string,
	protocol: string
): Promise<void> {
	let syncedLogs = {
		troveLiquidations: [],
		stabPoolLUSDBalance:
	};

	try {
		syncedLogs = JSON.parse(
			await fs.readFile(
				path.resolve(
					__dirname,
					'..',
					'datastore',
					chain,
					`${protocol}-total-sp-deposits.json`
				),
				'utf-8'
			),
			(key, val) => {
				if (!Object.hasOwn(val, '$bigint')) return val;

				return BigInt(val['$bigint']);
			}
		);
	} catch {
		syncedLogs = [];
	} finally {
		unsyncedLogs = await getEventLogs()
	}
}

async function getEventLogs()