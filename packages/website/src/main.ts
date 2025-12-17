import "./style.css";

const API_URL = import.meta.env.VITE_API_URL || "https://api.christianai.world";

async function submitWaitlist(email: string, source: string) {
  try {
    const response = await fetch(`${API_URL}/api/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, source }),
    });

    if (!response.ok) {
      throw new Error(`Failed to join waitlist: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to join waitlist. Please try again.",
    );
  }
}

function handleFormSubmit(
  formId: string,
  emailId: string,
  successId: string,
  errorId: string,
  submitTextId: string,
  source: string,
) {
  const form = document.getElementById(formId) as HTMLFormElement;
  const emailInput = document.getElementById(emailId) as HTMLInputElement;
  const successDiv = document.getElementById(successId) as HTMLDivElement;
  const errorDiv = document.getElementById(errorId) as HTMLDivElement;
  const submitText = document.getElementById(submitTextId) as HTMLSpanElement;
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) return;

    submitBtn.disabled = true;
    submitText.textContent = "Joining...";
    errorDiv.classList.add("hidden");
    successDiv.classList.add("hidden");

    try {
      await submitWaitlist(email, source);
      successDiv.classList.remove("hidden");
      form.classList.add("hidden");
      emailInput.value = "";
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "An error occurred";
      const errorP = errorDiv.querySelector("p") as HTMLParagraphElement;
      errorP.textContent = errorMsg;
      errorDiv.classList.remove("hidden");
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = "Join Waitlist";
    }
  });
}

handleFormSubmit(
  "hero-form",
  "hero-email",
  "hero-form-success",
  "hero-form-error",
  "hero-submit-text",
  "hero",
);
handleFormSubmit(
  "final-form",
  "final-email",
  "final-form-success",
  "final-form-error",
  "final-submit-text",
  "final_cta",
);

document.getElementById("join-waitlist-btn")?.addEventListener("click", () => {
  document.getElementById("final-form")?.scrollIntoView({ behavior: "smooth" });
});
