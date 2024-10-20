/**
 * @file Handles the blockchain interactions, querying event logs and formatting it for consumption
 */
//@ts-check

const ethers = require('ethers');
const abi = require('./abi.json'); // only includes VaultUpdated and TroveUpdated events
const fs = require('fs').promises;
const path = require('path');


// Create a toJSON method on bigint types for JSON serialization
BigInt.prototype['toJSON'] = function () {
    return { $bigint: this.toString() };
}


// ---------- CONSTANTS ---------- //

/**
 * @description This script uses G4mm4's rpc, but any RPC can be chosen
 * @type {string}
 */
const RPC_URL = 'wss://rpc-pulsechain.g4mm4.io'

// These are the TroveManager contracts for the different protocols
/** @type {string} */
const LL_TROVE_MANAGER = '0xd79bfb86fa06e8782b401bc0197d92563602d2ab';
/** @type {string} */
const EP_TROVE_MANAGER = '0x118b7cf595f6476a18538eaf4fbecbf594338b39';
/** @type {string} */
const FP_TROVE_MANAGER = '0xc2d0720721d48ce85e20dc9e01b8449d7edd14ce';

// These are the BorrowerOperations contracts for the different protocols
/** @type {string } */
const LL_BORROWER_OPERATIONS = '0xa09bB56B39D652988C7E7d3665aA7EC7308BbF09';
/** @type {string } */
const EP_BORROWER_OPERATIONS = '0x9861Ad36e1FcF4AE780E438fd101CaB93e1039F1';
/** @type {string } */
const FP_BORROWER_OPERATIONS = '0x5b8575BD870a06a88FD6a2E4C68A66b2F74628Cb';

// These are the StabilityPool contracts for the different protocols
/** @type {string} */
const LL_STABILITY_POOL = '0x7bfd406632483ad00c6edf655e04de91a96f84bc';
/** @type {string} */
const EP_STABILITY_POOL = '0x02e842db8d6c78d17cf8146009fb864094d95319';
/** @type {string} */
const FP_STABILITY_POOL = '0x271f576fd6de465231320a0f9997acb0c8b97e07';

/** @type {number} */
const LL_DEPLOY_BLOCK = 18971002;



// ---------- ETHERS INSTANTIATIONS ---------- //

/** @type {ethers.JsonRpcProvider | ethers.WebSocketProvider} */
const provider = RPC_URL.includes('wss') 
    ? new ethers.WebSocketProvider(RPC_URL)
    : new ethers.JsonRpcProvider(RPC_URL);


/** @type {Object<string, Object<string, ethers.Contract>>} */
const contracts = {
    LL: {
        TM: new ethers.Contract(LL_TROVE_MANAGER, abi, provider),
        BO: new ethers.Contract(LL_BORROWER_OPERATIONS, abi, provider),
        SP: new ethers.Contract(LL_STABILITY_POOL, abi, provider)
    },
    EP: {
        TM: new ethers.Contract(EP_TROVE_MANAGER, abi, provider),
        BO: new ethers.Contract(EP_BORROWER_OPERATIONS, abi, provider),
        SP: new ethers.Contract(EP_STABILITY_POOL, abi, provider)
    },
    FP: {
        TM: new ethers.Contract(FP_TROVE_MANAGER, abi, provider),
        BO: new ethers.Contract(FP_BORROWER_OPERATIONS, abi, provider),
        SP: new ethers.Contract(FP_STABILITY_POOL, abi, provider)
    }
}

// These enums are from the solidity docs and will tell what type of operation was performed on the trove
/** @type {string[]} */
const TroveManagerOperationEnum = [
    'applyPendingRewards',
    'liquidateInNormalMode',
    'liquidateInRecoveryMode',
    'redeemCollateral'
];

/** @type {string[]} */
const BorrowerOperationEnum = [
    'openTrove',
    'closeTrove',
    'adjustTrove'
];



// ---------- FUNCTIONS ---------- //

/**
 * @description Accepts the user inputs and returns liquidation info
 * @param {string} protocol The user selected protocol
 * @param {string} address The user supplied address
 * @returns {Promise<Object<string, (string | number | bigint)[][]>>}
 */
async function query(protocol, address) {
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
    ); // @ts-ignore that other values of a[n] and b[n] can be string
    payload.troveUpdates = [...payload.troveManager, ...payload.borrowerOperations].sort((a, b) => a[1] - b[1]);


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
     * @param {string?} tmORbo Will determine whether to use the enum of the Trove Manager or the Borrower Operations
     * @returns {Promise<(string | number | bigint)[][]>}
     * @async
     */
    async function getEventLogs(contract, eventName, eventIndexedArgs, startBlock, tmORbo) {
        /** @type {ethers.DeferredTopicFilter} */
        const filter = contract.filters[eventName](eventIndexedArgs);
    
        /** @type {ethers.EventLog[]} */ // @ts-ignore that sometimes queryFilter gives ethers.Logs[]
        const events = await contract.queryFilter(filter, startBlock, 'latest');
        
        /** @type {(string | number | bigint)[][]} */
        const eventArgs = await Promise.all(
            events.map(async ({ blockNumber, args }) => {
                const datetime = await getDateFromBlock(blockNumber);
    
                /** @type {(string | number | bigint)[]} */
                let arr = [datetime, blockNumber, ...args.toArray()];
    
                if (arr[6] != undefined) {
                    tmORbo === 'tm'
                        ? arr[6] = TroveManagerOperationEnum[Number(arr[6])]
                        : tmORbo === 'bo'
                        ? arr[6] = BorrowerOperationEnum[Number(arr[6])]
                        : undefined;
                }
    
                return arr;
            })
        );
    
        return eventArgs;
    }
    
    /**
     * @description Gets the UTC date of a block
     * @param {number} blockNumber The block to get the date of
     * @returns {Promise<string>}
     * @async
     */
    async function getDateFromBlock(blockNumber) {
        const block = await provider.getBlock(blockNumber); // @ts-ignore block will never be null
        
        return block.date;
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
            syncedLogs = JSON.parse(await fs.readFile(path.resolve(__dirname, '..', 'database', `${protocol}-sp-deposits-logs.json`), 'utf8'), (key, value) => {
                // Tests if value being parsed is a string and if the string contains only numbers ending in 'n'
                if (Object.hasOwn(value, '$bigint')) {
                    return BigInt(value['$bigint']);
                } else {
                    return value;
                }
            });
        } catch {
            syncedLogs = [];
        } finally {    
            /** @type {(number | bigint)[][]} */ // @ts-ignore that getEventLogs sometimes returns string[][]
            const unsyncedLogs = await getEventLogs(
                contracts[protocol].SP,
                protocol === 'LL' ? 'StabilityPoolUSDLBalanceUpdated' : 'StabilityPoolLUSDBalanceUpdated',
                null, // @ts-ignore that totalDeposit[n][2] is a bigint
                syncedLogs[syncedLogs.length - 1]?.[1] || LL_DEPLOY_BLOCK,
                null
            );
        
            /** @type {(number | bigint)[][]} */
            const combinedLogs = [...syncedLogs, ...unsyncedLogs];
        
            fs.writeFile(path.resolve(__dirname, '..', 'database', `${protocol}-sp-deposits-logs.json`), JSON.stringify(combinedLogs, null, 2), 'utf8');
        
            return combinedLogs;
        }
    }
} query('FP', '0x777bdf41A2E53b635843b92845A1f326647eBDE2')

module.exports = query;