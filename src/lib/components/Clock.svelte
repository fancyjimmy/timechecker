<script lang="ts">
	export let startTime;
	export let endTime;

	$: timeDifference = (endTime.getTime() - startTime.getTime())
	$: hours = Math.floor(timeDifference / (1000 * 60 * 60))
	$: minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
	$: seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

	function pad(num, size) {
		num = num.toString();
		while (num.length < size) num = '0' + num;
		return num;
	}
</script>

<h2 class='{$$props.class}'>
	{pad(hours, 2)}:{pad(minutes, 2)}:{pad(seconds, 2)}
</h2>

