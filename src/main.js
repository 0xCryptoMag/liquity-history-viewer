/**
 * @file Handles the web page rendering
 */

/** @type {string} */
const currentVersion = '1.0.0';

/** @type {Object<string, number>} */
const decimals = {
    LL: 18,
    EP: 18,
    FP: 8
}


// ---------- EVENT LISTENERS ---------- //

document.addEventListener('DOMContentLoaded', () => {
    const troveTableReset = document.querySelector('.trove-updates').innerHTML;
    const stabilityPoolTableReset = document.querySelector('.stability-pool-updates').innerHTML;

    const updateHeader = document.getElementById('update-header');
    const updateText = document.getElementById('update-text');

    creatSubmitHandler(troveTableReset, stabilityPoolTableReset);
    
    fetch('https://api.github.com/repos/0xCryptoMag/liquity-history-viewer/releases/latest')
        .then(response => response.json())
        .then(latestVersion => {
            latestVersion = latestVersion.tag_name.replace(/^v/, '');
            const latestParts = latestVersion.split('.').map(Number);
            const currentParts = currentVersion.split('.').map(Number);
            let newerVersionAvailable = false;

            for (let i = 0; i < latestParts.length; i++) {
                if (latestParts[i] > (currentParts[i] || 0)) {
                    newerVersionAvailable = true;
                }
            }

            if (newerVersionAvailable) {
                updateHeader.textContent = 'New Version Availabe';
                updateText.textContent = 'Check https://github.com/0xCryptoMag/liquity-history-viewer for new version'
            }
        })
        .catch(error => console.error('Failed to check for new app version', error));
});

/**
 * @description Creates an event listener for the submit button that begins the blockchain query
 * @param {string} troveTableReset The reset state of the trove table
 * @param {string} stabilityPoolTableReset The reset state of the stability pool table
 */
function creatSubmitHandler(troveTableReset, stabilityPoolTableReset) {
    const button = document.getElementById('submit');

    button.addEventListener('click', async (event) => {
        event.preventDefault();

        button.textContent = 'Loading...';
        button.disabled = 'true';

        const troveTable = document.getElementById('trove-updates');
        const stabilityPoolTable = document.getElementById('stability-pool-updates');
        troveTable.innerHTML = troveTableReset;
        stabilityPoolTable.innerHTML = stabilityPoolTableReset;

        const port = window.location.port;
    
        const protocol = document.getElementById('protocol').value;
        const address = document.getElementById('address').value;

        const serverQuery = new URLSearchParams();
        serverQuery.append('protocol', protocol);
        serverQuery.append('address', address);

        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            alert('Please enter a valid address');

            button.textContent = 'Submit';
            button.disabled = false;
            
            return;
        }

        fetch(`http://localhost:${port}/index?${serverQuery.toString()}`)
            .then(response => response.text())
            .then(text => JSON.parse(text, (key, value) => {
                if (Object.hasOwn(value, '$bigint')) {
                    return BigInt(value['$bigint']);
                } else {
                    return value;
                }
            }))
            .then(queryData => {
                displayTroveData(queryData, protocol);
                displayStabilityPoolData(queryData, protocol);

                button.textContent = 'Submit';
                button.disabled = false;
            })
            .catch(error => console.error('Could not complete query', error));
    });
}



// ---------- DISPLAY FUNCTIONS ---------- //

/**
 * @description Takes the blockchain query data and inserts the data into the Trove Updates table
 * @param {Object<string, (string | number | bigint)[][]>} queryData An object with all the event info
 * @param {string} protocol The protocol queried
 */
function displayTroveData(queryData, protocol) {
    const troveTable = document.getElementById('trove-updates');

    const troveData = queryData.troveUpdates;
    
    troveData.forEach((log, ind, arr) => {
        const collChangeAmount = log[5] - (arr?.[ind - 1]?.[5] || 0n);
        const debtChangeAmount = log[4] - (arr?.[ind - 1]?.[4] || 0n);

        
        const row = document.createElement('tr');

        const datetime = document.createElement('td');
        datetime.textContent = log[0].toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' });
        row.appendChild(datetime);

        const block = document.createElement('td');
        block.textContent = log[1];
        row.appendChild(block);

        const collAfter = document.createElement('td');
        collAfter.textContent = formatDecimals(log[5], decimals[protocol], false);
        row.appendChild(collAfter);

        const collChange = document.createElement('td');
        collChange.textContent = formatDecimals(collChangeAmount, decimals[protocol], false);
        row.appendChild(collChange);

        const debtAfter = document.createElement('td');
        debtAfter.textContent = formatDecimals(log[4], decimals[protocol], false);
        row.appendChild(debtAfter);

        const debtChange = document.createElement('td');
        debtChange.textContent = formatDecimals(debtChangeAmount, decimals[protocol], false);
        row.appendChild(debtChange);

        const operation = document.createElement('td');
        operation.textContent = log[7];
        row.appendChild(operation);

        troveTable.appendChild(row);
    });
}

/**
 * @description Takes the blockchain query data and inserts the data into the Stability Pool Updates table
 * @param {Object<string, (string | number | bigint)[][]>} queryData An object with all the event info
 * @param {string} protocol The protocol queried
 */
function displayStabilityPoolData(queryData, protocol) {
    const stabilityPoolTable = document.getElementById('stability-pool-updates');

    const totalDeposits = queryData.totalDeposit;
    const userDepositUpdates = queryData.userDepositUpdates;
    const liquidations = queryData.liquidations;

    console.log(queryData)

    liquidations.forEach((liq) => {
        // User deposits
        let userDepositsDuringLiquidationIndex = userDepositUpdates.findIndex(element => element[1] > liq[1]) - 1;

        if (userDepositUpdates?.[userDepositsDuringLiquidationIndex]?.[1] === liq[1] && userDepositUpdates?.[userDepositsDuringLiquidationIndex]?.[2] > liq[2]) {
            userDepositsDuringLiquidationIndex -= 1;
        }

        const userDepositsDuringLiquidation = userDepositUpdates?.[userDepositsDuringLiquidationIndex]?.[4];
        const userDepositDuringLiquidationBlock = userDepositUpdates?.[userDepositsDuringLiquidationIndex]?.[1]
        
        if (!userDepositsDuringLiquidation) return;
        
        // Total deposits
        const totalDepositsDuringLiquidationIndex = totalDeposits.findIndex(element => element[1] === liq[1] && element[2] === liq[2]) - 1;
        const totalDepositsDuringLiquidation = totalDeposits?.[totalDepositsDuringLiquidationIndex]?.[3];
        const totalDepositsDuringLiquidationBlock = totalDeposits?.[totalDepositsDuringLiquidationIndex]?.[1];
        
        // This ratio multiplied by 10 ^ decimals to keep precision, userDeposit / totalDeposits will always give 0n instead of ratio of stake pool ownership
        const poolOnwershipAmount = userDepositsDuringLiquidation * (10n ** BigInt(decimals[protocol])) / totalDepositsDuringLiquidation;

        const stakeReductionAmount = liq[3] * poolOnwershipAmount;
        const collGainAmount = liq[4] * poolOnwershipAmount;


        const row = document.createElement('tr');

        const datetime = document.createElement('td');
        datetime.textContent = liq[0].toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' });
        row.appendChild(datetime);

        const block = document.createElement('td');
        block.textContent = liq[1];
        row.appendChild(block);

        const stakeBalanceAfter = document.createElement('td');
        stakeBalanceAfter.textContent = formatDecimals((totalDepositsDuringLiquidation * (10n ** BigInt(decimals[protocol]))) - stakeReductionAmount, 2 * decimals[protocol], true);
        row.appendChild(stakeBalanceAfter);

        const stakeReduction = document.createElement('td');
        stakeReduction.textContent = formatDecimals(stakeReductionAmount, 2 * decimals[protocol], true);
        row.appendChild(stakeReduction);

        const collGain = document.createElement('td');
        collGain.textContent = formatDecimals(collGainAmount, 2 * decimals[protocol], true);
        row.appendChild(collGain);
        
        const poolOwnership = document.createElement('td');
        poolOwnership.textContent = formatDecimals(poolOnwershipAmount, decimals[protocol]);
        row.appendChild(poolOwnership);

        const lastBlockUserDeposit = document.createElement('td');
        lastBlockUserDeposit.textContent = userDepositDuringLiquidationBlock;
        row.appendChild(lastBlockUserDeposit);
        
        const lastBlockTotalDeposit = document.createElement('td');
        lastBlockTotalDeposit.textContent = totalDepositsDuringLiquidationBlock;
        row.appendChild(lastBlockTotalDeposit);

        stabilityPoolTable.appendChild(row);
    });
}

/**
 * @description Quick utitility function to convert a value a number of decimals. Defaults to going from no decimal to adding decimal precision,
 * but can go in reverse with negative dec. Conversion is done via string manipulation because bigints can't handle decimals
 * @param {bigint} val The value to format
 * @param {number} dec The decimal to format to
 * @param {booleran} scaled If the  value and dec were scaled, this will have the decimal slice
 * @returns {string}
 */
function formatDecimals(val, dec, scale) {
    /** @type {string} */
    let stringifiedVal = val.toString();

    if (dec < 0) {
        return stringifiedVal + '0'.repeat(-dec);
    } else if (dec < stringifiedVal.length) {
        return stringifiedVal.slice(0, stringifiedVal.length - dec) + '.' + stringifiedVal.slice(stringifiedVal.length - dec).slice(0, scale ? dec / 2 + 1 : dec + 1);
    } else {
        return '0.' + ('0'.repeat(dec - stringifiedVal.length) + stringifiedVal).slice(0, scale ? dec / 2 + 1 : dec + 1);
    }
}