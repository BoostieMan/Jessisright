const GITHUB_ENDPOINT = "https://jessisrighttest.almuslimllah.workers.dev/";
const pinInput = document.getElementById('pin');
const formFields = document.getElementById('formFields');
const form = document.getElementById('momentForm');
const confirmation = document.getElementById('confirmation');
const rightList = document.getElementById('rightList');
const quotesSection = document.getElementById('quotesSection');
const aboutText = document.getElementById('aboutText');
const aboutEditBox = document.getElementById('aboutEditBox');
const editAboutBtn = document.getElementById('editAboutBtn');
const saveAboutBtn = document.getElementById('saveAboutBtn');

function showAdminTools() {
  editAboutBtn.classList.remove('hidden');
  document.querySelectorAll('.deletable').forEach(el => el.classList.remove('hidden'));
}

document.getElementById('checkPinBtn').addEventListener('click', () => {
  if (pinInput.value === '1122') {
    formFields.classList.remove('hidden');
    showAdminTools();
  } else {
    alert("Incorrect PIN. Try again.");
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const type = document.getElementById('type').value;
  const from = document.getElementById('from').value || '';
  const to = document.getElementById('to').value || '';
  const content = document.getElementById('content').value || '';

  if (!type || !content) {
    alert("Please choose a category and enter content.");
    return;
  }

  const filename = type === "RightList" ? "rightlist.json" : "quotes.json";
  const newItem = { content, from, to };

  try {
    const fetchRes = await fetch(`${GITHUB_ENDPOINT}${filename}`);
    const existing = fetchRes.ok ? await fetchRes.json() : [];
    existing.push(newItem);

    const saveRes = await fetch(`${GITHUB_ENDPOINT}${filename}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(existing)
    });

    if (!saveRes.ok) throw new Error(await saveRes.text());

    const el = document.createElement(type === 'Quotes' ? 'blockquote' : 'li');
    el.textContent = `"${content}" – ${to || "Jess"}${from ? " (submitted by " + from + ")" : ""}`;
    (type === 'Quotes' ? quotesSection : rightList).appendChild(el);

    form.reset();
    formFields.classList.add('hidden');
    confirmation.classList.remove('hidden');

  } catch (err) {
    console.error("Submit failed:", err);
    alert("Failed to submit. Check console.");
  }
});

editAboutBtn.addEventListener('click', () => {
  aboutEditBox.value = aboutText.textContent;
  aboutEditBox.classList.remove('hidden');
  saveAboutBtn.classList.remove('hidden');
  editAboutBtn.classList.add('hidden');
});

saveAboutBtn.addEventListener('click', async () => {
  const updatedContent = aboutEditBox.value.trim();
  const payload = JSON.stringify([{ content: updatedContent }]);

  const res = await fetch(`${GITHUB_ENDPOINT}about.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: payload
  });

  if (res.ok) {
    aboutText.textContent = updatedContent;
    aboutEditBox.classList.add('hidden');
    saveAboutBtn.classList.add('hidden');
    editAboutBtn.classList.remove('hidden');
    alert('Saved successfully!');
  } else {
    alert('Save failed!');
    console.error(await res.text());
  }
});

async function fetchData(file) {
  const res = await fetch(`${GITHUB_ENDPOINT}${file}`);
  return res.ok ? await res.json() : [];
}

async function loadSiteContent() {
  const about = await fetchData("about.json");
  const quotes = await fetchData("quotes.json");
  const rightItems = await fetchData("rightlist.json");

  if (about?.[0]?.content) aboutText.textContent = about[0].content;

  rightList.innerHTML = '';
  rightItems.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `"${item.content}" – ${item.to || "Jess"}${item.from ? " (submitted by " + item.from + ")" : ""}` +
                    ` <button class="deletable hidden" data-type="RightList" data-index="${i}">🗑️</button>`;
    rightList.appendChild(li);
  });

  quotesSection.innerHTML = '';
  quotes.forEach((q, i) => {
    const bq = document.createElement("blockquote");
    bq.innerHTML = `"${q.content}" – ${q.to || "Jess"} <button class="deletable hidden" data-type="Quotes" data-index="${i}">🗑️</button>`;
    quotesSection.appendChild(bq);
  });

  if (pinInput.value === '1122') showAdminTools();

  document.querySelectorAll('.deletable').forEach(btn => {
    btn.addEventListener('click', async () => {
      const index = parseInt(btn.dataset.index);
      const type = btn.dataset.type;
      const file = type === "RightList" ? "rightlist.json" : "quotes.json";

      if (!confirm("Are you sure you want to delete this item?")) return;

      try {
        const res = await fetch(`${GITHUB_ENDPOINT}${file}`);
        const items = res.ok ? await res.json() : [];
        items.splice(index, 1);

        const saveRes = await fetch(`${GITHUB_ENDPOINT}${file}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(items)
        });

        if (!saveRes.ok) throw new Error(await saveRes.text());
        await loadSiteContent();
      } catch (err) {
        console.error("Failed to delete:", err);
        alert("Delete failed. Check console.");
      }
    });
  });

  try {
    const versionRes = await fetch(`${GITHUB_ENDPOINT}version.json`);
    const versionData = await versionRes.json();
    document.getElementById('version').textContent = `v${versionData.version}`;
    document.getElementById('hash').textContent = `#${versionData.hash}`;
  } catch (e) {
    console.warn("Version info not available");
  }
}


window.addEventListener('DOMContentLoaded', loadSiteContent);
