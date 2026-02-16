export default async function logoutRequest(token) {
  const response = await fetch(`http://localhost:3000/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}
