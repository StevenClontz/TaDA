<script lang="ts">
    import Graph from '$lib/Graph.svelte'
    let board:JXG.Board
    let points:JXG.Point[] = []
    let circles:JXG.Circle[] = []
    let epsilon = 0.02
    const addPoint = (x:number,y:number) => {
        points = [
            ...points,
            board.create(
                'point',
                [x,y],
                {withLabel:false},
            ),
        ]
        circles = [
            ...circles,
            board.create(
                'circle',
                [points[points.length-1],epsilon],
                {
                    strokeColor: 'none',
                    fillColor: '#0000ff11'
                },
            ),
        ]
    }
</script>
<svelte:head>
    <title>TDA</title>
</svelte:head>

<Graph bind:board={board}/>

<button on:click={()=>addPoint(Math.random(),Math.random())}>
    Add a random point
</button>
