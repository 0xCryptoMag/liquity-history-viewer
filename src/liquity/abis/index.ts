import { activePoolAbi } from './activePool';
import { borrowerOperationsAbi } from './borrowerOperations';
import { collSurplusPoolAbi } from './collSurplusPool';
import { defaultPoolAbi } from './defaultPool';
import { gasPoolAbi } from './gasPool';
import { lqtyStakingAbi } from './lqtyStaking';
import { lqtyTokenAbi } from './lqtyToken';
import { lusdTokenAbi } from './lusdToken';
import { priceFeedAbi } from './priceFeed';
import { sortedTrovesAbi } from './sortedTroves';
import { stabilityPoolAbi } from './stabilityPool';
import { troveManagerAbi } from './troveManager';

export {
	activePoolAbi,
	borrowerOperationsAbi,
	collSurplusPoolAbi,
	defaultPoolAbi,
	gasPoolAbi,
	lqtyStakingAbi,
	lqtyTokenAbi,
	lusdTokenAbi,
	priceFeedAbi,
	sortedTrovesAbi,
	stabilityPoolAbi,
	troveManagerAbi
};

export type LiquityContractName =
	| 'activePool'
	| 'borrowerOperations'
	| 'collSurplusPool'
	| 'defaultPool'
	| 'gasPool'
	| 'lqtyStaking'
	| 'lqtyToken'
	| 'lusdToken'
	| 'priceFeed'
	| 'sortedTroves'
	| 'stabilityPool'
	| 'troveManager';
export type LiquityAbi =
	| typeof activePoolAbi
	| typeof borrowerOperationsAbi
	| typeof collSurplusPoolAbi
	| typeof defaultPoolAbi
	| typeof gasPoolAbi
	| typeof lqtyStakingAbi
	| typeof lqtyTokenAbi
	| typeof lusdTokenAbi
	| typeof priceFeedAbi
	| typeof sortedTrovesAbi
	| typeof stabilityPoolAbi
	| typeof troveManagerAbi;
export type LiquityAbiMap = {
	activePool: typeof activePoolAbi;
	borrowerOperations: typeof borrowerOperationsAbi;
	collSurplusPool: typeof collSurplusPoolAbi;
	defaultPool: typeof defaultPoolAbi;
	gasPool: typeof gasPoolAbi;
	lqtyStaking: typeof lqtyStakingAbi;
	lqtyToken: typeof lqtyTokenAbi;
	lusdToken: typeof lusdTokenAbi;
	priceFeed: typeof priceFeedAbi;
	sortedTroves: typeof sortedTrovesAbi;
	stabilityPool: typeof stabilityPoolAbi;
	troveManager: typeof troveManagerAbi;
};
