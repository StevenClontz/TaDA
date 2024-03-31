<script lang="ts">
    import JXG from "./jsxgraph/jsxgraphcore.mjs"
    import { onMount } from "svelte"
    export let points:number[][]
    let boardDiv:HTMLElement
    let jsxgraph:JXG.Board
    onMount(async () => {
        jsxgraph = JXG.JSXGraph.initBoard(boardDiv, {
            boundingbox: [-0.1, 1.1, 1.1, -0.1],
            axis: true,
            showCopyright: false
        })
        points.forEach(p=>{
            jsxgraph.create('point',p,{fixed:true});
        })
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
        width:600px;
        height:600px;
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