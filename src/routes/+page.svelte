<script lang="ts">
    import JXG from "$lib/jsxgraphcore.mjs"
    import { onMount } from "svelte"
    let boardDiv:HTMLElement
    onMount(async () => {
        JXG.JSXGraph.initBoard(boardDiv, {
            boundingbox: [-5, 5, 5, -5],
            axis: true
        }).create('functiongraph', ['exp(x)'])
    });
</script>

<div bind:this={boardDiv} style="width:800px;height:600px"/>
