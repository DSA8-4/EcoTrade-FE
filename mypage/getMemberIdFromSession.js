// // getMemberIdFromSession.js 또는 다른 파일에 정의되어야 합니다.
// function getMemberIdFromSession() {
//   // 세션 스토리지에서 member_id를 가져옵니다.
//   return sessionStorage.getItem("member_id");
// }

/**
 * 세션 스토리지에서 member_id를 가져오는 함수
 * @returns {string | null} member_id를 반환하거나, 세션에 존재하지 않으면 null을 반환합니다.
 */
function getMemberIdFromSession() {
  // 세션 스토리지에서 member_id를 가져옴
  const memberId = sessionStorage.getItem("member_id");
  return memberId;
}
