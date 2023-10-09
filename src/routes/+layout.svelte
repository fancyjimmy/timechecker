<script lang="ts">
	import '../theme.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	import { supabase, session } from '$lib/supabase';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Modal, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import { user } from '$lib/util';

	export let data;

	$: $supabase = data.supabase;
	$: $session = data.session;

	function askForUser() {
		return new Promise<string>((resolve) => {
			const modal: ModalSettings = {
				type: 'prompt',
				// Data
				title: 'Name',
				body: 'Gib deinen Vornamen ein!',
				// Populates the input value and attributes
				value: '',
				valueAttr: { type: 'text', minlength: 3, maxlength: 20, required: true },
				// Returns the updated response value
				response: (r: string) => {
					resolve(r);
				}
			};
			modalStore.trigger(modal);
		});
	}

	onMount(async () => {
		const {
			data: { subscription }
		} = $supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}

			$session = _session;
		});

		while ($user === null) {
			let name = await askForUser();
			if (name !== false) {
				$user = name;
			}
		}

		return () => subscription.unsubscribe();
	});
</script>

<div class="flex flex-col h-screen w-screen">
	<nav class="bg-slate-100 shadow top-0 w-screen uppercase border-b flex justify-between">
		<ul class="flex font-semibold text-sm">
			<li class="p-2 hover:bg-sky-300 duration-200"><a href="/">Eintrag</a></li>
			<li class="p-2 hover:bg-sky-300 duration-200"><a href="/history">History</a></li>
			<li class="p-2 hover:bg-sky-300 duration-200"><a href="/start-end">Datum Eintrag</a></li>
		</ul>
		<div class='font-bold h-full justify-center items-center flex px-2'>
			{#if $user}
				{$user}
			{/if}
		</div>
	</nav>
	<div class="flex-auto relative">
		<div class="absolute inset-0 m-0 overflow-y-auto">
			{#if $user}
				<slot />
			{:else}
				<p>Name eingeben</p>
			{/if}
		</div>
	</div>
</div>

<Modal />
