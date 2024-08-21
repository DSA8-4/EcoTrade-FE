document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  const logoutButton = document.getElementById("logoutButton");
  const registerButton = document.getElementById("registerButton");
  const welcomeMessage = document.getElementById("welcomeMessage");

  // 로그인 상태를 확인하는 함수
  function checkLoginStatus() {
    // const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    const userInfo = document.querySelector(".user-info"); // 사용자 정보 영역

    if (loggedInUser) {
      // 로그인 상태일 때
      if (loginButton) loginButton.style.display = "none"; // 로그인 버튼 숨기기
      if (logoutButton) logoutButton.style.display = "inline"; // 로그아웃 버튼 보이기
      if (registerButton) registerButton.style.display = "none"; // 회원가입 버튼 숨기기

      // 프로필 사진 및 환영 메시지 설정
      if (userInfo) userInfo.style.display = "flex"; // 사용자 정보 영역 보이기
      if (welcomeMessage) {
        welcomeMessage.textContent = `${loggedInUser}님 환영합니다.`; // 환영 메시지 설정
        // welcomeMessage.style.display = "block"; // 메시지 표시
        welcomeMessage.style.color = "black";
      }
    } else {
      // 로그인 상태가 아닐 때
      if (loginButton) loginButton.style.display = "inline"; // 로그인 버튼 보이기
      if (logoutButton) logoutButton.style.display = "none"; // 로그아웃 버튼 숨기기
      if (registerButton) registerButton.style.display = "inline"; // 회원가입 버튼 보이기
      if (userInfo) userInfo.style.display = "none"; // 사용자 정보 영역 숨기기
      if (welcomeMessage) welcomeMessage.style.display = "none"; // 메시지 숨기기
    }
  }

  // 로그인 버튼 클릭 시
  // if (loginButton) {
  //   loginButton.addEventListener("click", function () {
  //     // const userId = "member_id"; // 실제 사용자 ID를 가져오는 로직 필요
  //     sessionStorage.setItem("loggedInUser", userId); // 사용자 ID 저장
  //     checkLoginStatus(); // 로그인 상태 재확인
  //   });
  // }

  // // 로그아웃 버튼 클릭 시
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      sessionStorage.removeItem("loggedInUser"); // 세션에서 사용자 ID 제거
      checkLoginStatus(); // 로그인 상태 재확인
    });
  }

  // 페이지 로드 시 로그인 상태 확인
  checkLoginStatus();
});
