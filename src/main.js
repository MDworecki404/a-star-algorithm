import L from 'leaflet';
import './style.css';
import Network from './layers/network.json'
import { buildGraph } from './A_star/buildGraph';
import { aStar } from './A_star/buildGraph';


const map = L.map('map').setView([51.11, 17.05], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.geoJson(Network).addTo(map)
const graph = buildGraph();
const start = [17.011496443154478, 51.119100183029978];
const goal = [17.06495427311194, 51.11673102920231];

const path = aStar(start, goal, graph);
console.log('Najkrótsza trasa:', path);

const polyline = L.polyline(path.map(coord => [coord[1], coord[0]]), {
  color: 'blue',
  weight: 5,
  opacity: 0.7
}).addTo(map);
