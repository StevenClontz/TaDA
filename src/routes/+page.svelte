<script lang="ts">
    import Graph from '$lib/Graph.svelte'
    let board:JXG.Board
    let points:JXG.Point[] = []
    let circles:JXG.Circle[] = []
    let edges:JXG.Segment[][] = []
    let faces:JXG.Polygon[][][] = []
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
        circles = [
            ...circles,
            board.create(
                'circle',
                [points[points.length-1],()=>epsilon/2],
                {
                    strokeColor: 'none',
                    fillColor: '#0000ff08'
                },
            ),
        ]
        edges.forEach((pointEdges,i)=>{
            let p0 = points[i]
            let p1 = points[points.length-1]
            edges[i] = [
                ...pointEdges,
                board.create(
                    'segment',
                    [p0,p1],
                    {
                        visible: () => {
                            return Math.pow(p0.X()-p1.X(),2) +
                                Math.pow(p0.Y()-p1.Y(),2) <=
                                Math.pow(epsilon,2)
                        },
                        strokeColor: "#0000ff"
                    }
                )
            ]
        })
        edges = [
            ...edges,
            []
        ]
        faces.forEach((pointPairs,i)=>{
            pointPairs.forEach((pairFaces,j)=>{
                let p0 = points[i]
                let p1 = points[j]
                let p2 = points[points.length-1]
                faces[i][j] = [
                    ...pairFaces,
                    board.create(
                        'polygon',
                        [p0,p1,p2],
                        {
                            visible: () => {
                                return (Math.pow(p0.X()-p1.X(),2) +
                                    Math.pow(p0.Y()-p1.Y(),2) <=
                                    Math.pow(epsilon,2)) &&
                                    (Math.pow(p0.X()-p2.X(),2) +
                                    Math.pow(p0.Y()-p2.Y(),2) <=
                                    Math.pow(epsilon,2)) &&
                                    (Math.pow(p2.X()-p1.X(),2) +
                                    Math.pow(p2.Y()-p1.Y(),2) <=
                                    Math.pow(epsilon,2))
                            },
                            fillColor: "#880088",
                            fillOpacity: 1,
                        }
                    )
                ]
            })
        })
        faces = [
            ...faces,
            [[]]
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

<input type="number" on:change={()=>board.update()} bind:value={epsilon}/>
