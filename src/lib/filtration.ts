import Graph from 'graphology'
import {connectedComponents} from 'graphology-components'
import {dfsFromNode} from 'graphology-traversal'
import { subgraph } from 'graphology-operators'

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
        let g = new Graph({type:'undirected'})
        points.forEach((_,i)=>{
            g.addNode(`${i}`)
        })
        Array(points.length).fill(0).forEach((_,i)=>{
            Array(points.length-1-i).fill(0).forEach((_,j)=>{
                j = i+j+1
                if (dist(points[i],points[j])<=e) {
                    g.addEdge(`${i}`,`${j}`)
                }
            })
        })
        return g
    })
}

export const minCycles = (g:Graph) => {
    let cycles:string[][] = []
    const nodes = g.nodes()
    nodes.forEach((n,i)=>{
        const sg = subgraph(g,nodes.slice(i))
        let cycleCandidate:string[] = []
        dfsFromNode(sg,n,(m,_,depth)=>{
            cycleCandidate = cycleCandidate.slice(0,depth)
            cycleCandidate.push(m)
            if (depth >= 1 && sg.neighbors(m).some(k=>sg.neighbors(n).includes(k))) {
                sg.neighbors(m).filter(k=>sg.neighbors(n).includes(k)).forEach(k=>{
                    if (!cycleCandidate.includes(k)) {
                        const newCycle = [...cycleCandidate,k].toSorted()
                        if (!cycles.map(c=>JSON.stringify(c)).includes(JSON.stringify(newCycle))) {
                            cycles.push(newCycle)
                        }
                    }
                })
                return true
            }
        })
    })
    return cycles
}

export const componentLives = (points:number[][]) => {
    const es = events(points)
    const f = filtration(points)
    // the age of a component is the epsilon where it merges into
    // a component with a lesser-indexed point
    return points.map((_,i)=>{
        return {
            birth: 0,
            death: es.find((_,j)=>{
                const compStr = connectedComponents(f[j])
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

export const loopLives = (points:number[][]) => {
    const es = events(points)
    const f = filtration(points)
    let lives:{birth:number,death:number,birthCycle:string[]}[] = []
    f.slice(0,f.length-1).forEach((g,i)=>{
        // get all cycles of length > 3
        const cycles = minCycles(g).filter(c=>c.length>3)
        cycles.forEach(c=>{
            // look for existing lives
            const lifeCandidates = lives
                .filter(l=>c.every(t=>l.birthCycle.includes(t)))
                .sort((a,b)=>a.birth-b.birth)
            // if we have a candidate that's dead, we extend its life
            if (lifeCandidates.length > 0 && lifeCandidates[0].death==es[i]) {
                lifeCandidates[0].death=es[i+1]
            // otherwise we have a new life
            } else {
                lives.push({
                    birth:es[i],
                    death:es[i+1], // we will extend next iteration if it survives
                    birthCycle:c
                })
            }
        })
    })
    return lives
}