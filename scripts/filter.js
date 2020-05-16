const ordenacao = {
  DESLIGADO: 1,
  CRESCENTE: 2,
  DESCRECENTE: 3,
};

let ordenacaoPreco = ordenacao.DESLIGADO;
let ordenacaoRelevancia = ordenacao.DESLIGADO;

function filtrarPorCategoria(lista) {
  let categoria = document.getElementById("categorias").value;

  if (categoria != "") {
    lista = quartos.filter((quarto) => {
      let temCategoria =
        quarto.propertyType.toUpperCase() == categoria.toUpperCase();
      return temCategoria;
    });
  }

  if (ordenacaoPreco != ordenacao.DESLIGADO) {
    lista = ordenarPorPreco(lista);
  } else if (ordenacaoRelevancia != ordenacao.DESLIGADO) {
    lista = ordenarPorRelevancia(lista);
  }

  return lista;
}

function ordenarPorPreco(lista) {
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

  return lista;
}

function ordenarPorRelevancia(lista) {
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

  return lista;
}

export { filtrarPorCategoria, ordenarPorPreco, ordenarPorRelevancia };


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


