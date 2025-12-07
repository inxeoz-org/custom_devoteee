// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		__ENV__?: {
			API_BASE?: string;
		};
	}
}

declare module 'flowbite-svelte' {
	export * from 'flowbite-svelte/dist/index';
}

export {};
