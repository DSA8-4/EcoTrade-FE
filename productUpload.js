$(document).ready(function () {
  $("#productForm").on("submit", function (e) {
    e.preventDefault(); // 기본 폼 제출 방지

    // FormData 객체 생성
    var formData = new FormData();
    formData.append("title", $("#title").val());
    formData.append("contents", $("#contents").val());
    formData.append("price", parseInt($("#price").val()));

    // 파일 추가
    var files = $("#files")[0].files; // 파일 입력 요소에서 파일들 가져오기
    for (var i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // FormData에 파일 추가
    }

    // AJAX 요청
    $.ajax({
      url: "http://localhost:8090/products/new",
      type: "POST",
      data: formData,
      contentType: false, // jQuery가 자동으로 Content-Type을 설정하게 함
      processData: false, // jQuery가 데이터를 자동으로 처리하지 않게 함
      success: function (response) {
        console.log("상품이 성공적으로 등록되었습니다:", response);
        alert("상품이 성공적으로 등록되었습니다.");
        $("#productForm")[0].reset(); // 폼 리셋
        $("#imagePreview").empty(); // 이미지 미리보기 초기화
      },
      error: function (xhr, status, error) {
        console.error("상품 등록 실패:", error);
        console.error("상태:", status);
        console.error("응답:", xhr.responseText); // 에러 메시지 출력
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

  // 이미지 미리보기 기능
  $("#files").on("change", function (e) {
    $("#imagePreview").empty(); // 기존 미리보기 삭제
    var files = e.target.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (!file.type.startsWith("image/")) {
        continue;
      } // 이미지 파일만 처리

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
});
