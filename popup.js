// Cookie Cleaner — everything runs locally in your browser. No network calls anywhere.

const listEl = document.getElementById("list");
const siteEl = document.getElementById("site");
const emptyEl = document.getElementById("empty");
const clearAllBtn = document.getElementById("clearAll");

let currentUrl = null;

// Build the exact URL a cookie belongs to, so chrome.cookies.remove can find it.
function cookieUrl(cookie) {
  const protocol = cookie.secure ? "https://" : "http://";
  const domain = cookie.domain.startsWith(".") ? cookie.domain.slice(1) : cookie.domain;
  return protocol + domain + cookie.path;
}

function removeCookie(cookie) {
  return chrome.cookies.remove({
    url: cookieUrl(cookie),
    name: cookie.name,
    storeId: cookie.storeId
  });
}

async function load() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !/^https?:/.test(tab.url)) {
    siteEl.textContent = "Open a normal web page to manage its cookies.";
    clearAllBtn.hidden = true;
    return;
  }
  currentUrl = tab.url;
  const host = new URL(tab.url).hostname;
  siteEl.textContent = host;

  // Get cookies visible to this URL (includes parent-domain cookies like ".example.com").
  const cookies = await chrome.cookies.getAll({ url: tab.url });
  cookies.sort((a, b) => a.name.localeCompare(b.name));

  listEl.innerHTML = "";
  emptyEl.hidden = cookies.length > 0;

  for (const cookie of cookies) {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = cookie.name;
    name.title = `${cookie.name}\ndomain: ${cookie.domain}\npath: ${cookie.path}`;

    const btn = document.createElement("button");
    btn.className = "del";
    btn.textContent = "Delete";
    btn.addEventListener("click", async () => {
      await removeCookie(cookie);
      load();
    });

    li.appendChild(name);
    li.appendChild(btn);
    listEl.appendChild(li);
  }
}

clearAllBtn.addEventListener("click", async () => {
  if (!currentUrl) return;
  const cookies = await chrome.cookies.getAll({ url: currentUrl });
  await Promise.all(cookies.map(removeCookie));
  load();
});

load();
