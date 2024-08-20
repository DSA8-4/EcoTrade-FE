document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-container");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const member_id = document.getElementById("member_id").value;
      const password = document.getElementById("password").value;

      const loginData = {
        member_id,
        password,
      };

      loginMember(loginData);
    });
  } else {
    console.error("로그인 정보를 찾을 수 없습니다.");
  }
});

function loginMember(loginData) {
  fetch("http://localhost:8090/members/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((text) => {
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        data = { message: text };
      }
      console.log("로그인 응답:", data);
      if (data.message === "로그인 성공") {
        alert("로그인되었습니다.");
        clearForm();
        handleLoginSuccess(loginData);
      } else {
        alert("로그인에 실패했습니다: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error details: ", error);
      alert("로그인 중 오류가 발생했습니다: " + error.message);
    });
}

function clearForm() {
  document.getElementById("member_id").value = "";
  document.getElementById("password").value = "";
}

function handleLoginSuccess(userData) {
  sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
  window.location.href = "http://127.0.0.1:5500";
}
