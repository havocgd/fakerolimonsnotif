function updateRolePing() {
  const roleId = document.getElementById("roleSelect").value;
  const contentField = document.getElementById("content");
  contentField.value = roleId ? `<@&${roleId}>` : "";
  updatePreview();
}

function updatePreview() {
  const embed = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    color: parseInt(document.getElementById("color").value.replace("#", ""), 16),
    thumbnail: { url: document.getElementById("thumbnail").value },
    author: {
      name: document.getElementById("authorName").value,
      icon_url: document.getElementById("authorIcon").value
    }
  };

  const payload = {
    content: document.getElementById("content").value,
    embeds: [embed]
  };

  document.getElementById("jsonPreview").textContent = JSON.stringify(payload, null, 2);
}

function sendWebhook() {
  const webhookUrl = document.getElementById("webhookUrl").value;
  const payload = JSON.parse(document.getElementById("jsonPreview").textContent);

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    alert("✅ Webhook sent!");
  })
  .catch(err => alert("❌ Error: " + err.message));
}

document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", updatePreview);
});
