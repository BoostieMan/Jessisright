const GITHUB_BASE = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data';
const pin = '1122';

const pinInput = document.getElementById('pin');
const formFields = document.getElementById('formFields');
const form = document.getElementById('momentForm');
const confirmation = document.getElementById('confirmation');

const aboutText = document.getElementById('aboutText');
const aboutEditBox = document.getElementById('aboutEditBox');
const editAboutBtn = document.getElementById('editAboutBtn');
const saveAboutBtn = document.getElementById('saveAboutBtn');

const rightList = document.getElementById('rightList');
const quotesSection = document.getElementById('quotesSection');

function showAdminTools() {
  editAboutBtn.classList.remove('hidden');
  document.querySelectorAll('.deletable').forEach(el => el.classList.remove('hidden'));
}

document.getElementById('checkPinBtn').addEventListener('click', () => {
  if (pinInput.value === pin) {
    formFields.classList.remove('hidden');
    showAdminTools();
  } else {
    alert('Incorrect PIN');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const type = document.getElementById('type').value;
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const content = document.getElementById('content').value;

  const newEntry = { from, to, content };

  console.log(`[DEV] Would save to ${type}.json`, newEntry);
  confirmation.classList.remove('hidden');
  form.reset();
  formFields.classList.add('hidden');
});

editAboutBtn.addEventListener('click', () => {
  aboutEditBox.value = aboutText.textContent;
  aboutEditBox.classList.remove('hidden');
  saveAboutBtn.classList.remove('hidden');
  editAboutBtn.classList.add('hidden');
});

saveAboutBtn.addEventListener('click', () => {
  aboutText.textContent = aboutEditBox.value;
  aboutEditBox.classList.add('hidden');
  saveAboutBtn.classList.add('hidden');
  editAboutBtn.classList.remove('hidden');
});

async function fetchJSON(file) {
  const res = await fetch(`${GITHUB_BASE}/${file}`);
  return res.json();
}

async function loadSiteContent() {
  const about = await fetchJSON('about.json');
  if (about?.content) aboutText.textContent = about.content;

  const right = await fetchJSON('rightlist.json');
  rightList.innerHTML = '';
  right.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `"${entry.content}" – ${entry.to || 'Jess'}${entry.from ? ' (submitted by ' + entry.from + ')' : ''}`;
    rightList.appendChild(li);
  });

  const quotes = await fetchJSON('quotes.json');
  quotesSection.innerHTML = '';
  quotes.forEach(entry => {
    const block = document.createElement('blockquote');
    block.innerHTML = `"${entry.content}" – ${entry.to || 'Jess'}`;
    quotesSection.appendChild(block);
  });
}

window.addEventListener('DOMContentLoaded', loadSiteContent);
