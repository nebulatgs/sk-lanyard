export interface LanyardSuccessResponse {
	success: true;
	data: LanyardData;
}
export interface LanyardErrorResponse {
	success: false;
	error: LanyardError;
}

export type LanyardResponse = LanyardSuccessResponse | LanyardErrorResponse;

export interface LanyardError {
	message: string;
	code: string;
}

export interface LanyardData {
	active_on_discord_mobile: boolean;
	active_on_discord_desktop: boolean;
	listening_to_spotify: boolean;
	kv: KV;
	spotify: Spotify;
	discord_user: DiscordUser;
	discord_status: string;
	activities: Activity[];
}

export interface Emoji {
	name: string;
	id: string;
	animated: boolean;
}

export interface Activity {
	type: number;
	timestamps: Timestamps;
	sync_id?: string;
	state: string;
	session_id?: string;
	party?: Party;
	name: string;
	id: string;
	emoji?: Emoji;
	flags?: number;
	details: string;
	created_at: number;
	assets: Assets;
	application_id?: string;
}

export interface Assets {
	large_text: string;
	large_image: string;
	small_text?: string;
	small_image?: string;
}

export interface Party {
	id: string;
}

export interface Timestamps {
	start: number;
	end?: number;
}

export interface DiscordUser {
	username: string;
	global_name: string;
	discriminator: string;
	display_name: string;
	public_flags: number;
	id: string;
	avatar: string;
	bot: boolean;
}

export interface KV {
	location: string;
}

export interface Spotify {
	track_id: string;
	timestamps: Timestamps;
	song: string;
	artist: string;
	album_art_url: string;
	album: string;
}
