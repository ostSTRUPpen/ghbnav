import { env } from '$env/dynamic/private';
import postgres, { type Sql } from 'postgres';

type PostgresSslMode = 'allow' | 'prefer' | 'require' | 'verify-full';

interface DatabaseGlobal {
	ghbnavDatabase?: Sql;
}

function requiredEnvironment(name: string): string {
	const value = env[name];
	if (!value) throw new Error(`Missing required database environment variable: ${name}`);
	return value;
}

export function parsePostgresPort(value: string | undefined): number {
	const configuredPort = value?.trim();
	if (!configuredPort) return 5432;

	const port = Number(configuredPort.replace(/^:/, ''));
	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error(`Invalid PostgreSQL port: ${configuredPort}`);
	}
	return port;
}

function parseNumber(value: string, name: string): number {
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 0) {
		throw new Error(`Invalid ${name}: ${value}`);
	}
	return parsed;
}

function parseMaxLifetime(value: string): number | null {
	return value === 'null' ? null : parseNumber(value, 'POSTGRES_JS_SETTINGS_MAX_LIFETIME');
}

function parseSslMode(value: string | undefined): false | PostgresSslMode {
	if (value === 'disable') return false;
	if (value === 'allow' || value === 'prefer' || value === 'verify-full') return value;
	return 'require';
}

function createDatabaseClient(): Sql {
	return postgres({
		host: requiredEnvironment('PSQL_HOST'),
		port: parsePostgresPort(env.PSQL_PORT),
		database: requiredEnvironment('PSQL_DATABASE'),
		username: requiredEnvironment('PSQL_USERNAME'),
		password: requiredEnvironment('PSQL_PASSWORD'),
		ssl: parseSslMode(env.PSQL_SSL_MODE),
		idle_timeout: parseNumber(
			requiredEnvironment('POSTGRES_JS_SETTINGS_IDLE_TIMEOUT'),
			'POSTGRES_JS_SETTINGS_IDLE_TIMEOUT'
		),
		max_lifetime: parseMaxLifetime(requiredEnvironment('POSTGRES_JS_SETTINGS_MAX_LIFETIME'))
	});
}

const databaseGlobal = globalThis as typeof globalThis & DatabaseGlobal;
let database = databaseGlobal.ghbnavDatabase;

export function getDatabase(): Sql {
	database ??= createDatabaseClient();
	databaseGlobal.ghbnavDatabase = database;
	return database;
}
