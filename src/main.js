import L from 'leaflet';
import './style.css';
import Network from './layers/network.json'
import NetworkUPWR from './layers/UPWR_network.json'
import { buildGraph } from './A_star/A-star_algorithm';
import { aStar } from './A_star/A-star_algorithm';

const map = L.map('map').setView([51.11, 17.05], 14);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.geoJson(NetworkUPWR).addTo(map)
const graph = buildGraph();
const start = [17.0629621, 51.1128680];
const goal = [17.0981141, 51.1027081];

const path = aStar(start, goal, graph);
console.log('Najkrótsza trasa:', path);

const polyline = L.polyline(path.map(coord => [coord[1], coord[0]]), {
  color: 'blue',
  weight: 5,
  opacity: 0.7
}).addTo(map);
