export interface LanyardConfigRest {
	restUrl?: string;
	method: 'rest';
	id: string;
	pollInterval?: number;
}

export interface LanyardConfigOne {
	wsUrl?: string;
	method: 'ws';
	id: string;
}

export interface LanyardConfigMany {
	wsUrl?: string;
	method: 'ws';
	ids: string[];
}

export interface LanyardConfigAll {
	wsUrl?: string;
	method: 'ws';
	all: true;
}

export type LanyardConfigWS = LanyardConfigOne | LanyardConfigMany | LanyardConfigAll;

export type LanyardConfig = LanyardConfigRest | LanyardConfigWS;
