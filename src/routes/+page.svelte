<script lang="ts">
    import Graph from '$lib/Graph.svelte'
    let board:JXG.Board
    let points:JXG.Point[] = []
    let epsilon = 0.2
    const addPoint = (x:number,y:number) => {
        points = [
            ...points,
            board.create(
                'point',
                [x,y],
                {withLabel:false},
            ),
        ]
        board.create(
            'circle',
            [points[points.length-1],()=>epsilon/2],
            {
                strokeColor: 'none',
                fillColor: '#0000ff08'
            },
        )
        points.slice(0,points.length-1).forEach(startPoint=>{
            let endPoint = points[points.length-1]
            board.create(
                'segment',
                [startPoint,endPoint],
                {
                    visible: () => {
                        return Math.pow(startPoint.X()-endPoint.X(),2) +
                            Math.pow(startPoint.Y()-endPoint.Y(),2) <=
                            Math.pow(epsilon,2)
                    },
                    strokeColor: "#0000ff"
                }
            )
        })
        points.slice(0,points.length-1).forEach((firstPoint,i)=>{
            points.slice(i+1,points.length-1).forEach(secondPoint=>{
                let lastPoint = points[points.length-1]
                board.create(
                    'polygon',
                    [firstPoint,secondPoint,lastPoint],
                    {
                        visible: () => {
                            return (
                                Math.pow(firstPoint.X()-secondPoint.X(),2) +
                                Math.pow(firstPoint.Y()-secondPoint.Y(),2) <=
                                Math.pow(epsilon,2)
                            ) && (
                                Math.pow(firstPoint.X()-lastPoint.X(),2) +
                                Math.pow(firstPoint.Y()-lastPoint.Y(),2) <=
                                Math.pow(epsilon,2)
                            ) && (
                                Math.pow(lastPoint.X()-secondPoint.X(),2) +
                                Math.pow(lastPoint.Y()-secondPoint.Y(),2) <=
                                Math.pow(epsilon,2)
                            )
                        },
                        fillColor: "#aa00aa",
                        fillOpacity: 0.8
                    }
                )
            })
        })
    }
</script>
<svelte:head>
    <title>TDA</title>
</svelte:head>

<Graph bind:board={board}/>

<button on:click={()=>addPoint(Math.random(),Math.random())}>
    Add a random point
</button>

ε={epsilon.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2}
)}

<input type="range" min="0" max="2" bind:value={epsilon} on:input={()=>board.update()} step=".01">

