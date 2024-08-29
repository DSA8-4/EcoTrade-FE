$(document).ready(function () {
  function fetchProducts() {
    $.ajax({
      url: "http://localhost:8090/products/list",
      type: "GET",
      success: function (response) {
        renderProducts(response);
        console.log(response);
      },
      error: function (error) {
        console.error("Error fetching products:", error);
      },
    });
  }

  function renderProducts(products) {
    $("#productList").empty();
    products.forEach((product) => {
      // 이미지 경로를 설정합니다. product.images.saved_image가 존재한다면 해당 경로를 사용합니다.
      const imageUrl =
        product.productImages && product.productImages.length > 0
          ? product.productImages[0].url // Firebase Storage에서 가져온 이미지 URL
          : "https://via.placeholder.com/200"; // 이미지가 없을 경우 기본 이미지를 사용합니다.

      const productHtml = `
        <div class="product">
          <a href="productDetail?id=${product.product_id}">
          <img src="${imageUrl}" alt="${product.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/200';">
          <h2>${product.title}</h2>
          <p>${product.contents}</p>
          <p>$${product.price}</p>
        </div>
      `;

      $("#productList").append(productHtml);
    });
  }

  // 초기 제품 목록을 가져옵니다.
  fetchProducts();
});
