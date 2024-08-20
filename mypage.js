// 로그인 상태 확인 및 사용자 정보 요청
function checkLoginStatus() {
  fetch("http://localhost:8090/members/mypage", {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        // 로그인되지 않은 경우

        return Promise.reject("로그인 필요");
      }
    })
    .then((data) => {
      updateDisplay(data); // 사용자 정보로 화면 업데이트
    })
    .catch((error) => {
      console.error("오류 발생:", error);
    });
}

// 화면에 사용자 정보 표시
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

// 프로필 수정 버튼 클릭 시
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
  document.getElementById("cancelProfileButton").style.display = "inline-block";
  document.getElementById("editProfileButton").style.display = "none";
});

// 프로필 저장 버튼 클릭 시
document.getElementById("saveProfileButton").addEventListener("click", () => {
  const newName = document.getElementById("nameInput").value;
  const newBirth = document.getElementById("birthInput").value;
  const newEmail = document.getElementById("emailInput").value;

  // 사용자 정보 업데이트 요청
  fetch(
    `http://localhost:8090/members/${
      document.getElementById("member_id").textContent
    }`,
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

    // 비밀번호 업데이트 요청
    fetch(
      `http://localhost:8090/members/password/${
        document.getElementById("member_id").textContent
      }`,
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
