<script lang="ts">
	import { supabase } from '$lib/supabase';
	import Clock from '$lib/components/Clock.svelte';
	import { onMount } from 'svelte';

	export let user;
	let times = [];

	onMount(() => {
		loadPastTimes();
	});
	async function loadPastTimes() {
		const { data, error } = await $supabase.from('timer').select('*').eq('user', user);
		console.log(data);
		console.log(error);
		if (data) {
			data.forEach((value) => {
				value.created_at = new Date(value.created_at);

				if (value.ended_at !== null) {
					value.ended_at = new Date(value.ended_at);
				}
			});
			times = data;
		}
	}
	$: totalTime = filteredTimes.reduce((prev, current) => {
		if (current.ended_at) {
			return prev + current.ended_at.getTime() - current.created_at.getTime();
		}
		return prev;
	}, 0);

	$: filteredTimes = times.filter((value) => {
		if (state === 'Beides') {
			return true;
		}
		if (state === 'Diplomarbeit') {
			return value.diplomarbeit;
		}
		if (state === 'Projekt') {
			return !value.diplomarbeit;
		}
		return false;
	});

	let state: 'Diplomarbeit' | 'Projekt' | 'Beides' = 'Beides';
</script>

<div class="p-3">
	<div class="flex font-bold gap-3 text-4xl">
		<p>Gesamte Zeit</p>
		<Clock startTime={new Date(null)} endTime={new Date(totalTime)} />
	</div>
	<div>
		{#each filteredTimes as time}
			{#if time.ended_at !== null}
				<div class="p-2 bg-white rounded-xl border-2 border-black cool">
					<p class="text-sm font-semibold">
						{time.created_at.toLocaleString()}
					</p>
					<Clock
						class="text-center font-bold"
						startTime={time.created_at}
						endTime={time.ended_at}
					/>
					<p class="text-ellipsis">
						{time.chore}
					</p>
				</div>
			{/if}
		{/each}
	</div>
</div>


<style>
	.cool{
			box-shadow: -10px 10px 0 black;
	}
</style>