<script lang="ts">
	import PreviousTimes from '$lib/components/PreviousTimes.svelte';
	import { user } from '$lib/util';
</script>

<PreviousTimes user={$user} />
