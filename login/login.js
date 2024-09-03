document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-container");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault(); // 폼 제출 시 페이지 리로딩 방지
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
        throw new Error("Network response was not ok"); // 네트워크 응답이 오류인 경우 예외 발생
      }
      return response.json(); // 응답을 JSON으로 변환
    })
    .then((data) => {
      console.log("로그인 응답:", data, data.success);
      if (data.success) {
        alert("로그인되었습니다.");
        clearForm();
        handleLoginSuccess(data);
      } else {
        alert("로그인에 실패했습니다: " + data.message); // 로그인 실패 시 알림
      }
    })
    .catch((error) => {
      console.error("Error details: ", error); // 오류 세부정보를 콘솔에 출력
      alert("로그인 중 오류가 발생했습니다: " + error.message); // 사용자에게 오류 메시지 표시
    });
}

function clearForm() {
  document.getElementById("member_id").value = "";
  document.getElementById("password").value = "";
}

function handleLoginSuccess(userData) {
  sessionStorage.setItem(
    "loggedInUser",
    JSON.stringify({ name: userData.name }) // 사용자 이름을 세션 스토리지에 저장
  );
  sessionStorage.setItem("token", userData.token); // JWT 토큰을 세션 스토리지에 저장
  sessionStorage.setItem("member_id", userData.member_id); // member_id를 세션 스토리지에 저장
  window.location.href = "/"; // 로그인 후 마이페이지로 이동
}
