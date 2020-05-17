function criarCard(quarto) {
  let { photo, propertyType, name, price, descricao, star } = quarto;

  return `<div class="card m-1">
    <img class="card-img-top" src="${photo}" alt="Card image cap" />
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <span>
          <i class="fa fa-home" aria-hidden="true"></i>${propertyType}
          </span>
        <span><i class="fa fa-star" aria-hidden="true"></i>${star}</span>
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

export { criarCard };
