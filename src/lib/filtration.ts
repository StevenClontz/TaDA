import * as graphlib from "@dagrejs/graphlib";

export const dist = (p:number[],q:number[]) => {
    return Math.sqrt(Math.pow(p[0]-q[0],2)+Math.pow(p[1]-q[1],2))
}

export const events = (points:number[][]) => {
    // Return the epsilons where points connect
    let epsilons = [0]
    Array(points.length).fill(0).forEach((_,i)=>{
        Array(points.length-1-i).fill(0).forEach((_,j)=>{
            j = i+j+1
            epsilons.push(dist(points[i],points[j]))
        })
    })
    epsilons = [...new Set(epsilons)]
    return epsilons.sort()
}

export const filtration = (points:number[][]) => {
    // Return array of graphs obtained at each epsilon
    return events(points).map(e=>{
        let g = new graphlib.Graph({directed:false})
        points.forEach((_,i)=>{
            g.setNode(`${i}`)
            Array(points.length).fill(0).forEach((_,i)=>{
                Array(points.length-1-i).fill(0).forEach((_,j)=>{
                    j = i+j+1
                    if (dist(points[i],points[j])<=e) {
                        g.setEdge(`${i}`,`${j}`)
                    }
                })
            })
        })
        return g
    })
}

export const componentLifes = (points:number[][]) => {
    const es = events(points)
    const f = filtration(points)
    // the age of a point is the epsilon where it merges into
    // a component with a lesser-indexed point
    return points.map((_,i)=>{
        return {
            birth: 0,
            death: es.find((_,j)=>{
                const compStr = graphlib.alg
                    .components(f[j])
                    .find(arr=>arr.includes(`${i}`))
                if (compStr) {
                    let comp = compStr
                        .map(n=>Number(n))
                        .sort()
                    if (comp[0]<i) {
                        return true
                    }
                }
            }) || undefined
        }
    })
}