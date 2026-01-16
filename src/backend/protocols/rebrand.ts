import { protocols } from './protocols';
import type { ProtocolName } from './protocols.js';

const brandedWords = ['eth', 'ether', 'lqty', 'lusd', 'trove'] as const;
type BrandedWords = (typeof brandedWords)[number];
type LiteralBrandedWords =
	| BrandedWords
	| Capitalize<BrandedWords>
	| Uppercase<BrandedWords>;

export type Modifiers = (typeof protocols)[keyof typeof protocols]['modifiers'];

type GetModifierValue<W extends BrandedWords, M extends Modifiers> = [
	M
] extends [{ abisType: 'modified' }]
	? W extends keyof M
		? M[W] extends string
			? M[W]
			: never
		: never
	: never;

// prettier-ignore
type ApplyModifier<T extends LiteralBrandedWords, M extends Modifiers> = [
	M
] extends [{ abisType: 'modified' }]
	? GetModifierValue<Lowercase<T> & BrandedWords, M> extends infer V
		? V extends string
			? T extends Uppercase<Lowercase<T> & BrandedWords>
				? Uppercase<V>
				: T extends Capitalize<Lowercase<T> & BrandedWords>
					? Capitalize<V>
					: V
			: T
		: T
	: T;

function modifyBrandedWords<W extends LiteralBrandedWords, M extends Modifiers>(
	word: W,
	modifiers: M
): ApplyModifier<W, M> {
	if (modifiers.abisType === 'normal') return word as ApplyModifier<W, M>;

	// prettier-ignore
	const modifierKey = word.toLowerCase() as Lowercase<W> & Exclude<
		keyof M, 'abisType'
	>;
	const modifierValue = modifiers[modifierKey] as string;

	// word is lowercase
	if (word === (modifierKey as string)) {
		return modifierValue as ApplyModifier<W, M>;
	}

	const capitalizedKey =
		(modifierKey as string).charAt(0).toUpperCase() +
		(modifierKey as string).slice(1);

	// word is capitalized
	if (word === capitalizedKey) {
		return (modifierValue.charAt(0).toUpperCase() +
			modifierValue.slice(1)) as ApplyModifier<W, M>;
	}

	// word is uppercase
	if (word === (modifierKey as string).toUpperCase()) {
		return modifierValue.toUpperCase() as ApplyModifier<W, M>;
	}

	throw new Error(`Unhandled branded word: ${word}`);
}

// prettier-ignore
type ReplaceWord<
	S extends string,
	W extends BrandedWords,
	M extends Modifiers
> = S extends `${infer before}${W}${infer after}`
	? `${before}${ApplyModifier<W, M>}${ReplaceWord<after, W, M>}`
	: S extends `${infer before}${Capitalize<W>}${infer after}`
		? `${before}${ApplyModifier<Capitalize<W>, M>}${ReplaceWord<after, W, M>}`
		: S extends `${infer before}${Uppercase<W>}${infer after}`
			? `${before}${ApplyModifier<Uppercase<W>, M>}${ReplaceWord<after, W, M>}`
			: S;

// prettier-ignore
export type ReplaceBrandedWordsInString<S extends string, M extends Modifiers> =
	[M] extends [{ abisType: 'modified' }]
		? ReplaceWord<
			ReplaceWord<
				ReplaceWord<
					ReplaceWord<
						ReplaceWord<
							S,
							'eth',
							M
						>,
						'ether',
						M
					>,
					'lqty',
					M
				>,
				'lusd',
				M
			>,
			'trove',
			M
		>
		: S;

// prettier-ignore
export type ReplaceBrandedWordsInStringForAllProtocols<S extends string> = {
	[P in ProtocolName]: ReplaceBrandedWordsInString<
		S,
		(typeof protocols)[P]['modifiers']
	>;
}[ProtocolName];

// prettier-ignore
type ReplaceBrandedWordsInStringDistributed<
	S extends string,
	M extends Modifiers
> = [M] extends [(typeof protocols)[ProtocolName]['modifiers']]
	? ReplaceBrandedWordsInStringForAllProtocols<S>
	: ReplaceBrandedWordsInString<S, M>;

export function replaceBrandedWordsInString<
	S extends string,
	M extends Modifiers
>(str: S, modifiers: M): ReplaceBrandedWordsInStringDistributed<S, M> {
	if (modifiers.abisType === 'normal') {
		return str as ReplaceBrandedWordsInStringDistributed<S, M>;
	}

	let result: string = str;

	for (const word of brandedWords) {
		const regex = new RegExp(`(\\b${word}\\b|${word}(?=[A-Z]))`, 'gi');
		let match: RegExpExecArray | null;

		const matches: { index: number; text: string }[] = [];
		while ((match = regex.exec(result)) !== null) {
			matches.push({ index: match.index, text: match[0] });
		}

		for (let i = matches.length - 1; i >= 0; i--) {
			const match = matches[i];
			if (!match) continue;
			const { index, text } = match;
			let replacement: string;

			if (text === word) {
				// lowercase
				replacement = modifyBrandedWords(
					word as LiteralBrandedWords,
					modifiers
				);
			} else if (text === word.charAt(0).toUpperCase() + word.slice(1)) {
				// Capitalized
				replacement = modifyBrandedWords(
					(word.charAt(0).toUpperCase() +
						word.slice(1)) as LiteralBrandedWords,
					modifiers
				);
			} else if (text === word.toUpperCase()) {
				// UPPERCASE
				replacement = modifyBrandedWords(
					word.toUpperCase() as LiteralBrandedWords,
					modifiers
				);
			} else {
				// Mixed case - try to preserve pattern
				replacement = text;
			}

			const end = index + text.length;
			result = result.slice(0, index) + replacement + result.slice(end);
		}
	}

	return result as ReplaceBrandedWordsInStringDistributed<S, M>;
}
