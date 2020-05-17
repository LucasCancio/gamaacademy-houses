import { carregarMapa, longitudeAtual, latitudeAtual } from "./map.js";

carregarMapa();

document
  .querySelector("#btnMudarPagina")
  .addEventListener("click", mudarDePagina);

function mudarDePagina() {
  let queryString = "";
  if (latitudeAtual != undefined && longitudeAtual != undefined) {
    queryString = `?lat=${latitudeAtual}&long=${longitudeAtual}`;
  }
  window.location.href = "quartos.html" + queryString;
}
