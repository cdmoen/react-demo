export default async function logoutRequest(token) {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}
