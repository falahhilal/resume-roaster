const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/roast";

document.getElementById("roastForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("resumeFile");
  const file = fileInput.files[0];
  const jobTitle = document.getElementById("jobTitle").value;

  const allowed = [".pdf", ".docx"];
  const ext = "." + file.name.split(".").pop().toLowerCase();
  if (!allowed.includes(ext)) {
    alert("Only PDF or DOCX files allowed.");
    return;
  }

  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "Roasting... 🔥";

  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobTitle", jobTitle);

  try {
    const res = await fetch(N8N_WEBHOOK_URL, { method: "POST", body: formData });
    const data = await res.json();
    resultDiv.textContent = data.roast || "Something went wrong.";
  } catch (err) {
    resultDiv.textContent = "Error reaching the roast server: " + err.message;
  }
});