<script lang="ts">
	import { user } from '$lib/util';
	import { supabase } from '$lib/supabase';

	let startTime;
	let endTime;
	let text;

	async function stopTimerWithStartAndEndTime(
		user: string,
		text: string,
		startTime: string,
		endTime: string,
		diplomarbeit: boolean
	) {
		const { data, error } = await $supabase.from('timer').insert({
			user: user,
			chore: text,
			created_at: new Date(startTime),
			ended_at: new Date(endTime),
			diplomarbeit: diplomarbeit
		});
	}

	let diplomarbeit = false;
</script>

<form
	class="p-5"
	action='/history'
	method='get'
	on:submit={() => {
		stopTimerWithStartAndEndTime($user, text, startTime, endTime, diplomarbeit);
	}}
>
	<h1 class="text-3xl mb-3 font-bold">Eintrag</h1>
	<textarea bind:value={text} class="input h-40" placeholder='Was hast du gemacht?' required />
	<div class="grid grid-cols-2 gap-3 mt-3">
		<label class="grid grid-cols-2 items-center">
			von
			<input type="datetime-local" class="input p-2" bind:value={startTime} required/>
		</label>
		<label class="grid grid-cols-2 items-center">
			bis
			<input type="datetime-local" class="input p-2" bind:value={endTime} required />
		</label>
	</div>
	<label class="flex justify-between items-center">
		<p>Diplomarbeit?</p>
		<input type="checkbox" class="w-10" bind:checked={diplomarbeit} />
	</label>
	<button class="btn variant-filled w-full mt-3">Create Entry</button>
</form>
