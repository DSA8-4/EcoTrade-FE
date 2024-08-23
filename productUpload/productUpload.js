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

document
  .getElementById("files")
  .addEventListener("change", (e) => changeImage(e));

const changeImage = (e) => {
  fileItems = Array.from(e.target.files);
  console.log("Selected files:", fileItems);
};

const uploadImages = () => {
  const uploadPromises = fileItems.map((fileItem) => {
    const storageRef = ref(storage, "images/" + fileItem.name);
    const uploadTask = uploadBytesResumable(storageRef, fileItem);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
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
      const imageUrls = await uploadImages();
      console.log("All files uploaded. URLs:", imageUrls);

      const product = {
        title: $("#title").val(),
        contents: $("#contents").val(),
        price: parseInt($("#price").val()),
        productImages: imageUrls,
      };

      const response = await fetch("http://localhost:8090/products/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Product successfully registered:", data);
      alert("Product successfully registered.");
      document.getElementById("productForm").reset();
      document.getElementById("imagePreview").innerHTML = "";
    } catch (error) {
      console.error("Failed to register product:", error);
      alert("Failed to register product. Please try again.");
    }
  });

  // 가격 입력 필드에 숫자만 입력되도록 처리
  $("#price").on("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // 글자 수 제한 (상품명: 30자, 상품 설명: 제한 없음)
  $("#title").on("input", function () {
    let maxLength = 30;
    if (this.value.length > maxLength) {
      this.value = this.value.slice(0, maxLength);
    }
  });

  // 이미지 미리보기 기능
  $("#files").on("change", function (e) {
    $("#imagePreview").empty(); // 기존 미리보기 삭제
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (!file.type.startsWith("image/")) {
        continue;
      } // 이미지 파일만 처리

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
