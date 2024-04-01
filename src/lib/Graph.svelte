<script lang="ts">
    import JXG from "./jsxgraph/jsxgraphcore.mjs"
    import { onMount } from "svelte"
    export let board:JXG.Board
    export let attr:Partial<JXG.BoardAttributes> = {
        boundingbox: [-0.1, 1.1, 1.1, -0.1],
        axis: true,
        showCopyright: false
    }
    let boardDiv:HTMLElement
    onMount(async () => {
        board = JXG.JSXGraph.initBoard(boardDiv, attr)
    });
</script>

<div 
    class="graph"
    bind:this={boardDiv}>
    <div class="loading">
        Loading...
    </div>
</div>

<style>
    .graph {
        width:400px;
        height:400px;
        border:solid 1px black;
    }
    .loading {
        width:100%;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>