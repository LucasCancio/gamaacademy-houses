let quartos = [];
let categorias = new Set();

const uriAPI =
  "https://v2-api.sheety.co/45a40658ca522915f0823cb3352a77c5/gamaHouses/houses";

function carregarQuartos() {
  getDataAsync(uriAPI).then((data) => {
    quartos = data["houses"];
    lista = quartos;

    acrescentarInformacao();
    carregarPaginacao();
    carregarLista();

    let tipos = [];
    quartos.forEach((quarto) => {
      tipos.push(quarto.propertyType);
    });

    categorias = new Set(tipos);

    carregarCategorias();
    carregarMapa();
  });
}

function acrescentarInformacao() {
  function gerarDescricao() {
    let numerosAleatorios = [];
    for (let i = 0; i < 4; i++) {
      let numeroAleatorio = Math.floor(Math.random() * 10);
      while (numeroAleatorio == 0) {
        numeroAleatorio = Math.floor(Math.random() * 10);
      }

      numerosAleatorios.push(numeroAleatorio);
    }
    let [hospedes, quartos, camas, banheiros] = numerosAleatorios;

    return `${hospedes} hóspede(s) · ${quartos} quarto(s) · ${camas} cama(s) · ${banheiros} banheiro(s)`;
  }

  quartos.forEach((quarto) => {
    quarto.descricao = gerarDescricao();
  });

  return quartos;
}

function atualizarQuartos(quartos) {
  let catalogo = document.getElementById("catalogo");
  let paginacao = document.getElementById("paginacao");

  catalogo.innerHTML = "";
  paginacao.innerHTML = "";

  quartos.forEach((quarto) => {
    catalogo.innerHTML += criarCard(quarto);
  });

  paginacao.appendChild(criarPaginacao());
}

function criarCard(quarto) {
  let { photo, propertyType, name, price, descricao, star } = quarto;

  return `
    <div class="card flex-row flex-wrap">          
      <div class="card-header border-0">
        <img src="${photo}" alt="" />
      </div>
      <div class="card-body px-2">
        <div class="row">
          <span class="col-10">
          <i class="fa fa-home" aria-hidden="true"></i>${propertyType}</span>
          <span class="col-2"><i class="fa fa-star" aria-hidden="true"></i>${star}</span>
        </div>
        <h4 class="card-title">${name}</h4>
        <p class="card-text">${descricao}</p>
        <div class="d-flex justify-content-center">
          <b>R$${price}</b>
          /mês
        </div>          
      </div>
    </div>`;
}

carregarQuartos();

//CATEGORIA

function carregarCategorias() {
  let divCategorias = document.getElementById("categorias");

  divCategorias.innerHTML = `
  <option value=''>
      Todas
    </option>
  `;

  categorias.forEach((categoria) => {
    divCategorias.innerHTML += `
        <option value='${categoria}'>
            ${categoria}
          </option>
        `;
  });
}

//FILTRO E ORDENAÇÃO

const ordenacao = {
  DESLIGADO: 1,
  CRESCENTE: 2,
  DESCRECENTE: 3,
};

let ordenacaoPreco = ordenacao.DESLIGADO;
let ordenacaoRelevancia = ordenacao.DESLIGADO;

function filtrarPorCategoria(object) {
  let categoria = object.value;

  if (categoria == "") {
    lista = quartos;
  } else {
    lista = quartos.filter((quarto) => {
      let temCategoria =
        quarto.propertyType.toUpperCase() == categoria.toUpperCase();
      return temCategoria;
    });
  }

  carregarPaginacao();
  carregarLista();

  if (ordenacaoPreco != ordenacao.DESLIGADO) {
    ordenarPorPreco();
  } else if (ordenacaoRelevancia != ordenacao.DESLIGADO) {
    ordenarPorRelevancia();
  }
}

function ordenarPorPreco() {
  ordenacaoRelevancia = ordenacao.DESLIGADO;

  ordenacaoPreco++;
  if (ordenacaoPreco > ordenacao.DESCRECENTE) {
    ordenacaoPreco = ordenacao.DESLIGADO;
  }
  trocarOrdem();

  switch (ordenacaoPreco) {
    case ordenacao.DESLIGADO:
      break;
    case ordenacao.CRESCENTE:
      lista = lista.sort(function (quarto1, quarto2) {
        return quarto1.price - quarto2.price;
      });
      break;
    case ordenacao.DESCRECENTE:
      lista = lista.sort(function (quarto1, quarto2) {
        return quarto2.price - quarto1.price;
      });
      break;
  }

  carregarPaginacao();
  carregarLista();
}

function ordenarPorRelevancia() {
  ordenacaoPreco = ordenacao.DESLIGADO;

  ordenacaoRelevancia++;
  if (ordenacaoRelevancia > ordenacao.DESCRECENTE) {
    ordenacaoRelevancia = ordenacao.DESLIGADO;
  }

  trocarOrdem();

  switch (ordenacaoRelevancia) {
    case ordenacao.DESLIGADO:
      break;
    case ordenacao.CRESCENTE:
      lista = lista.sort(function (quarto1, quarto2) {
        return quarto1.star - quarto2.star;
      });
      break;
    case ordenacao.DESCRECENTE:
      lista = lista.sort(function (quarto1, quarto2) {
        return quarto2.star - quarto1.star;
      });
      break;
  }

  carregarPaginacao();
  carregarLista();
}

function trocarOrdem() {
  let elementoRelevancia = document.getElementById("relevancia");
  mudarClasseOrdenacao(elementoRelevancia, ordenacaoRelevancia);

  let elementoPreco = document.getElementById("preco");
  mudarClasseOrdenacao(elementoPreco, ordenacaoPreco);
}

function mudarClasseOrdenacao(elemento, ordenacaoParaTrocar) {
  switch (ordenacaoParaTrocar) {
    case ordenacao.DESLIGADO:
      elemento.className = "fa fa-fw fa-sort";
      break;
    case ordenacao.CRESCENTE:
      elemento.className = "fa fa-fw fa-sort-up";
      break;
    case ordenacao.DESCRECENTE:
      elemento.className = "fa fa-fw fa-sort-down";
      break;
  }
}

// REQUEST HTTP

async function getDataAsync(uri) {
  let response = await fetch(uri);
  let data = await response.json();
  return data;
}

//PAGINAÇAO

let lista = [];
let listaPaginada = [];
let paginaAtual = 1;
let itensPorPagina = 6;
let totalDePaginas = 1;

function criarIndicesPagina() {
  let lines = "";
  for (let i = 1; i <= totalDePaginas; i++) {
    if (i == paginaAtual) {
      lines += `<li id="page-${i}" class="page-item active"><a class="page-link" onclick="mudarPagina(${i})">${i}</a></li>`;
    } else {
      lines += `<li id="page-${i}" class="page-item"><a class="page-link" onclick="mudarPagina(${i})">${i}</a></li>`;
    }
  }

  return lines;
}

function criarPaginacao() {
  let row = document.createElement("div");
  row.className = "row row-pagination";

  row.innerHTML = `
    <div class="col-md-12">
        <nav>
            <ul class="pagination">
                <li id="previousPage" class="page-item">
                <a class="page-link" onclick="voltarPagina()" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
                </li>
                ${criarIndicesPagina()}
                <li id="nextPage" class="page-item">
                <a class="page-link" onclick="avancarPagina()" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </a>
                </li>
            </ul>
        </nav>
    </div>
  `;

  return row;
}

function carregarPaginacao() {
  totalDePaginas = Math.ceil(lista.length / itensPorPagina);
  paginaAtual = 1;
}

function avancarPagina() {
  paginaAtual += 1;
  carregarLista();
  redirecionar();
}

function mudarPagina(page) {
  paginaAtual = page;
  carregarLista();
  redirecionar();
}

function voltarPagina() {
  paginaAtual -= 1;
  carregarLista();
  redirecionar();
}

function redirecionar() {
  window.location.href = "#index";
}

function carregarLista() {
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const final = inicio + itensPorPagina;

  listaPaginada = lista.slice(inicio, final);

  atualizarQuartos(listaPaginada);
  validarBotoes();
  carregarMapa();
}

function validarBotoes() {
  let previousButton = document.getElementById("previousPage");
  let nextButton = document.getElementById("nextPage");

  nextButton.style.display = "none";
  previousButton.style.display = "none";

  if (paginaAtual != totalDePaginas) {
    nextButton.style.display = "list-item";
  }
  if (paginaAtual != 1) {
    previousButton.style.display = "list-item";
  }
}

//MAP

const cordenadasSP = [-46.63018217699323, -23.5379366687732]; //long,lat

function carregarMapa() {
  let searchBox = document.getElementById("search-box");
  searchBox.innerHTML = "";

  mapboxgl.accessToken =
    "pk.eyJ1Ijoic29sZGFkb3NzaiIsImEiOiJjazl5OXoxOWkwdDNjM21wczByZ201Y2lpIn0.AFfGNmlfd_6YKdXkQz3dOw";
  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: cordenadasSP,
    zoom:8,
  });

  let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  });

  searchBox.appendChild(geocoder.onAdd(map));
  carregarMarcadores(map);
}

function carregarMarcadores(map) {
  listaPaginada.forEach((quarto) => {
    let el = document.createElement("div");
    el.className = "marker";

    console.log(el);
    new mapboxgl.Marker(el)
      .setLngLat([quarto.longitude, quarto.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML(criarMiniCard(quarto))
      )
      .addTo(map);
  });
}

function criarMiniCard(quarto) {
  let { photo, propertyType, name, price, descricao, star } = quarto;

  return `<div class="card m-1">
  <img class="card-img-top" src="${photo}" alt="Card image cap" />
  <div class="card-body">
    <div class="row">
      <span class="col-8">
        <i class="fa fa-home" aria-hidden="true"></i>${propertyType}</span
      >
      <span class="col-4"
        ><i class="fa fa-star" aria-hidden="true"></i>${star}</span
      >
    </div>
    <h4 class="card-title text-center">${name}</h4>
    <p class="card-text text-center">${descricao}</p>
    <div class="d-flex justify-content-center">
      <b>R$${price}</b>
      /mês
    </div>
  </div>
</div>`;
}
