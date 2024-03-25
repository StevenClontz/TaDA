<script lang="ts">
    import JXG from "./jsxgraph/jsxgraphcore.mjs"
    import { onMount } from "svelte"
    export let points:number[][]
    let boardDiv:HTMLElement
    let jsxgraph:any
    onMount(async () => {
        const graph = jsxgraph = JXG.JSXGraph.initBoard(boardDiv, {
            boundingbox: [-0.1, 1.1, 1.1, -0.1],
            axis: true,
            showCopyright: false
        })
        points.forEach(p=>{
            graph.create('point',p,{fixed:true});
        })
    });
</script>

<div bind:this={boardDiv} style="width:600px;height:600px"/>
