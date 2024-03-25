<script lang="ts">
    import JXG from "$lib/jsxgraph/jsxgraphcore.mjs"
    import { onMount } from "svelte"
    let boardDiv:HTMLElement
    let jsxgraph:any
    onMount(async () => {
        jsxgraph = JXG.JSXGraph.initBoard(boardDiv, {
            boundingbox: [-5, 5, 5, -5],
            axis: true
        }).create('functiongraph', ['exp(x)'])
    });
</script>

<div bind:this={boardDiv} style="width:800px;height:600px"/>
