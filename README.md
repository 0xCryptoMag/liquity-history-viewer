# Introduction

This tool to view information about historical redemptions and liquidations on individual Troves. It also views decreases in Stability Pool stakes during liquidation events. This repository is optimized for Pulsechain Liquity forks Liquid Loans, Earn Protocol and Flex Protocol.

This app was created because there was no tooling in the protocol front ends to show the user when they lost collateral due redemptions, or when they lose stability pool stake amounts during liquidation events. This might be useful for people that want use wallet tracking / txn logging software like Koinly that will track user initiated txns such as opening or adjusting a trove but won't track when a trove gets liquidated or redeemed against.

I don't have any real frontend expierence, I also don't think I care enough to learn. The frontend was designed to deliver info in an organized way, and the end result should be sufficient enough.

As mentioned in the LICENSE document, there are no warranties in the use of this program. All risks or responsibilities of its use lie squarely with the user. The software is provided as is, and may or may not be updated in the future. The author has no responsibility on patching or updating.

# Technology stack

- [Node.js](https://nodejs.org/en/download/package-manager) - The main version of this app requires Node.js. Node is a javascript execution environment and it's used to run the lightweight server being used to access and update files in the database folders. The reason for this is that event log queries of `StabilityPoolLUSDBalanceUpdated` can take 5 to 10 minutes to finish due to there being nearly 120k logs at the time of writing. These logs will get cached in the database folder and significantly increase the speed of this app. The no-server branch of this repository can be downloaded for those that want to use the app without downloading Node and using it to start the server.
- [Ethers.js](https://docs.ethers.io/v6/) - Standard library to handle blockchain interactions
- Javascript - Backend and frontend are both written in JS

# How to

## Main branch

1. On the repository [page](https://github.com/0xCryptoMag/liquity-history-viewer), click the green code button and download and unzip the codebase. Or you can download the files using `git clone --branch main https://github.com/0xCryptoMag/liquity-history-viewer` in your terminal.
2. If not already installed, download and install [Node.js](https://nodejs.org/en/download/package-manager). 
3. Install depndencies app dependencies (body-parser, cors, ethersjs, and express) by opening and navigating a terminal to the folder where the app resides in, then using the command `npm install`.
4. In the same terminal start the server by using `node app.js`. Optionally add a port at the end ( `node app.js 8081` ) if you want to start the server in a port other than 8080. The server should open a page in your browser and display the app interface. If it does not, go to your browser and type in `http://localhost:${port}/index.html` (replace port with 8080 or another port of your choice)
5. Pick your protocol to query and your address you want to query, then hit submit. Wait to get data from the blockchain and for the page to render your query results.

## No-Server Branch
1. On the repository [page](https://github.com/0xCryptoMag/liquity-history-viewer), click the green code button and download and unzip the codebase. Or you can download the files using `git clone --branch no-server https://github.com/0xCryptoMag/liquity-history-viewer` in your terminal.
2. Install depndencies app dependencies (ethersjs) by opening and navigating a terminal to the folder where the app resides in, then using the command `npm install`.
3. Click on app.html to open the app interface on your browser.
4. Pick your protocol to query and your address you want to query, then hit submit. Wait to get data from the blockchain and for the page to render your query results.

## Misc
After displaying data from the blockchain, you can open your browsers console (usually with F12). The page should have logged the query data in it's entirety to the console. You can view that as desired to double check the results being displayed on the browser.
If a new version of the app gets released on github, the app should notify you on the page.