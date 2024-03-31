<script lang="ts">
    import Graph from '$lib/Graph.svelte'
    const points = [
        [0.4,0.7],
        [0.1,0.9]
    ]
</script>
<svelte:head>
    <title>TDA</title>
</svelte:head>

<Graph {points}/>
