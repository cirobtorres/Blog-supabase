export async function postFiles(formData: FormData) {
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to post files.");
  return res.json();
}
