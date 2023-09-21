<script lang="ts">
	import {
		localStorageStore,
		type ModalSettings,
		modalStore,
		ProgressRadial
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { supabase } from '$lib/supabase';
	import Clock from '$lib/components/Clock.svelte';
	import PreviousTimes from '$lib/components/PreviousTimes.svelte';

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

	let loaded = false;
	let currentTimer = null;
	onMount(async () => {
		let intervall = setInterval(() => {
			now = new Date();
		}, 1000);

		while ($user === null) {
			let name = await askForUser();
			if (name !== false) {
				$user = name;
			}
		}

		loaded = true;

		currentTimer = await currentlyRunning($user);

		return () => {
			clearInterval(intervall);
		};
	});
	let user: Writable<string | null> = localStorageStore('user', null);

	async function currentlyRunning(name: string): Promise<{ id: number; created_at: Date } | null> {
		const { data, error } = await $supabase
			.from('timer')
			.select('id, created_at')
			.eq('user', $user)
			.is('ended_at', null)
			.maybeSingle();
		if (data) {
			(data as any).created_at = new Date((data as any).created_at);
			return data;
		}
		return null;
	}

	async function startTimer(name: string): Promise<{ id: number; created_at: Date } | null> {
		const { data, error } = await $supabase
			.from('timer')
			.insert({ user: $user })
			.select('*')
			.single();

		if (data) {
			(data as any).created_at = new Date((data as any).created_at);
			currentTimer = data;
			return data;
		}
		return null;
	}

	async function stopTimer(user: string, text: string) {
		const { data, error } = await $supabase
			.from('timer')
			.update({ user: user, chore: text, ended_at: new Date() })
			.eq('id', currentTimer.id);

		currentTimer = null;
	}

	function addHours(date: Date, hours: number) {
		return new Date(date.getTime() + hours * 60 * 60 * 1000);
	}

	async function cancelTimer(user: string) {
		const { data, error } = await $supabase.from('timer').delete().eq('id', currentTimer.id);

		currentTimer = null;
	}
	async function stopTimerWithHours(user: string, text: string, hours: number) {
		const date = currentTimer.created_at;
		const { data, error } = await $supabase
			.from('timer')
			.update({ user: user, chore: text, ended_at: addHours(date, hours) })
			.eq('id', currentTimer.id);

		currentTimer = null;
	}

	let now = new Date();

	let text;
	let hours;
</script>

<div class="flex items-center justify-center w-full h-full relative">
	{#if loaded}
		{#if $user == null}
			<p>Name Eingeben</p>
		{:else}
			<div class="absolute top-2 right-2">
				<p class="text-right">
					{$user}
				</p>
				<PreviousTimes user={$user} />
			</div>
			{#if currentTimer}
				<div class="container flex flex-col gap-3">
					<form on:submit|preventDefault={() => stopTimer($user, text)}>
						<Clock
							startTime={currentTimer.created_at}
							endTime={now}
							class="text-5xl font-bold text-center"
						/>
						<input
							type="text"
							class="input p-2"
							bind:value={text}
							placeholder="Was hast du gemacht?"
						/>
						<button class="btn variant-filled">Stop Timer</button>
						<div class="grid grid-cols-2">
							<input type="number" class="input p-2" bind:value={hours} />
							<button
								class="btn variant-filled"
								on:click|preventDefault={() => stopTimerWithHours($user, text, hours)}
								>Stop Timer</button
							>
						</div>
					</form>
					<button class="btn error-filled" on:click={() => cancelTimer($user)}>Cancel Timer</button>
				</div>
			{:else}
				<button class="btn variant-filled" on:click={() => startTimer($user)}>Start Timer</button>
			{/if}
		{/if}
	{:else}
		<ProgressRadial />
	{/if}
</div>
