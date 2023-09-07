<script lang="ts">
	import { supabase } from '$lib/supabase';
	import Clock from '$lib/components/Clock.svelte';
	import { onMount } from 'svelte';

	export let user;
	let times = [];

	onMount(() => {
		loadPastTimes();
	})
	async function loadPastTimes(){
		const {data, error } = await $supabase.from("timer").select("*").eq("user", user);
		console.log(data);
		console.log(error);
		if (data){
			data.forEach((value) => {
				value.created_at = new Date(value.created_at);

				if (value.ended_at !== null){
				value.ended_at = new Date(value.ended_at);
				}
			})
			times = data;
		}
	}
	$: totalTime = times.reduce((prev, current) => {
		if (current.ended_at){
			return prev + current.ended_at.getTime() - current.created_at.getTime();
		}
		return prev;
	}, 0);
</script>

<div class='flex justify-between'>
<Clock startTime={new Date(null)} endTime={new Date(totalTime)}/>
<button on:click={loadPastTimes}>🔃</button>
</div>
<div class='max-h-24 overflow-y-auto'>
{#each times as time}
		{#if time.ended_at !== null}
	<div class='p-2'>
		<p class='text-sm font-semibold'>
		{time.created_at.toLocaleString()}
		</p>
		<Clock class='text-center font-bold' startTime={time.created_at} endTime={time.ended_at}/>
		<p class='text-ellipsis'>
		{time.chore}
		</p>
	</div>
		{/if}
{/each}
</div>
