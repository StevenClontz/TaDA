<script lang="ts">
    import { onMount } from "svelte"
    import Graph from '$lib/Graph.svelte'
    import * as filtration from "$lib/filtration"

    let pointsBoard:JXG.Board
    let barcodeBoard:JXG.Board
    let points:JXG.Point[] = []
    let bars:JXG.Segment[] = []
    let epsilon = 0.2

    const barcodeBoardAttr:Partial<JXG.BoardAttributes> = {
        boundingbox: [-1, 1, 9, -11],
        showCopyright: false,
    }

    const dist = (p:JXG.Point,q:JXG.Point) => {
        return filtration.dist([p.X(),p.Y()],[q.X(),q.Y()])
    }

    const addPoint = (x:number,y:number) => {
        points = [
            ...points,
            pointsBoard.create(
                'point',
                [x,y],
                {withLabel:false},
            ),
        ]
        const i = points.length-1
        bars = [
            ...bars,
            barcodeBoard.create(
                'segment',
                [[0,0.5-points.length/2],[()=>1.6*5,0.5-points.length/2]],
                {strokeColor:points[i].getAttribute("strokeColor")}
            )
        ]
        pointsBoard.create(
            'circle',
            [points[points.length-1],()=>epsilon/2],
            {
                strokeColor: 'none',
                fillColor: '#0000ff08'
            },
        )
        points.slice(0,points.length-1).forEach(startPoint=>{
            let endPoint = points[points.length-1]
            pointsBoard.create(
                'segment',
                [startPoint,endPoint],
                {
                    visible: () => {
                        return dist(startPoint,endPoint) <= epsilon
                    },
                    strokeColor: "#0000ff"
                }
            )
        })
        points.slice(0,points.length-1).forEach((firstPoint,i)=>{
            points.slice(i+1,points.length-1).forEach(secondPoint=>{
                let lastPoint = points[points.length-1]
                pointsBoard.create(
                    'polygon',
                    [firstPoint,secondPoint,lastPoint],
                    {
                        visible: () => {
                            return (
                                dist(firstPoint,secondPoint) <= epsilon
                            ) && (
                                dist(firstPoint,lastPoint) <= epsilon
                            ) && (
                                dist(secondPoint,lastPoint) <= epsilon
                            )
                        },
                        fillColor: "#aa00aa",
                        fillOpacity: 0.8
                    }
                )
            })
        })
    }

    const addRandomPoint = () => {
        addPoint(Math.random(),Math.random())
    }

    let playIntervalId : number|undefined = undefined

    const togglePlayEpsilon = () => {
        if (!playIntervalId) {
            playIntervalId = setInterval(()=>{
                if (epsilon < 1.6) {
                    epsilon += 0.001
                    pointsBoard.update()
                } else {
                    epsilon = 0
                    pointsBoard.update()
                }
            },10)
        } else {
            clearInterval(playIntervalId)
            playIntervalId = undefined
        }
    }

    onMount(async () => {
        addPoint(0.09,0.81)
        addPoint(0.21,0.38)
        addPoint(0.32,0.99)
        addPoint(0.39,0.21)
        addPoint(0.50,0.59)
        addPoint(0.59,0.18)
        addPoint(0.61,0.91)
        addPoint(0.88,0.39)
        addPoint(0.91,0.82)
        barcodeBoard.create(
            "segment",
            [[()=>epsilon*5,0.5],[()=>epsilon*5,-10]],
            {
                strokeColor: "#0000ff44",
                dash: 1,
            }
        )
        barcodeBoard.create(
            "segment",
            [[0,0.5],[0,-10]],
            {
                strokeColor: "black",
                strokeWidth: 1,
            }
        )
        barcodeBoard.create(
            "arrow",
            [[0,-10],[8,-10]],
            {
                strokeColor: "black",
                strokeWidth: 1,
                name: "ε",
                withLabel: true,
                label: {
                    position: 'last'
                }
            }
        )
        pointsBoard.addChild(barcodeBoard)
        console.log(filtration.filtration(points.map(p=>[p.X(),p.Y()])))
    });
</script>

<svelte:head>
    <title>TaDA!</title>
</svelte:head>

<div class="boards">
    <Graph bind:board={pointsBoard}/>
    <Graph bind:board={barcodeBoard} attr={barcodeBoardAttr}/>
</div>

<button on:click={()=>addRandomPoint()} disabled={points.length>=15}>
    Add a random point
</button>

ε={epsilon.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3}
)}

<input 
    type="range" 
    min="0" 
    max="1.6" 
    step=".01"
    bind:value={epsilon}
    on:input={()=>pointsBoard.update()}/>

<button on:click={()=>togglePlayEpsilon()}>
    {#if playIntervalId}
        ⏸
    {:else}
        ▶
    {/if}
</button>

<style>
    .boards {
        display: flex;
    }
</style>