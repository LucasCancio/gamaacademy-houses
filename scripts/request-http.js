async function getDataAsync(uri) {
  let response = await fetch(uri);
  let data = await response.json();
  return data;
}

export {getDataAsync};