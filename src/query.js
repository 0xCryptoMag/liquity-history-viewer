/**
 * @file Handles the blockchain interactions
 */
//@ts-check

const ethers = require('ethers');
const abi = require('./abi.json'); // only includes VaultUpdated and TroveUpdated events

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
const plsDec = 18;
/** @type {number} */
const plsxDec = 18;
/** @type {number} */
const hexDec = 8;



// ---------- ETHERS INSTANTIATIONS ---------- //

/** @type {ethers.JsonRpcProvider | ethers.WebSocketProvider} */
const provider = RPC_URL.includes('http') ? 
    new ethers.JsonRpcProvider(RPC_URL) :
    new ethers.WebSocketProvider(RPC_URL);


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
 * @returns {Promise<Object>}
 */
async function query(protocol, address) {
    /** @type {Object} */
    let payload = {};

    // Get trove updates
    payload.troveManager = await getEventLogs(
        contracts[protocol].TM,
        protocol === 'LL' ? 'VaultUpdated' : 'TroveUpdated',
        address,
        18971002,
        'tm'
    );
    payload.borrowerOperations = await getEventLogs(
        contracts[protocol].BO,
        protocol === 'LL' ? 'VaultUpdated' : 'TroveUpdated',
        address,
        18971002,
        'bo'
    );
    payload.troveUpdates = [...payload.troveManager, ...payload.borrowerOperations].sort((a, b) => a[0] - b[0]);

    // Get stability pool stake updates
    payload.totalDepositUpdates = await getEventLogs(
        contracts[protocol].SP,
        protocol === 'LL' ? 'StabilityPoolUSDLBalanceUpdated' : 'StabilityPoolLUSDBalanceUpdated',
        null,
        18971002,
        null
    );
    payload.userDepositUpdates = await getEventLogs(
        contracts[protocol].SP,
        'UserDepositChanged',
        null,
        18971002,
        null
    );
    payload.liquidations = await getEventLogs(
        contracts[protocol].TM,
        'Liquidation',
        null,
        18971002,
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
        const eventArgs = events.map(({ blockNumber, args }) => {
            /** @type {(string | number | bigint)[]} */
            let arr = [blockNumber, ...args.toArray()];

            // Replace the uint8 _operation with the operation enumberated name for trove updates
            if (arr[5]) {
                tmORbo === 'tm' ?
                    arr[5] = TroveManagerOperationEnum[arr[5].toString()] : tmORbo === 'bo' ?
                    arr[5] = BorrowerOperationEnum[arr[5].toString()] : undefined
            }

            return arr;
        });

        return eventArgs;
    }
}

query('LL', '0x777bdf41A2E53b635843b92845A1f326647eBDE2')

module.exports = query;