$(document).ready(function () {
  // URL에서 상품 ID 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    // 상품 정보 불러오기
    $.ajax({
      url: `http://localhost:8090/products/${productId}`,
      type: "GET",
      success: function (product) {
        $("#productId").val(product.id);
        $("#title").val(product.title);
        $("#price").val(product.price);
        $("#contents").val(product.contents);

        // 기존 이미지 표시
        if (product.images && product.images.length > 0) {
          product.images.forEach((image, index) => {
            const imgElement = $("<img>")
              .attr("src", image.url)
              .attr("alt", `상품 이미지 ${index + 1}`)
              .css({
                "max-width": "100px",
                "max-height": "100px",
                margin: "5px",
              });
            const deleteButton = $("<button>")
              .text("삭제")
              .attr("type", "button")
              .attr("data-image-id", image.id)
              .on("click", function () {
                if (confirm("이 이미지를 삭제하시겠습니까?")) {
                  deleteImage(image.id);
                }
              });
            $("#existingImages").append(imgElement).append(deleteButton);
          });
        }
      },
      error: function (xhr, status, error) {
        console.error("상품 정보를 불러오는데 실패했습니다:", error);
        alert("상품 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
      },
    });
  }

  $("#productUpdateForm").on("submit", function (e) {
    e.preventDefault();

    var formData = new FormData();
    formData.append("title", $("#title").val());
    formData.append("contents", $("#contents").val());
    formData.append("price", parseInt($("#price").val()));

    var files = $("#files")[0].files;
    for (var i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    $.ajax({
      url: `http://localhost:8090/products/${product_Id}`,
      type: "PUT",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        console.log("상품이 성공적으로 수정되었습니다:", response);
        alert("상품이 성공적으로 수정되었습니다.");
        window.location.href = "productList.html"; // 상품 목록 페이지로 이동
      },
      error: function (xhr, status, error) {
        console.error("상품 수정 실패:", error);
        alert("상품 수정에 실패했습니다. 다시 시도해주세요.");
      },
    });
  });

  // 이미지 미리보기 기능
  $("#files").on("change", function (e) {
    $("#imagePreview").empty();
    var files = e.target.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (!file.type.startsWith("image/")) {
        continue;
      }

      var reader = new FileReader();
      reader.onload = (function (file) {
        return function (e) {
          var img = $("<img>")
            .attr("src", e.target.result)
            .css("max-width", "100px")
            .css("max-height", "100px")
            .css("margin", "5px");
          $("#imagePreview").append(img);
        };
      })(file);
      reader.readAsDataURL(file);
    }
  });

  function deleteImage(imageId) {
    $.ajax({
      url: `http://localhost:8090/products/${product_Id}/images/${attachedImage_id}`,
      type: "DELETE",
      success: function (response) {
        console.log("이미지가 성공적으로 삭제되었습니다:", response);
        $(`button[data-image-id="${attachedImage_id}"]`).prev("img").remove();
        $(`button[data-image-id="${attachedImage_id}"]`).remove();
      },
      error: function (xhr, status, error) {
        console.error("이미지 삭제 실패:", error);
        alert("이미지 삭제에 실패했습니다. 다시 시도해주세요.");
      },
    });
  }

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
