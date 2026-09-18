# Cookie Cleaner (local)

A tiny, auditable Edge/Chromium extension for clearing **specific** cookies on the
current site with one click — built as a transparent alternative to the popular
third-party cookie extensions.

## Why build this instead of using Cookie-Editor?

Extensions like Cookie-Editor and EditThisCookie are genuinely useful, but *any*
cookie-management extension needs broad permission to read and write cookies across
every site you visit. That's an inherent, unavoidable capability for this kind of
tool — the question is who you're trusting with it:

- **A store extension** asks you to trust the current maintainer **and every future
  auto-update**. A tool can be perfectly safe today and ship something unwanted in a
  later version, and browsers apply those updates automatically.
- **This extension** is ~70 lines of code you can read top to bottom in a couple of
  minutes. It requests only the `cookies` permission, makes **zero network calls**
  (no `fetch`, no analytics, no telemetry — nothing leaves your machine), and because
  it's loaded unpacked from a local folder, it **never auto-updates behind your back**.

For a team doing testing — where you're routinely clearing session/auth cookies to
re-test login flows — that transparency is worth the small amount of DIY setup.

## What it does

- Click the toolbar icon to see every cookie visible to the current site.
- **Delete** any individual cookie, or **Delete all cookies for this site** in one click.
- Deletions go through the browser's own `chrome.cookies` API and take effect immediately.

## Install (Edge or any Chromium browser)

1. Open `edge://extensions` (or `chrome://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Pin it from the extensions (puzzle-piece) menu.

## Permissions, explained

| Permission | Why it's needed |
|---|---|
| `cookies` | Read and delete cookies — the core function. |
| `tabs` | Read the active tab's URL so it knows which site's cookies to show. |
| `host_permissions: <all_urls>` | The cookies API requires host access to operate on a site. `<all_urls>` lets it work on any site you're on. |

### Locking it down to specific sites

If you'd rather the extension be *unable* to touch cookies except on an approved list
of sites, replace the `host_permissions` line in `manifest.json` with an explicit list,
for example:

```json
"host_permissions": ["https://*.example.com/*", "https://*.internal-test.net/*"]
```

The extension will then only see and clear cookies on those domains.

## Files

- `manifest.json` — extension manifest (Manifest V3), permission declarations.
- `popup.html` — the popup UI.
- `popup.js` — all the logic; no dependencies, no build step.
