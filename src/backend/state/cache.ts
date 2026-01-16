import type { ProtocolName } from '../protocols/protocols';

const DB_NAME = 'liquity-history-cache';
const DB_VERSION = 1;
const STORE_NAME = 'state';

declare global {
	interface BigInt {
		toJSON(): { $bigint: string };
	}
}

BigInt.prototype.toJSON = function () {
	return { $bigint: this.toString() };
};

function serializeBigInt(data: unknown): unknown {
	return JSON.parse(JSON.stringify(data));
}

function deserializeBigInt(data: unknown): unknown {
	if (data === null || data === undefined) return data;

	if (
		typeof data === 'object' &&
		data !== null &&
		'$bigint' in data &&
		typeof (data as { $bigint: unknown }).$bigint === 'string'
	) {
		return BigInt((data as { $bigint: string }).$bigint);
	}

	if (Array.isArray(data)) return data.map(deserializeBigInt);
	if (typeof data === 'object' && data !== null) {
		return Object.fromEntries(
			Object.entries(data).map(([key, value]) => [
				key,
				deserializeBigInt(value)
			])
		);
	}
	return data;
}

async function getDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const transaction = (event.target as IDBOpenDBRequest).transaction;
			if (!transaction) return;

			let store: IDBObjectStore;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				store = db.createObjectStore(STORE_NAME, {
					keyPath: ['protocol', 'key']
				});
			} else {
				store = transaction.objectStore(STORE_NAME);
			}
			if (!store.indexNames.contains('protocol')) {
				store.createIndex('protocol', 'protocol', { unique: false });
			}
		};
	});
}

export async function getCachedState<T = unknown>(
	protocol: ProtocolName,
	key: string
): Promise<T | null> {
	try {
		const db = await getDB();
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get([protocol, key]);

		return new Promise((resolve, reject) => {
			request.onsuccess = () => {
				const result = request.result;
				if (result?.value) {
					resolve(deserializeBigInt(result.value) as T);
				} else {
					resolve(null);
				}
			};
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.warn('Failed to get cached state:', error);
		return null;
	}
}

export async function setCachedState<T = unknown>(
	protocol: ProtocolName,
	key: string,
	value: T
): Promise<void> {
	try {
		const db = await getDB();
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const serialized = serializeBigInt(value);
		const request = store.put({ protocol, key, value: serialized });

		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.warn('Failed to set cached state:', error);
	}
}

export async function updateCachedState<T extends Record<string, unknown>>(
	protocol: ProtocolName,
	key: string,
	updates: Partial<T>
): Promise<void> {
	try {
		const existing = await getCachedState<T>(protocol, key);
		const merged = existing ? { ...existing, ...updates } : updates;
		await setCachedState(protocol, key, merged);
	} catch (error) {
		console.warn('Failed to update cached state:', error);
	}
}

export async function clearCachedState(protocol: ProtocolName): Promise<void> {
	try {
		const db = await getDB();
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const index = store.index('protocol');
		const request = index.openCursor(IDBKeyRange.only(protocol));

		return new Promise((resolve, reject) => {
			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
					.result;
				if (cursor) {
					cursor.delete();
					cursor.continue();
				} else {
					resolve();
				}
			};
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.warn('Failed to clear cached state:', error);
	}
}
