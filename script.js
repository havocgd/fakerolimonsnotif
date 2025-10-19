function updateRolePing() {
  const roleId = document.getElementById("roleSelect").value;
  const contentField = document.getElementById("content");
  contentField.value = roleId ? `<@&${roleId}>` : "";
  updatePreview();
}

function updatePreview() {
  const embed = {
    title: document.getElementById("title").value,
    url: document.getElementById("titleLink").value,
    description: generateDescription(),
    color: parseInt(document.getElementById("color").value.replace("#", ""), 16),
    thumbnail: { url: document.getElementById("thumbnail").value },
    author: {
      name: document.getElementById("authorName").value,
      url: document.getElementById("authorLink").value,
      icon_url: "https://www.rolimons.com/images/rolimons-logo-circle-padded.png"
    },
    fields: [
      { name: "Price", value: "FREE", inline: true },
      { name: "Quantity", value: document.getElementById("quantity").value, inline: true },
      {
        name: "Creator",
        value: `[${document.getElementById("authorName").value}](${document.getElementById("authorLink").value})`,
        inline: true
      }
    ]
  };

  const payload = {
    content: document.getElementById("content").value,
    embeds: [embed],
    author: {
      id: "1392625000003014667",
      username: "Cool fweee ugc pinger :3",
      avatar: "8c5af84664588fdeeb7d6fd5f309d256"
    }
  };

  document.getElementById("jsonPreview").textContent = JSON.stringify(payload, null, 2);
  renderDiscordPreview(payload);
}

function generateDescription() {
  const format = document.getElementById("formatType").value;
  const limited = document.getElementById("limitedStatus").value;
  const accessory = document.getElementById("accessoryType").value;
  const robloxPage = document.getElementById("robloxPageLink").value;
  const tryOn = document.getElementById("tryOnLink").value;
  const saleName = document.getElementById("saleLocationName").value;
  const saleLink = document.getElementById("saleLocationLink").value;

  let desc = `:sparkles: UGC ${accessory} Went ${limited}\n`;

  if (format === "ingame" || format === "both") {
    desc += " In-Game Only\n";
    if (saleName && saleLink) {
      desc += `**Sale Location**\n[${saleName}](${saleLink})\n`;
    }
  }

  if (format === "website" || format === "both") {
    desc += `:white_check_mark: [Get in-game without captcha!](${tryOn})\n`;
  }

  desc += `🌐 [Roblox Page](${robloxPage})‎ ‎ ‎ :shirt: [Try On](${tryOn})`;

  return desc;
}

function renderDiscordPreview(payload) {
  const embed = payload.embeds?.[0];
  if (!embed) return;

  const emojiMap = {
    ":sparkles:": "2728",
    ":video_game:": "1f3ae",
    ":shirt:": "1f455",
    ":globe_with_meridians:": "1f310",
    ":white_check_mark:": "2705",
    ":no_entry:": "26d4"
  };

  function replaceEmojis(text) {
    return text.replace(/:\w+:/g, match => {
      const code = emojiMap[match];
      return code
        ? `<img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg" class="emoji">`
        : match;
    });
  }

  const html = `
    <div class="embed-header">
      <img src="https://cdn.discordapp.com/avatars/${payload.author.id}/${payload.author.avatar}.png" />
      <strong>${payload.author.username}</strong>
      <span class="role-ping">${payload.content}</span>
    </div>
    <div class="embed-card" style="border-color: #${embed.color?.toString(16) || "5865f2"}">
      <div class="embed-title"><a href="${embed.url}" target="_blank">${embed.title}</a></div>
      <div class="embed-description">${replaceEmojis(embed.description)}</div>
      <div class="embed-fields">
        ${embed.fields
          .map(
            f => `<div><strong>${f.name}</strong><br>${f.value}</div>`
          )
          .join("")}
      </div>
      <img src="${embed.thumbnail?.url}" class="embed-thumbnail" />
    </div>
  `;

  document.getElementById("discordPreview").innerHTML = html;
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

document.querySelectorAll("input, textarea, select").forEach(el => {
  el.addEventListener("input", updatePreview);
});
