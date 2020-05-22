import {
  filtrarPorCategoria,
  ordenarPorPreco,
  ordenarPorRelevancia,
} from "./filter.js";

import { getDataAsync } from "./request-http.js";

import { carregarMapa } from "./map.js";

import { criarCard } from "./components/cardElements.js";

let quartos = [];
let categorias = new Set();

const uriAPI =
"https://v2-api.sheety.co/45a40658ca522915f0823cb3352a77c5/gamaHouses/houses";

document.querySelector("body").addEventListener("load", carregarQuartos());

function carregarQuartos() {
  getDataAsync(uriAPI).then((data) => {
    quartos = data["houses"];
    lista = quartos;
    
    acrescentarInformacao();
    carregarPaginacao(lista);
    paginaAtual=1;
    carregarLista();
    
    let tipos = [];
    quartos.forEach((quarto) => {
      tipos.push(quarto.propertyType);
    });
    
    categorias = new Set(tipos);
    
    carregarCategorias();
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

  document.querySelectorAll(".indice").forEach(element => {
    element.addEventListener("click",()=>mudarPagina(element.id));
  });

  document.getElementById("previousPage").addEventListener("click",()=>{
    voltarPagina();
  });
  document.getElementById("nextPage").addEventListener("click",()=>{
    avancarPagina();
  });
  
}

///PAG

let lista = [];
let listaPaginada = [];
let paginaAtual = 1;
let itensPorPagina = 6;
let totalDePaginas = 1;

function carregarLista() {
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const final = inicio + itensPorPagina;

  listaPaginada = lista.slice(inicio, final);

  atualizarQuartos(listaPaginada);
  validarBotoes();
  carregarMapa();
}



function criarIndicesPagina() {
  let lines = "";
  for (let i = 1; i <= totalDePaginas; i++) {
    if (i == paginaAtual) {
      lines += `<li id="${i}" class="page-item active indice"><a class="page-link">${i}</a></li>`;
    } else {
      lines += `<li id="${i}" class="page-item indice"><a class="page-link">${i}</a></li>`;
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
                <a class="page-link" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
                </li>
                ${criarIndicesPagina()}
                <li id="nextPage" class="page-item">
                <a class="page-link" aria-label="Next">
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
  console.log("avançando")
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

const ordenacoes = {
  CATEGORIA: 0,
  RELEVANCIA: 1,
  PRECO: 2,
};

const aplicarOrdenacao = (ordenacao) => {
  switch (ordenacao) {
    case ordenacoes.CATEGORIA:
      lista = filtrarPorCategoria(categoria, quartos);
      break;
    case ordenacoes.RELEVANCIA:
      lista = ordenarPorRelevancia(lista);
      break;
    case ordenacoes.PRECO:
      lista = ordenarPorPreco(lista);
      break;
  }

  carregarPaginacao(lista);
  paginaAtual=1;
  carregarLista();
};

document.querySelector("#categorias").addEventListener("change", () => {
  aplicarOrdenacao(ordenacoes.CATEGORIA);
});

document.querySelector("#btnPreco").addEventListener("click", () => {
  aplicarOrdenacao(ordenacoes.PRECO);
});

document.querySelector("#btnRelevancia").addEventListener("click", () => {
  aplicarOrdenacao(ordenacoes.RELEVANCIA);
});
