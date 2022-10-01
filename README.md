# `sk-lanyard` (SvelteKit + Lanyard)

SvelteKit integration with [Lanyard](https://github.com/Phineas/lanyard), an API to fetch your Discord presence.

`sk-lanyard` is fully typed and supports the entire Lanyard API, using both REST and WebSockets.

The `useLanyard` function returns a reactive store containing presence data.

## [Demo](https://stackblitz.com/edit/sk-lanyard-demo?file=src/routes/index.svelte)

```html
<script>
	import { useLanyard } from 'sk-lanyard';
	const presence = useLanyard({ method: 'rest', id: '524722785302609941' });
</script>

<pre>
    <!-- Because presence is a reactive store, use $presence to access the data -->
    <code>{JSON.stringify($presence ?? {}, null, 2)}</code>
</pre>
```

## Usage

```ts
import { useLanyard } from 'sk-lanyard';

// Optionally import Lanyard types
import type { LanyardData, LanyardHello } from 'sk-lanyard';
```

### REST

```ts
// Use the REST API to fetch a single user
const lanyard = useLanyard({ method: 'rest', id: '524722785302609941' });
```

```ts
// Use an interval of 1000 ms
const lanyard = useLanyard({
	method: 'rest',
	pollInterval: 1000,
	id: '524722785302609941'
});
```

```ts
// Use a custom endpoint
const lanyard = useLanyard({
	method: 'rest',
	restUrl: 'https://lanyard.example.com/rest',
	id: '524722785302609941'
});
```

### WebSockets

```ts
// Use the WebSockets API to subscribe to a single user
const lanyard = useLanyard({ method: 'ws', id: '524722785302609941' });
```

```ts
// Subscribe to multiple users
const lanyard = useLanyard({
	method: 'ws',
	ids: ['524722785302609941', '299707523370319883']
});
```

```ts
// Subscribe to all users tracked by Lanyard
const lanyard = useLanyard({ method: 'ws', all: true });
```

```ts
// Use a custom endpoint
const lanyard = useLanyard({
	method: 'ws',
	wsUrl: 'wss://lanyard.example.com/ws',
	id: '524722785302609941'
});
```
