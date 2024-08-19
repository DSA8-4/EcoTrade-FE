document.addEventListener("DOMContentLoaded", function () {
  // 로그인 상태 확인
  function checkLoginStatus() {
    fetch("http://localhost:8090/api/members/session", {
      method: "GET",
      credentials: "include", // 쿠키를 포함하여 요청
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          window.location.href = "http://127.0.0.1:5500/login.html";
        }
      })
      .then((data) => {
        const loggedInUser = data.loggedInUser;
        // 사용자 정보 로드
        return fetch(`http://localhost:8090/api/members/${loggedInUser}`, {
          method: "GET",
          credentials: "include",
        });
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("사용자 정보 로드 실패");
        }
      })
      .then((user) => {
        updateDisplay(user); // 사용자 정보로 화면 업데이트
      })
      .catch((error) => {
        console.error("오류 발생:", error);
        window.location.href = "http://127.0.0.1:5500/login.html";
      });
  }

  // 함수: 화면에 데이터 표시
  function updateDisplay(data) {
    document.getElementById(
      "welcomeMessage"
    ).textContent = `Eco Trade에 어서오세요, ${data.name}님!`;
    document.getElementById("member_id").textContent = data.member_id;
    document.getElementById("nameDisplay").textContent = data.name;
    document.getElementById("birthDisplay").textContent = new Date(
      data.birth
    ).toLocaleDateString();
    document.getElementById("emailDisplay").textContent = data.email;
    document.getElementById("ecoPointInfo").textContent = `${
      data.name
    }님의 에코포인트는 ${data.eco_point || 0}입니다.`;
  }

  // 페이지 로드시 로그인 상태 확인
  checkLoginStatus();

  document.getElementById("editProfileButton").addEventListener("click", () => {
    document.getElementById("nameInput").value =
      document.getElementById("nameDisplay").textContent;
    document.getElementById("birthInput").value =
      document.getElementById("birthDisplay").textContent;
    document.getElementById("emailInput").value =
      document.getElementById("emailDisplay").textContent;

    document.getElementById("nameDisplay").style.display = "none";
    document.getElementById("birthDisplay").style.display = "none";
    document.getElementById("emailDisplay").style.display = "none";

    document.getElementById("nameInputContainer").style.display = "block";
    document.getElementById("birthInputContainer").style.display = "block";
    document.getElementById("emailInputContainer").style.display = "block";

    document.getElementById("saveProfileButton").style.display = "inline-block";
    document.getElementById("cancelProfileButton").style.display =
      "inline-block";
    document.getElementById("editProfileButton").style.display = "none";
  });

  document.getElementById("saveProfileButton").addEventListener("click", () => {
    const newName = document.getElementById("nameInput").value;
    const newBirth = document.getElementById("birthInput").value;
    const newEmail = document.getElementById("emailInput").value;

    // 사용자 정보 업데이트 요청
    fetch(
      "http://localhost:8090/api/members/" +
        document.getElementById("member_id").textContent,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          birth: newBirth,
          email: newEmail,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("정보 수정 실패");
        }
      })
      .then((data) => {
        if (data.message === "회원 정보가 성공적으로 변경되었습니다.") {
          updateDisplay({
            member_id: document.getElementById("member_id").textContent,
            name: newName,
            birth: newBirth,
            email: newEmail,
            eco_point: parseInt(
              document
                .getElementById("ecoPointInfo")
                .textContent.replace(/\D/g, "")
            ),
          });

          document.getElementById("nameDisplay").style.display = "block";
          document.getElementById("birthDisplay").style.display = "block";
          document.getElementById("emailDisplay").style.display = "block";

          document.getElementById("nameInputContainer").style.display = "none";
          document.getElementById("birthInputContainer").style.display = "none";
          document.getElementById("emailInputContainer").style.display = "none";

          document.getElementById("saveProfileButton").style.display = "none";
          document.getElementById("cancelProfileButton").style.display = "none";
          document.getElementById("editProfileButton").style.display =
            "inline-block";
        } else {
          alert("정보 수정 실패: " + data.message);
        }
      })
      .catch((error) => {
        console.error("정보 수정 오류:", error);
      });
  });

  document
    .getElementById("cancelProfileButton")
    .addEventListener("click", () => {
      document.getElementById("nameInputContainer").style.display = "none";
      document.getElementById("birthInputContainer").style.display = "none";
      document.getElementById("emailInputContainer").style.display = "none";

      document.getElementById("nameDisplay").style.display = "block";
      document.getElementById("birthDisplay").style.display = "block";
      document.getElementById("emailDisplay").style.display = "block";

      document.getElementById("saveProfileButton").style.display = "none";
      document.getElementById("cancelProfileButton").style.display = "none";
      document.getElementById("editProfileButton").style.display =
        "inline-block";
    });

  document
    .getElementById("updatePasswordButton")
    .addEventListener("click", () => {
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword =
        document.getElementById("confirmNewPassword").value;

      // 비밀번호 업데이트 요청
      fetch(
        "http://localhost:8090/api/members/password/" +
          document.getElementById("member_id").textContent,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword,
          }),
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("비밀번호 수정 실패");
          }
        })
        .then((data) => {
          if (data.message === "비밀번호가 성공적으로 변경되었습니다.") {
            alert("비밀번호가 성공적으로 변경되었습니다.");
            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmNewPassword").value = "";
          } else {
            alert("비밀번호 변경 실패: " + data.message);
          }
        })
        .catch((error) => {
          console.error("비밀번호 수정 오류:", error);
        });
    });
});
