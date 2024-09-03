import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";
import { firebaseConfig } from "../config.js";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

let fileItems = [];

// 파일 선택 시 이미지 미리보기
document
  .getElementById("files")
  .addEventListener("change", (e) => changeImage(e));

const changeImage = (e) => {
  fileItems = Array.from(e.target.files);
  console.log("Selected files:", fileItems);
};

// 이미지 업로드
const uploadImages = () => {
  const uploadPromises = fileItems.map((fileItem) => {
    const storageRef = ref(storage, "images/" + fileItem.name);
    const uploadTask = uploadBytesResumable(storageRef, fileItem);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log("File available at", url);
            resolve(url);
          });
        }
      );
    });
  });

  return Promise.all(uploadPromises);
};

$(document).ready(function () {
  $("#productForm").on("submit", async function (e) {
    e.preventDefault();

    try {
      // 이미지 업로드
      const imageUrls = await uploadImages();
      console.log("All files uploaded. URLs:", imageUrls);

      // 카테고리 값 확인
      const category = $("#category").val();
      console.log("Selected category:", category);

      const product = {
        title: $("#title").val(),
        contents: $("#contents").val(),
        price: parseInt($("#price").val(), 10),
        category: category, // 선택된 카테고리 값
        productImages: imageUrls,
      };

      console.log("Product data:", product);

      const response = await fetch("http://localhost:8090/products/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your_jwt_token_here", // JWT 토큰 필요 시
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Network response was not ok: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      alert("Product successfully registered.");
      document.getElementById("productForm").reset();
      document.getElementById("imagePreview").innerHTML = "";
    } catch (error) {
      console.error("Failed to register product:", error);
      alert("Failed to register product. Please try again.");
    }
  });

  $("#price").on("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  $("#title").on("input", function () {
    let maxLength = 30;
    if (this.value.length > maxLength) {
      this.value = this.value.slice(0, maxLength);
    }
  });

  $("#files").on("change", function (e) {
    $("#imagePreview").empty();
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (!file.type.startsWith("image/")) {
        continue;
      }

      let reader = new FileReader();
      reader.onload = (function (file) {
        return function (e) {
          let img = $("<img>")
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
