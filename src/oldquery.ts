// Setup bigints to have a toJSON method for JSON.stringify()
declare global {
	interface BigInt {
		toJSON(): { $bigint: string }
	}
}

BigInt.prototype.toJSON = function () {
	return { $bigint: this.toString() };
}

import fs from 'fs/promises';
import path from 'path';

import configJson from './config.json' with { type: 'json' };
import { Address, Config } from './types.js';

const config = configJson as Config;

/**
 * @description Accepts the user inputs and returns liquidation info
 * @paramprotocol The user selected protocol
 * @paramaddress The user supplied address
 * @returns {Promise<Object<string, (string | number | bigint)[][]>>}
 */
async function query(chain: string, protocol: string, address: Address) {
	/** @type {Object<string, (string | number | bigint)[][]>} */
	let payload = {};

	// Get trove updates performed by the Trove Manager and Borrower Operations contracts, then sort them by blocknumber
	payload.troveManager = await getEventLogs(
		contracts[protocol].TM,
		protocol === 'LL' ? 'VaultUpdated' : 'TroveUpdated',
		address,
		LL_DEPLOY_BLOCK,
		'tm'
	);
	payload.borrowerOperations = await getEventLogs(
		contracts[protocol].BO,
		protocol === 'LL' ? 'VaultUpdated' : 'TroveUpdated',
		address,
		LL_DEPLOY_BLOCK,
		'bo'
	);
	payload.collateralSurplus = await getEventLogs(
		contracts[protocol].CSP,
		'CollBalanceUpdated',
		address,
		LL_DEPLOY_BLOCK,
		null
	); // @ts-ignore that other values of a[n] and b[n] can be string
	payload.troveUpdates = [
		...payload.troveManager,
		...payload.borrowerOperations
	].sort((a, b) => a[1] - b[1]);

	// Get stability pool stake updates, gets total deposits (needed to find the percentage of the pool owned by user), user balances, and all liquidation events
	// The data returned for all StabilityPoolLUSDBalanceUpdated events is a large file and can take 5-10 mins pull, at time of writing this there were 120k events
	// To handle this, an approach using a small database of previously queried values is used
	payload.totalDeposit = await updateDatabase(protocol);
	payload.userDepositUpdates = await getEventLogs(
		contracts[protocol].SP,
		'UserDepositChanged',
		address,
		LL_DEPLOY_BLOCK,
		null
	);
	payload.liquidations = await getEventLogs(
		contracts[protocol].TM,
		'Liquidation',
		null,
		LL_DEPLOY_BLOCK,
		null
	);

	return payload;

	/**
	 * @description Returns an array of EventLog arguments and blockNumbers of different events to different contracts
	 * @param {ethers.Contract} contract The contract to filter eventlogs for
	 * @param {string} eventName The name of the event to filter for
	 * @param {string?} eventIndexedArgs Address if needed to filter for the events
	 * @param {number} startBlock The block at which to start the query, for total LUSD in stability pool the output is quite large if starting from beginning
	 * @param {string?} contractAbbr Will determine whether to use the enum of the Trove Manager or the Borrower Operations
	 * @returns {Promise<(string | number | bigint)[][]>}
	 * @async
	 */
	async function getEventLogs(
		contract,
		eventName,
		eventIndexedArgs,
		startBlock,
		contractAbbr
	) {
		/** @type {ethers.DeferredTopicFilter} */
		const filter = contract.filters[eventName](eventIndexedArgs);

		/** @type {ethers.EventLog[]} */ // @ts-ignore that sometimes queryFilter gives ethers.Logs[]
		const events = await contract.queryFilter(filter, startBlock, 'latest');

		/** @type {(string | number | bigint)[][]} */
		const eventArgs = await Promise.all(
			events.map(async ({ blockNumber, transactionIndex, args }) => {
				/** @type {ethers.Block} */ // @ts-ignore block will never be null
				const block = await provider.getBlock(blockNumber);

				/** @type {Date} */ // @ts-ignore will never be null
				const datetime = block.date;

				/** @type {(string | number | bigint)[]} */
				let arr = [
					datetime,
					blockNumber,
					transactionIndex,
					...args.toArray()
				];

				if (arr[7] != undefined) {
					contractAbbr === 'tm'
						? (arr[7] = TroveManagerOperationEnum[Number(arr[7])])
						: contractAbbr === 'bo'
						? (arr[7] = BorrowerOperationEnum[Number(arr[7])])
						: undefined;
				}

				return arr;
			})
		);

		return eventArgs;
	}

	/**
	 * @description This function is just to read the log file (if it exists) of the StabilityPoolLUSDBalanceUpdated events
	 * @param {string} protocol The protocol needed to navigate to the correct file
	 * @returns {Promise<(number | bigint)[][]>}
	 * @async
	 */
	async function updateDatabase(protocol) {
		/** @type {(number | bigint)[][]} */
		let syncedLogs = [];

		try {
			syncedLogs = JSON.parse(
				await fs.readFile(
					path.resolve(
						__dirname,
						'..',
						'database',
						`${protocol}-sp-deposits-logs.json`
					),
					'utf8'
				),
				(key, value) => {
					// Tests if value being is an object with $bigint property, if so return just the value of the bigint
					if (Object.hasOwn(value, '$bigint')) {
						return BigInt(value['$bigint']);
					} else {
						return value;
					}
				}
			);
		} catch {
			syncedLogs = [];
		} finally {
			/** @type {(number | bigint)[][]} */ // @ts-ignore that getEventLogs sometimes returns string[][]
			const unsyncedLogs = await getEventLogs(
				contracts[protocol].SP,
				protocol === 'LL'
					? 'StabilityPoolUSDLBalanceUpdated'
					: 'StabilityPoolLUSDBalanceUpdated',
				null, // @ts-ignore that totalDeposit[n][2] is a bigint
				syncedLogs[syncedLogs.length - 1]?.[1] || LL_DEPLOY_BLOCK,
				null
			);

			/** @type {(number | bigint)[][]} */
			const combinedLogs = [...syncedLogs, ...unsyncedLogs];

			fs.writeFile(
				path.resolve(
					__dirname,
					'..',
					'database',
					`${protocol}-sp-deposits-logs.json`
				),
				JSON.stringify(combinedLogs, null, 2),
				'utf8'
			);

			return combinedLogs;
		}
	}
}
