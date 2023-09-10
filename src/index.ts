import { Readable, Subscriber, readable } from 'svelte/store';

import {
	LanyardConfig,
	LanyardConfigAll,
	LanyardConfigMany,
	LanyardConfigOne,
	LanyardConfigRest,
	LanyardConfigWS
} from './configTypes';
import { LanyardData, LanyardResponse } from './restTypes';
import {
	InitState,
	LanyardEvent,
	LanyardHeartbeat,
	LanyardHello,
	LanyardInitialize,
	LanyardMessage,
	LanyardOpcode
} from './wsTypes';

const DEFAULT_REST_URL = 'https://api.lanyard.rest/v1';
const DEFAULT_WS_URL = 'wss://api.lanyard.rest/socket';

export function useLanyard(
	config: LanyardConfigMany | LanyardConfigAll
): Readable<Record<string, LanyardData>>;
export function useLanyard(config: LanyardConfigRest | LanyardConfigOne): Readable<LanyardData>;
export function useLanyard(config: LanyardConfig) {
	if (config.method === 'rest') {
		return readable<LanyardData>(undefined, (set) => lanyardRest(config, set));
	}
	if (config.method === 'ws') {
		if ('id' in config) {
			return readable<LanyardData>(undefined, (set) => lanyardWS(config, set));
		}

		return readable<Record<string, LanyardData>>(undefined, (set) => lanyardWS(config, set));
	}
}

function lanyardRest(config: LanyardConfigRest, set: Subscriber<LanyardData>) {
	if (typeof window === 'undefined') {
		return;
	}

	const restUrl = config.restUrl ?? DEFAULT_REST_URL;
	const lanyardFetch = async () =>
		(await fetch(`${restUrl}/users/${config.id}`).then((res) =>
			res.json()
		)) as Promise<LanyardResponse>;
	const updateStore = async () => {
		const res = await lanyardFetch();
		if (res.success) {
			set(res.data);
		} else {
			throw new Error(res.error.message);
		}
	};
	updateStore();
	const timer = setInterval(updateStore, config.pollInterval ?? 5000);

	return () => clearInterval(timer);
}

function lanyardWS<T extends InitState>(config: LanyardConfigWS, set: Subscriber<T>) {
	if (typeof window === 'undefined') {
		return;
	}

	const wsUrl = config.wsUrl ?? DEFAULT_WS_URL;
	const ws = new WebSocket(wsUrl);

	const send = <T>(message: T) => ws.send(JSON.stringify(message));
	const recv = (callback: (this: WebSocket, event: MessageEvent<string>) => unknown) => {
		ws.addEventListener('message', callback);
	};
	const once = <T>() =>
		new Promise<T>((res) => {
			const fn: (this: WebSocket, event: MessageEvent<string>) => unknown = (event) => {
				ws.removeEventListener('message', fn);
				res(JSON.parse(event.data));
			};
			ws.addEventListener('message', fn);
		});
	const waitInit = () =>
		new Promise<void>((res, rej) => {
			const open = () => {
				ws.removeEventListener('open', open);
				res();
			};
			ws.addEventListener('open', open);

			const err = () => {
				ws.removeEventListener('error', err);
				rej();
			};
			ws.addEventListener('error', err);
		});

	waitInit().then(async () => {
		if ('all' in config) {
			send<LanyardInitialize>({
				op: LanyardOpcode.INITIALIZE,
				d: {
					subscribe_to_all: true
				}
			});
		}
		if ('ids' in config) {
			send<LanyardInitialize>({
				op: LanyardOpcode.INITIALIZE,
				d: {
					subscribe_to_ids: config.ids
				}
			});
		}
		if ('id' in config) {
			send<LanyardInitialize>({
				op: LanyardOpcode.INITIALIZE,
				d: {
					subscribe_to_id: config.id
				}
			});
		}

		const hello = await once<LanyardHello>();
		const heartbeatInterval = hello.d.heartbeat_interval;

		const heartbeat = () => {
			send<LanyardHeartbeat>({
				op: LanyardOpcode.HEARTBEAT,
				d: undefined
			});
		};
		setInterval(heartbeat, heartbeatInterval);

		const init = await once<LanyardMessage<T>>();
		const state = init.d;
		set(state);

		recv((event) => {
			const update: LanyardEvent<'PRESENCE_UPDATE'> = JSON.parse(event.data);
			if ('user_id' in update.d) {
				// user_id is removed from the object
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { user_id, ...data } = update.d;
				(state as Record<string, LanyardData>)[update.d.user_id] = data;
				set(state);
			} else {
				set({ ...update.d } as T);
			}
		});
	});

	return () => ws.close();
}

export type * from './configTypes';
export type * from './restTypes';
export type * from './wsTypes';
