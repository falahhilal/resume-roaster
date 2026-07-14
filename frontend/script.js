const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/roast";

const form = document.getElementById("roastForm");
const fileInput = document.getElementById("resumeFile");
const jobInput = document.getElementById("jobTitle");

const resultDiv = document.getElementById("result");
const resultCard = document.getElementById("resultCard");

const submitBtn = document.getElementById("submitBtn");
const copyBtn = document.getElementById("copyBtn");
const selectedFile = document.getElementById("selectedFile");

// Display selected filename

fileInput.addEventListener("change", () => {
    if (fileInput.files.length) {
        selectedFile.textContent = "📄 " + fileInput.files[0].name;
    } else {
        selectedFile.textContent = "No file selected";
    }
});

//Loading messages

const loadingMessages = [
    "Reading your resume...",
    "Looking for red flags...",
    "Asking a recruiter...",
    "Judging your career choices...",
    "Comparing you to other applicants...",
    "Preparing emotional damage...",
    "Finding your weakest bullet points...",
    "Tailoring the roast..."
];

let loadingInterval;

function startLoading() {

    resultCard.classList.remove("hidden");

    let i = 0;

    resultDiv.textContent = loadingMessages[0];

    loadingInterval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        resultDiv.textContent = loadingMessages[i];
    }, 1400);

}

function stopLoading() {
    clearInterval(loadingInterval);
}

// Copy button

copyBtn.addEventListener("click", async () => {

    if (!resultDiv.textContent.trim()) return;

    try {

        await navigator.clipboard.writeText(resultDiv.textContent);

        const old = copyBtn.textContent;

        copyBtn.textContent = "Copied!";

        setTimeout(() => {
            copyBtn.textContent = old;
        }, 1800);

    } catch {

        alert("Couldn't copy the roast.");

    }

});

// Submit

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const file = fileInput.files[0];
    const jobTitle = jobInput.value.trim();

    if (!file) {
        alert("Please select a resume.");
        return;
    }

    if (!jobTitle) {
        alert("Please enter a target job title.");
        return;
    }

    const allowed = [".pdf", ".docx"];
    const ext = "." + file.name.split(".").pop().toLowerCase();

    if (!allowed.includes(ext)) {
        alert("Only PDF and DOCX resumes are supported.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Roasting...";

    startLoading();

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("jobTitle", jobTitle);

    try {

        const res = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        stopLoading();

        if (data.success) {
            resultDiv.textContent = data.roast;
        } else {
            resultDiv.textContent =
                "Couldn't roast this resume.\n\n" +
                (data.error || "Something went wrong.");
        }

    } catch (err) {

        stopLoading();

        resultDiv.textContent =
            "Couldn't reach the roast server.\n\n" +
            err.message;

    } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = "Roast My Resume";

    }

});