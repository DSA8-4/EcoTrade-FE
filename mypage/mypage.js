document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token"); // JWT 토큰을 세션스토리지에서 가져옴
  const memberId = sessionStorage.getItem("member_id"); // member_id를 세션스토리지에서 가져옴

  if (!token || !memberId) {
    alert("로그인이 필요합니다.");
    window.location.href = "/"; // 로그인 페이지로 리디렉션
    return;
  }

  // API 호출로 사용자 정보 가져오기
  fetch(`http://localhost:8090/members/mypage?member_id=${memberId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 403) {
        throw new Error("권한이 없습니다. 로그인 상태를 확인하십시오.");
      }
      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }
      return response.json();
    })

    .then((data) => {
      document.getElementById(
        "welcomeMessage"
      ).textContent = `환영합니다, ${data.name}님!`;
      document.getElementById("member_id").textContent = data.member_id;
      document.getElementById("nameDisplay").textContent = data.name;
      document.getElementById("emailDisplay").textContent = data.email;
      document.getElementById("ecoPointInfo").textContent = data.eco_point;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // 프로필 수정 버튼 클릭 시
  document.getElementById("editProfileButton").addEventListener("click", () => {
    toggleEditMode(true);
  });

  // 프로필 수정 저장 버튼 클릭 시
  document.getElementById("saveProfileButton").addEventListener("click", () => {
    const updatedProfile = {
      name: document.getElementById("nameInput").value,
      email: document.getElementById("emailInput").value,
    };

    fetch(`http://localhost:8090/members/${memberId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("프로필 수정에 실패했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("nameDisplay").textContent = data.name;
        document.getElementById("emailDisplay").textContent = data.email;
        toggleEditMode(false);
        alert("프로필이 성공적으로 수정되었습니다.");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("프로필 수정 중 오류가 발생했습니다.");
      });
  });

  // 취소 버튼 클릭 시
  document
    .getElementById("cancelProfileButton")
    .addEventListener("click", () => {
      toggleEditMode(false);
    });

  // 비밀번호 수정 버튼 클릭 시
  document
    .getElementById("updatePasswordButton")
    .addEventListener("click", () => {
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword =
        document.getElementById("confirmNewPassword").value;

      if (newPassword !== confirmNewPassword) {
        alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        return;
      }

      const passwordUpdateRequest = {
        currentPassword,
        newPassword,
        confirmNewPassword,
      };

      fetch(`http://localhost:8090/members/${memberId}/password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordUpdateRequest),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("비밀번호 수정에 실패했습니다.");
          }
          alert("비밀번호가 성공적으로 변경되었습니다.");
          document.getElementById("currentPassword").value = "";
          document.getElementById("newPassword").value = "";
          document.getElementById("confirmNewPassword").value = "";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("비밀번호 수정 중 오류가 발생했습니다.");
        });
    });

  // 회원 탈퇴 버튼 클릭 시
  document
    .getElementById("deleteAccountButton")
    .addEventListener("click", () => {
      const password = prompt("비밀번호를 입력해주세요:");

      if (!password) {
        alert("비밀번호를 입력해야 탈퇴할 수 있습니다.");
        return;
      }

      fetch(`http://localhost:8090/members/${memberId}?password=${password}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("회원 탈퇴에 실패했습니다.");
          }
          alert("회원 탈퇴가 완료되었습니다.");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("member_id");
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("회원 탈퇴 중 오류가 발생했습니다.");
        });
    });

  // 프로필 수정 모드 토글
  function toggleEditMode(editMode) {
    document.getElementById("nameDisplay").style.display = editMode
      ? "none"
      : "inline";
    document.getElementById("emailDisplay").style.display = editMode
      ? "none"
      : "inline";

    document.getElementById("nameInputContainer").style.display = editMode
      ? "block"
      : "none";
    document.getElementById("emailInputContainer").style.display = editMode
      ? "block"
      : "none";

    document.getElementById("editProfileButton").style.display = editMode
      ? "none"
      : "inline";
    document.getElementById("saveProfileButton").style.display = editMode
      ? "inline"
      : "none";
    document.getElementById("cancelProfileButton").style.display = editMode
      ? "inline"
      : "none";

    if (editMode) {
      document.getElementById("nameInput").value =
        document.getElementById("nameDisplay").textContent;
      document.getElementById("emailInput").value =
        document.getElementById("emailDisplay").textContent;
    }
  }
});
