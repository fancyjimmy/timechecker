<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import Clock from '$lib/components/Clock.svelte';
	import { user } from '$lib/util';

	let loaded = false;
	let currentTimer = null;
	onMount(async () => {
		let intervall = setInterval(() => {
			now = new Date();
		}, 1000);

		currentTimer = await currentlyRunning($user!);
		loaded = true;

		return () => {
			clearInterval(intervall);
		};
	});

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
			.update({ user: user, chore: text, ended_at: new Date(), diplomarbeit: diplomarbeit })
			.eq('id', currentTimer.id);

		currentTimer = null;
	}

	async function stopTimerWithHours(user: string, text: string, hours: number) {
		let start = currentTimer.created_at;
		const { data, error } = await $supabase
			.from('timer')
			.update({ user: user, chore: text, ended_at: addHours(start, hours), diplomarbeit })
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

	let now = new Date();

	let text;
	let hours;
	let diplomarbeit = false;
</script>

<div class="flex items-center justify-center w-full h-full relative">
	{#if loaded}
		{#if $user == null}
			<p>Name Eingeben</p>
		{:else if currentTimer}
			{#if currentTimer}
				<div class="container flex flex-col w-full max-w-5xl">
					<form
						method='get'
						action='/history'
						on:submit={() => {
							if (hours && typeof hours == 'number') {
								stopTimerWithHours($user, text, hours);
							} else {
								stopTimer($user, text);
							}

							text = undefined;
						}}
					>
						<Clock
							startTime={currentTimer.created_at}
							endTime={now}
							class="text-[15rem] pb-[7rem] font-bold text-center"
						/>
						<input
							type="text"
							class="input p-2"
							bind:value={text}
							required
							placeholder="Was hast du gemacht?"
						/>
						<label class="grid grid-cols-2 items-center mt-3">
							Dauer
							<input type="number" class="input p-2" bind:value={hours} />
						</label>
						<label class="flex justify-between items-center">
							<p>Diplomarbeit?</p>
							<input type="checkbox" class="w-10" bind:checked={diplomarbeit} />
						</label>
						<button class="btn variant-filled w-full mt-3">Stop Timer</button>
					</form>
					<button class="btn error-filled" on:click={() => cancelTimer($user)}>Cancel Timer</button>
				</div>
			{:else}
				<button class="btn variant-filled" on:click={() => startTimer($user)}>Start Timer</button>
			{/if}
		{:else}
			<button class="btn variant-filled" on:click={() => startTimer($user)}>Start Timer</button>
		{/if}
	{:else}
		<ProgressRadial />
	{/if}
</div>
