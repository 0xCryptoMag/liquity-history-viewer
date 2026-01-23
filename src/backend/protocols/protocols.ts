export const chains = {
	mainnet: {
		name: 'mainnet',
		weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		rpc: 'https://ethereum-rpc.publicnode.com'
	},
	pulsechain: {
		name: 'pulsechain',
		weth: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
		rpc: 'https://rpc-pulsechain.g4mm4.io'
	}
} as const;

export const protocols = {
	liquity: {
		chain: chains.mainnet,
		troveManager: '0xA39739EF8b0231DbFA0DcdA07d7e29faAbCf4bb2',
		borrowerOperations: '0x24179CD81c9e782A4096035f7eC97fB8B783e007',
		activePool: '0xDf9Eb223bAFBE5c5271415C75aeCD68C21fE3D7F',
		defaultPool: '0x896a3F03176f05CFbb4f006BfCd8723F2B0D741C',
		stabilityPool: '0x66017D22b0f8556afDd19FC67041899Eb65a21bb',
		gasPool: '0x9555b042F969E561855e5F28cB1230819149A8d9',
		collSurplusPool: '0x3D32e8b97Ed5881324241Cf03b2DA5E2EBcE5521',
		priceFeed: '0x4c517D4e2C851CA76d7eC94B805269Df0f2201De',
		sortedTroves: '0x8FdD3fbFEb32b28fb73555518f8b361bCeA741A6',
		lqtyStaking: '0x4f9Fbb3f1E99B56e0Fe2892e623Ed36A76Fc605d',
		lusdToken: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
		lqtyToken: '0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D',
		collateral: '',
		deployBlock: 12178557n,
		modifiers: {
			abisType: 'normal'
		}
	},
	liquidLoans: {
		chain: chains.pulsechain,
		troveManager: '0xd79bfb86fa06e8782b401bc0197d92563602d2ab',
		borrowerOperations: '0xa09bb56b39d652988c7e7d3665aa7ec7308bbf09',
		activePool: '0x3983f040916681085d7949f7ee78bfa12c5cb119',
		defaultPool: '0x717a736b34308d97eefb5bd91539e0d3b9142dbe',
		stabilityPool: '0x7bfd406632483ad00c6edf655e04de91a96f84bc',
		gasPool: '0xdec755e596c43439d039e48bf145dfb4e45fee3d',
		collSurplusPool: '0x88742a6fd16a00fc671fff371e4cc8ff58378596',
		priceFeed: '0xc65abc8b9b4b3cee03430f6fc3d8a4760221a113',
		sortedTroves: '0xe1246517c3eca1e2a198fc927296d8ff87babd3c',
		lqtyStaking: '0x853f0cd4b0083edf7cff5ad9a296f02ffb71c995',
		lusdToken: '0x0dEEd1486bc52aA0d3E6f8849cEC5adD6598A162',
		lqtyToken: '0x9159f1D2a9f51998Fc9Ab03fbd8f265ab14A1b3B',
		collateral: '',
		deployBlock: 18971002n,
		modifiers: {
			abisType: 'modified',
			eth: 'pls',
			ether: 'pulse',
			lqty: 'loan',
			lusd: 'usdl',
			trove: 'vault'
		}
	},
	earnProtocol: {
		chain: chains.pulsechain,
		troveManager: '0x118b7CF595F6476a18538EAF4Fbecbf594338B39',
		borrowerOperations: '0x9861ad36e1fcf4ae780e438fd101cab93e1039f1',
		activePool: '0xb1e03a2dc49efba2af78a84d530987f99e72831f',
		defaultPool: '0x4d867a74525bebf1d3c747324fc6e802401b225a',
		stabilityPool: '0x02e842db8d6c78d17cf8146009fb864094d95319',
		gasPool: '0xd52a2f26bb8de97811f1fbf55c9f5df513271980',
		collSurplusPool: '0x4efe70632a7245e165164a0207a0e31a2b8cd63a',
		priceFeed: '0xf46368fd7442eb5545a07d0322ea25f2d31a9e62',
		sortedTroves: '0x76ac02eb99587368f4f867bcad4becb3034ddcf6',
		lqtyStaking: '0xd92df13b6cd9ea8fc116b1865d2d72be41d74b1a',
		lusdToken: '0xeb6b7932da20c6d7b3a899d5887d86dfb09a6408',
		lqtyToken: '0xb513038bbfdf9d40b676f41606f4f61d4b02c4a2',
		collateral: '0x95b303987a60c71504d99aa1b13b4da07b0790ab',
		deployBlock: 19776007n,
		modifiers: {
			abisType: 'normal'
		}
	},
	flexProtocol: {
		chain: chains.pulsechain,
		troveManager: '0xc2d0720721d48ce85e20dc9e01b8449d7edd14ce',
		borrowerOperations: '0x5b8575bd870a06a88fd6a2e4c68a66b2f74628cb',
		activePool: '0xe4fd443b26fa809a48eb658ea7edeb31e95c2144',
		defaultPool: '0xc1c8a7f32e9d5142a77a05f8969b28b58fa10f63',
		stabilityPool: '0x271f576fd6de465231320a0f9997acb0c8b97e07',
		gasPool: '0xe29b73f9262b42b44287102fb976426a7247b0fa',
		collSurplusPool: '0xcdec6212560c03e62d7e2a74de22af70dea9a288',
		priceFeed: '0x0432944d3689081447f418c63340ba95b62591d7',
		sortedTroves: '0x3de0068b6a9c11ba93805974f6402f0fab795394',
		lqtyStaking: '0xcec2c718cefdb3a515d3cc22e430b46933922ce4',
		lusdToken: '0x1fe0319440a672526916c232eaee4808254bdb00',
		lqtyToken: '0x9c6fa17d92898b684676993828143596894aa2a6',
		collateral: '0x2b591e99afe9f32eaa6214f7b7629768c40eeb39',
		deployBlock: 20255152n,
		modifiers: {
			abisType: 'normal'
		}
	},
	incPrinter: {
		chain: chains.pulsechain,
		troveManager: '0x248262ea52198643dd1512ce7a2c93b32a03e45f',
		borrowerOperations: '0x41dcd47f482629e7f6db339b523b590fd8ed9ed9',
		activePool: '0xe77709d8c0e3685ac719e0df10ee1fa887b190b0',
		defaultPool: '0x14754bca27589a6bf5abcef6bef1b95cc2dbb540',
		stabilityPool: '0xfd2689b36e34453cb844637a7c8f1406a56ede92',
		gasPool: '0xebaa62896c3bfb5fecae75239a1ce2c000c2cc11',
		collSurplusPool: '0xe295e3771bc62e1fa96e2adca7df803f5ba81d09',
		priceFeed: '0x0284f4c070fbba474e8307130a6ed1aeac33bf4d',
		sortedTroves: '0xd50b1ee1079ec37e97e6f8990ca805259f52f367',
		lqtyStaking: '0x35b99f29b3ec3276a2b3bb5863326b1c100aa160',
		lusdToken: '0x144cd22aaa2a80fed0bb8b1deaddc51a53df1d50',
		lqtyToken: '0x6c203a555824ec90a215f37916cf8db58ebe2fa3',
		collateral: '0x2fa878ab3f87cc1c9737fc071108f904c0b0c95d',
		deployBlock: 22980752n,
		modifiers: {
			abisType: 'normal'
		}
	}
} as const;

export const protocolNames = Object.keys(
	protocols
) as (keyof typeof protocols)[];
export type ProtocolName = (typeof protocolNames)[number];
