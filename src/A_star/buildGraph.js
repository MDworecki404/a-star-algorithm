import Network from '../layers/network.json';

export const buildGraph = () => {
    console.log('Rozpoczęcie budowy grafu');

    let nodes = [];
    let edges = new Map();
    const coords = Network.features[0].geometry.coordinates;
    
    coords.forEach(line => {
        for (let i = 0; i < line.length; i++) {
            const point = line[i];
            const exists = nodes.some(node => node[0] === point[0] && node[1] === point[1]);
            if (!exists) {
                nodes.push(point);
            }
            
            if (i > 0) {
                const prevPoint = line[i - 1];
                addEdge(edges, prevPoint, point);
                addEdge(edges, point, prevPoint);
            }
        }
    });
    
    console.log('Węzły grafu:', nodes);
    console.log('Połączenia grafu:', edges);
    return { nodes, edges };
};

const addEdge = (edges, from, to) => {
    const key = JSON.stringify(from);
    if (!edges.has(key)) {
        edges.set(key, []);
    }
    
    const neighbors = edges.get(key);
    if (!neighbors.some(n => n[0] === to[0] && n[1] === to[1])) {
        neighbors.push(to);
    }
};

const heuristic = (a, b) => {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
};

export const aStar = (start, goal, graph) => {
    const { nodes, edges } = graph;
    const startKey = JSON.stringify(start);
    const goalKey = JSON.stringify(goal);

    let openSet = new Set([startKey]);
    let cameFrom = new Map();
    let gScore = new Map(nodes.map(node => [JSON.stringify(node), Infinity]));
    let fScore = new Map(nodes.map(node => [JSON.stringify(node), Infinity]));

    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic(start, goal));

    while (openSet.size > 0) {
        let current = [...openSet].reduce((a, b) => fScore.get(a) < fScore.get(b) ? a : b);
        
        if (current === goalKey) {
            let path = [];
            while (cameFrom.has(current)) {
                path.push(JSON.parse(current));
                current = cameFrom.get(current);
            }
            path.push(start);
            return path.reverse();
        }

        openSet.delete(current);
        let neighbors = edges.get(current) || [];

        for (let neighbor of neighbors) {
            let neighborKey = JSON.stringify(neighbor);
            let tentativeGScore = gScore.get(current) + heuristic(JSON.parse(current), neighbor);

            if (tentativeGScore < gScore.get(neighborKey)) {
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, goal));
                openSet.add(neighborKey);
            }
        }
    }
    return [];
};
