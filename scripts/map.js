const coordenadasSP = [-46.63018217699323, -23.5379366687732]; //longitude,latitude
let coordenadaAtual = coordenadasSP;

let longitudeAtual;
let latitudeAtual;

function carregarMapa() {
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
  

  carregarMarcadores(map);
}

let map;

function carregarMarcadores(map) {
  listaPaginada.forEach((quarto) => {
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
