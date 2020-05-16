function mudarDePagina() {
    let queryString = "";
    if (latitudeAtual != undefined && longitudeAtual != undefined) {
      queryString = `?lat=${latitudeAtual}&long=${longitudeAtual}`;
    }
    window.location.href = "quartos.html" + queryString;
  }
  