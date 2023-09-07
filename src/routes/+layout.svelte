<script lang="ts">
	import '../theme.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	import { supabase, session } from '$lib/supabase';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		AppBar,
		AppShell,
		Drawer,
		drawerStore,
		LightSwitch,
		Modal
	} from '@skeletonlabs/skeleton';

	export let data;

	$: $supabase = data.supabase;
	$: $session = data.session;

	onMount(() => {
		const {
			data: { subscription }
		} = $supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}

			$session = _session;
		});

		return () => subscription.unsubscribe();
	});
</script>

<slot/>

<Modal />
