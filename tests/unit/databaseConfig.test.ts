import { parsePostgresPort } from '$lib/server/database';
import { describe, expect, it } from 'vitest';

describe('parsePostgresPort', () => {
	it.each([undefined, '', '   '])('uses port 5432 for an empty value (%s)', (value) => {
		expect(parsePostgresPort(value)).toBe(5432);
	});

	it('accepts the old optional colon prefix', () => {
		expect(parsePostgresPort(':6543')).toBe(6543);
	});

	it.each(['0', '65536', 'not-a-port'])('rejects invalid value %s', (value) => {
		expect(() => parsePostgresPort(value)).toThrow(`Invalid PostgreSQL port: ${value}`);
	});
});
