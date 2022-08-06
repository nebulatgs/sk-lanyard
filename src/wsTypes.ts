import { LanyardData } from './restTypes';

export enum LanyardOpcode {
	EVENT,
	HELLO,
	INITIALIZE,
	HEARTBEAT
}

export type LanyardEventType = 'INIT_STATE' | 'PRESENCE_UPDATE';
export type InitState = LanyardData | Record<string, LanyardData>;
export type PresenceUpdate = LanyardData | (LanyardData & { user_id: string });

export type LanyardEvents = { INIT_STATE: InitState; PRESENCE_UPDATE: PresenceUpdate };

export interface LanyardMessage<T> {
	op: LanyardOpcode;
	seq?: number;
	t?: LanyardEventType;
	d: T;
}

export interface LanyardEvent<T extends LanyardEventType> extends LanyardMessage<LanyardEvents[T]> {
	op: LanyardOpcode.EVENT;
	seq: number;
	t: LanyardEventType;
}

export interface LanyardHelloData {
	heartbeat_interval: number;
}

export interface LanyardHello extends LanyardMessage<LanyardHelloData> {
	op: LanyardOpcode.HELLO;
	seq?: never;
	t?: never;
}

export interface LanyardInitializeOne {
	subscribe_to_id: string;
	subscribe_to_ids?: never;
	subscribe_to_all?: never;
}
export interface LanyardInitializeMany {
	subscribe_to_id?: never;
	subscribe_to_ids: string[];
	subscribe_to_all?: never;
}
export interface LanyardInitializeAll {
	subscribe_to_id?: never;
	subscribe_to_ids?: never;
	subscribe_to_all: boolean;
}
export type LanyardInitializeData =
	| LanyardInitializeOne
	| LanyardInitializeMany
	| LanyardInitializeAll;

export interface LanyardInitialize extends LanyardMessage<LanyardInitializeData> {
	op: LanyardOpcode.INITIALIZE;
	seq?: never;
	t?: never;
}

export interface LanyardHeartbeat extends LanyardMessage<undefined> {
	op: LanyardOpcode.HEARTBEAT;
	seq?: never;
	t?: never;
}
