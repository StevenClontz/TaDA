import { Graph } from "@dagrejs/graphlib";

export const dist = (p:number[],q:number[]) => {
    return Math.sqrt(Math.pow(p[0]-q[0],2)+Math.pow(p[1]-q[1],2))
}

export const filtration = (points:number[][]) => {
    // First, find the epsilons where points connect
    let epsilons = [0]
    Array(points.length).fill(0).forEach((_,i)=>{
        Array(points.length-1-i).fill(0).forEach((_,j)=>{
            j = i+j+1
            epsilons.push(dist(points[i],points[j]))
        })
    })
    epsilons = [...new Set(epsilons)]
    epsilons = epsilons.sort()

    // Then return array of graphs obtained at each epsilon
    return epsilons.map(e=>{
        let g = new Graph({directed:false})
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