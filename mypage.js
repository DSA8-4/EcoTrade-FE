document.addEventListener("DOMContentLoaded", function () {
  // 세션에서 로그인한 사용자 정보 가져오기
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    window.location.href = "http://127.0.0.1:5500/login.html";
    return;
  }

  // 로그인한 사용자의 ID를 가져오기
  const member_id = loggedInUser.member_id;

  // 서버에서 사용자 정보 가져오기
  fetch(`http://localhost:8090/api/members/mypage?member_id=${member_id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data from server:", data);

      // 사용자 정보를 HTML에 삽입
      document.getElementById(
        "welcomeMessage"
      ).textContent = `Eco Trade에 어서오세요, ${data.name}님!`;
      document.getElementById("member_id").textContent = data.member_id;
      document.getElementById("name").textContent = data.name;
      document.getElementById("birth").textContent = new Date(
        data.birth
      ).toLocaleDateString();
      document.getElementById("email").textContent = data.email;

      // 에코포인트가 null인 경우 0으로 대체
      const ecoPoints = data.eco_point !== null ? data.eco_point : 0;
      document.getElementById(
        "ecoPointInfo"
      ).textContent = `${data.name}님의 에코포인트는 ${ecoPoints}입니다.`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
