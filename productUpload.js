$(document).ready(function () {
  $("#productForm").on("submit", function (e) {
    e.preventDefault();

    var productData = {
      title: $("#title").val(),
      contents: $("#contents").val(),
      price: parseInt($("#price").val()),
    };

    $.ajax({
      url: "http://localhost:8090/products/new",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(productData),
      success: function (response) {
        console.log("상품이 성공적으로 등록되었습니다:", response);
        alert("상품이 성공적으로 등록되었습니다.");
        $("#productForm")[0].reset();
      },
      error: function (xhr, status, error) {
        console.error("상품 등록 실패:", error);
        alert("상품 등록에 실패했습니다. 다시 시도해주세요.");
      },
    });
  });

  // 가격 입력 필드에 숫자만 입력되도록 처리
  $("#price").on("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // 글자 수 제한 (상품명: 30자, 상품 설명: 제한 없음)
  $("#title").on("input", function () {
    var maxLength = 30;
    if (this.value.length > maxLength) {
      this.value = this.value.slice(0, maxLength);
    }
  });
});
