import type { ProtocolName } from '../protocols/protocols.js';
import { createPublicClient, http } from 'viem';
import * as chains from 'viem/chains';
import { protocols } from '../protocols/protocols.js';

export function createClient(protocol: ProtocolName) {
	const { chain } = protocols[protocol];

	return createPublicClient({
		chain: chains[chain.name],
		transport: http(chain.rpc, {
			timeout: 10_000_000
		})
	});
}
