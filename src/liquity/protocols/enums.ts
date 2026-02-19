export const borrowerOperationEnum = [
	'openTrove',
	'closeTrove',
	'adjustTrove'
] as const;

export const statusEnum = [
	'nonExistent',
	'active',
	'closedByOwner',
	'closedByLiquidation',
	'closedByRedemption'
] as const;

export const troveManagerOperationEnum = [
	'applyPendingRewards',
	'liquidateInNormalMode',
	'liquidateInRecoveryMode',
	'redeemCollateral'
] as const;
