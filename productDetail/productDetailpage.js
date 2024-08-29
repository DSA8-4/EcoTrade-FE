document.addEventListener("DOMContentLoaded", function () {
  // URL에서 productId 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");

  if (productId) {
    fetch(`http://localhost:8090/products/detail/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found");
        }
        return response.json();
      })
      .then((product) => {
        document.getElementById("product-name").innerText = product.name;
        document.getElementById("product-description").innerText =
          product.description;
        document.getElementById("product-price").innerText = product.price;
        document.getElementById("product-hits").innerText = product.hits;

        if (product.productImages && product.productImages.length > 0) {
          const imgElement = document.createElement("img");
          imgElement.src = product.productImages[0].url; // 첫 번째 이미지 사용
          document.getElementById("product-image").appendChild(imgElement);
        }
      })
      .catch((error) => {
        document.getElementById("product-name").innerText = "Product not found";
        console.error("Error:", error);
      });
  } else {
    document.getElementById("product-name").innerText = "No product selected";
  }
});
