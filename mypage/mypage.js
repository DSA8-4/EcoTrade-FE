function checkLoginStatus() {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    console.log("로그인 정보가 없음, 로그인 페이지로 리디렉션");
    window.location.href = "/login";
    return;
  }

  const userData = JSON.parse(loggedInUser);
  const token = sessionStorage.getItem("token");

  console.log(
    "요청 URL:",
    `http://localhost:8090/members/mypage?member_id=${member_id}`
  );
  console.log("요청 헤더:", `Bearer ${token}`);

  fetch(`http://localhost:8090/members/mypage?member_id=${member_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
    },
  })
    .then((response) => {
      console.log("응답 상태 코드:", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("응답 데이터:", data);
      updateDisplay(data);
    })
    .catch((error) => {
      console.error("오류 발생:", error);
      window.location.href = "/login";
    });
}

// checkLoginStatus();

// 프로필 저장 버튼 클릭 시
document.getElementById("saveProfileButton").addEventListener("click", () => {
  const newName = document.getElementById("nameInput").value;
  const newBirth = document.getElementById("birthInput").value;
  const newEmail = document.getElementById("emailInput").value;
  const memberId = document.getElementById("member_id").textContent;

  fetch(`http://localhost:8090/members/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`, // 토큰을 헤더에 포함
    },
    body: JSON.stringify({
      name: newName,
      birth: newBirth,
      email: newEmail,
    }),
  })
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
          member_id: memberId,
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
// 프로필 수정 취소 버튼 클릭 시
document.getElementById("cancelProfileButton").addEventListener("click", () => {
  document.getElementById("nameInputContainer").style.display = "none";
  document.getElementById("birthInputContainer").style.display = "none";
  document.getElementById("emailInputContainer").style.display = "none";

  document.getElementById("nameDisplay").style.display = "block";
  document.getElementById("birthDisplay").style.display = "block";
  document.getElementById("emailDisplay").style.display = "block";

  document.getElementById("saveProfileButton").style.display = "none";
  document.getElementById("cancelProfileButton").style.display = "none";
  document.getElementById("editProfileButton").style.display = "inline-block";
});

// 비밀번호 변경 버튼 클릭 시
document
  .getElementById("updatePasswordButton")
  .addEventListener("click", () => {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword =
      document.getElementById("confirmNewPassword").value;

    if (newPassword !== confirmNewPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    // 비밀번호 업데이트 요청
    const member_id = JSON.parse(
      sessionStorage.getItem("loggedInUser")
    ).member_id;
    fetch(`http://localhost:8090/members/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword, // confirmNewPassword 추가
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
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

// 계정 삭제 버튼 클릭 시
document.getElementById("deleteAccountButton").addEventListener("click", () => {
  const confirmed = confirm("정말 탈퇴하시겠습니까?");
  if (confirmed) {
    const inputPassword = prompt("비밀번호를 입력해주세요:");

    if (inputPassword) {
      deleteAccount(inputPassword);
    } else {
      alert("비밀번호를 입력해야 탈퇴가 가능합니다.");
    }
  }
});

function deleteAccount(inputPassword) {
  const memberId = document.getElementById("member_id").textContent;

  fetch(`http://localhost:8090/members/${memberId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: inputPassword }),
  })
    .then((response) => {
      if (response.ok) {
        alert("탈퇴가 완료되었습니다.");
        window.location.href = "http://127.0.0.1:5500/"; // 탈퇴 후 메인 페이지로 이동
      } else if (response.status === 401) {
        alert("비밀번호가 올바르지 않습니다.");
      } else {
        alert("탈퇴 처리에 실패했습니다. 다시 시도해주세요.");
      }
    })
    .catch((error) => {
      console.error("탈퇴 처리 중 오류 발생:", error);
      alert("탈퇴 처리 중 오류가 발생했습니다.");
    });
}
