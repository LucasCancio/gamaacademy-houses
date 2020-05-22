import { criarCard } from "./components/cardElements.js";

const coordenadasSP = [-46.63018217699323, -23.5379366687732]; //longitude,latitude
let coordenadaAtual = coordenadasSP;

let map;
let longitudeAtual;
let latitudeAtual;

function carregarMapa(quartos=[]) {
  verificarParametros();
  
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic29sZGFkb3NzaiIsImEiOiJjazl5OXoxOWkwdDNjM21wczByZ201Y2lpIn0.AFfGNmlfd_6YKdXkQz3dOw";

  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: coordenadaAtual,
    zoom: 8,
  });

  let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  });

  new mapboxgl.Marker()
  .setLngLat(coordenadaAtual)
  .addTo(map);

  geocoder.on("result", function (ev) {
    longitudeAtual = ev.result.geometry.coordinates[0];
    latitudeAtual = ev.result.geometry.coordinates[1];
  });

  let searchBox = document.getElementById("search-box");
  if(searchBox != undefined){
    searchBox.innerHTML = "";
    searchBox.appendChild(geocoder.onAdd(map));
  }
  
  

  carregarMarcadores(map,quartos);

  console.log(">>> Mapa carregado!");
}

function carregarMarcadores(map,quartos) {
  quartos.forEach((quarto) => {
    let el = document.createElement("div");
    el.className = "marker";

    new mapboxgl.Marker(el)
      .setLngLat([quarto.longitude, quarto.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(criarCard(quarto))
      )
      .addTo(map);
  });
}

function verificarParametros() {
  var queryString = decodeURIComponent(window.location.search);

  queryString = queryString.substring(1);

  if (queryString != "") {
    let queryString = decodeURIComponent(window.location.search);
    let queries = queryString.split("&");

    if (queries.length == 2) {
      latitudeAtual = parseFloat(queries[0].split("=")[1]);
      longitudeAtual = parseFloat(queries[1].split("=")[1]);
      coordenadaAtual = [longitudeAtual, latitudeAtual];
    }
  }
}

export {carregarMapa, longitudeAtual, latitudeAtual}