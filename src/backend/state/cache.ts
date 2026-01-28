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

type KeyPath = string | string[];

function normalizeKeyPath(key: KeyPath): string[] {
	return Array.isArray(key) ? key : [key];
}

function pathToString(path: string[]): string {
	return JSON.stringify(path);
}

// Use -1 as sentinel for non-array values
const NON_ARRAY_INDEX = -1;

async function getDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const transaction = (event.target as IDBOpenDBRequest).transaction;
			if (!transaction) return;

			// Delete old store if it exists
			if (db.objectStoreNames.contains(STORE_NAME)) {
				db.deleteObjectStore(STORE_NAME);
			}

			// Create new store with composite key path
			const store = db.createObjectStore(STORE_NAME, {
				keyPath: ['protocol', 'baseKey', 'pathStr', 'index']
			});

			// Create index for protocol queries
			store.createIndex('protocol', 'protocol', { unique: false });
			// Create index for baseKey queries within a protocol
			store.createIndex('baseKey', ['protocol', 'baseKey'], {
				unique: false
			});
		};
	});
}

/**
 * Get a non-array value at a key path
 */
export async function getCachedState<T = unknown>(
	protocol: ProtocolName,
	key: KeyPath
): Promise<T | null> {
	try {
		const keyPath = normalizeKeyPath(key);
		if (keyPath.length === 0) {
			return null;
		}

		const baseKey = keyPath[0]!;
		const path = keyPath.slice(1);

		const db = await getDB();
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const pathStr = pathToString(path);
		const idbKey: IDBValidKey[] = [
			protocol,
			baseKey,
			pathStr,
			NON_ARRAY_INDEX
		];
		const request = store.get(idbKey);

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

/**
 * Set a non-array value at a key path
 */
export async function setCachedState<T = unknown>(
	protocol: ProtocolName,
	key: KeyPath,
	value: T
): Promise<void> {
	try {
		const keyPath = normalizeKeyPath(key);
		if (keyPath.length === 0) {
			throw new Error('Key path cannot be empty');
		}

		const baseKey = keyPath[0]!;
		const path = keyPath.slice(1);

		const db = await getDB();
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const serialized = serializeBigInt(value);
		const pathStr = pathToString(path);
		const request = store.put({
			protocol,
			baseKey,
			pathStr,
			index: NON_ARRAY_INDEX,
			value: serialized
		});

		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.warn('Failed to set cached state:', error);
	}
}

/**
 * Get the length of an array at a key path
 */
export async function getCachedArrayLength(
	protocol: ProtocolName,
	key: KeyPath
): Promise<number> {
	try {
		const keyPath = normalizeKeyPath(key);
		if (keyPath.length === 0) {
			return 0;
		}

		const baseKey = keyPath[0]!;
		const path = keyPath.slice(1);

		const db = await getDB();
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);

		const pathStr = pathToString(path);
		// Query all entries for this path using the primary key
		// Start: [protocol, baseKey, pathStr, 0]
		// End: [protocol, baseKey, pathStr, Number.MAX_SAFE_INTEGER]
		const rangeStart: IDBValidKey[] = [protocol, baseKey, pathStr, 0];
		const rangeEnd: IDBValidKey[] = [
			protocol,
			baseKey,
			pathStr,
			Number.MAX_SAFE_INTEGER
		];
		const range = IDBKeyRange.bound(rangeStart, rangeEnd, false, false);
		const request = store.openCursor(range);

		let maxIndex = -1;

		return new Promise((resolve, reject) => {
			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
					.result;
				if (cursor) {
					const entry = cursor.value;
					if (typeof entry.index === 'number') {
						maxIndex = Math.max(maxIndex, entry.index);
					}
					cursor.continue();
				} else {
					resolve(maxIndex + 1);
				}
			};
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.warn('Failed to get cached array length:', error);
		return 0;
	}
}

/**
 * Get a range of items from an array at a key path
 */
export async function getCachedArrayRange<T = unknown>(
	protocol: ProtocolName,
	key: KeyPath,
	start: number,
	end?: number
): Promise<T[]> {
	try {
		const keyPath = normalizeKeyPath(key);
		if (keyPath.length === 0) {
			return [];
		}

		const baseKey = keyPath[0]!;
		const path = keyPath.slice(1);

		const db = await getDB();
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);

		const pathStr = pathToString(path);
		const endIndex = end !== undefined ? end - 1 : Number.MAX_SAFE_INTEGER;
		const rangeStart: IDBValidKey[] = [protocol, baseKey, pathStr, start];
		const rangeEnd: IDBValidKey[] = [protocol, baseKey, pathStr, endIndex];
		const range = IDBKeyRange.bound(rangeStart, rangeEnd, false, false);
		const request = store.openCursor(range);

		const results: Array<{ index: number; value: T }> = [];

		return new Promise((resolve, reject) => {
			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
					.result;
				if (cursor) {
					const entry = cursor.value;
					if (typeof entry.index === 'number') {
						results.push({
							index: entry.index,
							value: deserializeBigInt(entry.value) as T
						});
					}
					cursor.continue();
				} else {
					// Sort by index and return values
					results.sort((a, b) => a.index - b.index);
					resolve(results.map((r) => r.value));
				}
			};
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.warn('Failed to get cached array range:', error);
		return [];
	}
}

/**
 * Append items to an array at a key path
 */
export async function appendCachedArray<T = unknown>(
	protocol: ProtocolName,
	key: KeyPath,
	items: T[]
): Promise<void> {
	if (items.length === 0) return;

	try {
		const keyPath = normalizeKeyPath(key);
		if (keyPath.length === 0) {
			throw new Error('Key path cannot be empty');
		}

		const baseKey = keyPath[0]!;
		const path = keyPath.slice(1);

		// Get current length to determine starting index
		const currentLength = await getCachedArrayLength(protocol, key);

		const pathStr = pathToString(path);
		const BATCH_SIZE = 100; // Process items in batches to avoid overwhelming IndexedDB

		// Process items in batches
		for (let i = 0; i < items.length; i += BATCH_SIZE) {
			const batch = items.slice(i, i + BATCH_SIZE);
			
			const db = await getDB();
			const transaction = db.transaction([STORE_NAME], 'readwrite');
			const store = transaction.objectStore(STORE_NAME);

			// Write batch items
			const promises = batch.map((item, batchIndex) => {
				const index = currentLength + i + batchIndex;
				const serialized = serializeBigInt(item);

				return new Promise<void>((resolve, reject) => {
					const request = store.put({
						protocol,
						baseKey,
						pathStr,
						index,
						value: serialized
					});

					request.onsuccess = () => resolve();
					request.onerror = () => reject(request.error);
				});
			});

			await Promise.all(promises);
		}
	} catch (error) {
		console.warn('Failed to append cached array:', error);
	}
}

/**
 * Set an entire array at a key path (replaces existing array)
 */
export async function setCachedArray<T = unknown>(
	protocol: ProtocolName,
	key: KeyPath,
	items: T[]
): Promise<void> {
	try {
		const keyPath = normalizeKeyPath(key);
		if (keyPath.length === 0) {
			throw new Error('Key path cannot be empty');
		}

		const baseKey = keyPath[0]!;
		const path = keyPath.slice(1);

		const db = await getDB();
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		// First, delete all existing array items
		const pathStr = pathToString(path);
		const rangeStart: IDBValidKey[] = [protocol, baseKey, pathStr, 0];
		const rangeEnd: IDBValidKey[] = [
			protocol,
			baseKey,
			pathStr,
			Number.MAX_SAFE_INTEGER
		];
		const range = IDBKeyRange.bound(rangeStart, rangeEnd, false, false);
		const deleteRequest = store.openCursor(range);

		await new Promise<void>((resolve, reject) => {
			deleteRequest.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
					.result;
				if (cursor) {
					cursor.delete();
					cursor.continue();
				} else {
					resolve();
				}
			};
			deleteRequest.onerror = () => reject(deleteRequest.error);
		});

		// Then write all new items
		const promises = items.map((item, i) => {
			const serialized = serializeBigInt(item);

			return new Promise<void>((resolve, reject) => {
				const request = store.put({
					protocol,
					baseKey,
					pathStr,
					index: i,
					value: serialized
				});

				request.onsuccess = () => resolve();
				request.onerror = () => reject(request.error);
			});
		});

		await Promise.all(promises);
	} catch (error) {
		console.warn('Failed to set cached array:', error);
	}
}

/**
 * Clear all cached state for a protocol
 */
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
