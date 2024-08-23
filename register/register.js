document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const member_id = document.getElementById("member_id").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const birthday = document.getElementById("birth").value;
    const email = document.getElementById("email").value;

    const newMember = {
      member_id,
      password,
      name,
      birthday,
      email,
    };

    registerMember(newMember);
  });
});

function registerMember(member) {
  fetch("http://localhost:8090/members/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("회원이 성공적으로 등록되었습니다:", data);
      alert("회원이 등록되었습니다.");
      clearForm();
      displayMemberInfo(data);
    })
    .catch((error) => {
      console.error("Error details: ", error);
      alert("회원 등록 중 오류가 발생했습니다: " + error.message);
    });
}

function clearForm() {
  document.getElementById("member_id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("password").value = "";
  document.getElementById("birth").value = "";
  document.getElementById("email").value = "";
}

function displayMemberInfo(member) {
  const resultDiv = document.createElement("div");
  resultDiv.id = "register-result";

  resultDiv.innerHTML = `
    <h3>등록된 회원 정보</h3>
    <p><strong>아이디:</strong> ${member.member_id}</p>
    <p><strong>패스워드:</strong> ${member.password}</p>
    <p><strong>닉네임:</strong> ${member.name}</p>
    <p><strong>생일:</strong> ${member.birthday}</p>
    <p><strong>이메일:</strong> ${member.email}</p>
  `;
  window.location.href = "http://127.0.0.1:5500";
}
