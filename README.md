# 🧪 Axolotlies — Waitlist site

A cute, animated waitlist website for the **Axolotlies** NFT project, with a
4-step application page that saves entries straight to a **Google Sheet**.

```
index.html          → Home page (hero, colony, how-to-join, FAQ)
apply.html          → Waitlist application (4 task cards + submit)
apps-script/Code.gs → Google Sheets backend (Apps Script)
assets/             → The axolotl character (transparent PNG)
```

The character art is embedded directly inside the HTML, so the two pages work
on their own — you can open them by double-clicking, or host them anywhere.

---

## 1. Hook up the Google Sheet (saves applications)

1. Create a new **Google Sheet** — this is your private list.
2. **Extensions ▸ Apps Script**.
3. Delete the sample code, paste everything from `apps-script/Code.gs`, **Save**.
4. **Deploy ▸ New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy**, then approve the permissions.
5. Copy the **Web app URL** (it ends in `/exec`).
6. Open `apply.html`, find the **CONFIG** block near the bottom, and paste it:

```js
const CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/XXXXX/exec",  // ← paste here
  TWEET_URL:  "https://x.com/Axolotlies_NFT/status/...",        // ← your pinned post
  X_PROFILE:  "https://x.com/Axolotlies_NFT",
  X_HANDLE:   "@Axolotlies_NFT"
};
```

> Tip: visit the `/exec` URL in a browser — you should see
> “Axolotlies waitlist backend is running”. That confirms it's live.

Each application becomes one row: timestamp, X username, liked & retweeted,
comment link, wallet address.

## 2. Set your tweet link

Put the exact link to the post people should like / retweet / comment on into
`CONFIG.TWEET_URL`. Until you do, the buttons just open your profile.

## 3. Put it online

Drag the folder into **Netlify Drop** (netlify.com/drop), or push to a repo and
turn on **GitHub Pages** / **Vercel** / **Cloudflare Pages**. No build step —
they're plain static files.

---

## Notes
- **Wallet field** expects an **Ethereum (EVM)** address (`0x…`, 42 chars), since
  the project lives on Ethereum. Change the validator in `apply.html` (`v.wallet`)
  if you ever need a different chain format.
- The submit uses `mode: 'no-cors'` because that's what Google Apps Script web
  apps require for cross-origin POSTs. The row still lands in your sheet.
- Colours, copy, characters and animations are all in the `<style>`/markup of
  each file — easy to tweak.
- Replace the `1,402` follower number and any copy whenever you like.
