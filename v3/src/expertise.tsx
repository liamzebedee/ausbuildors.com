import { h } from "./jsx";
import { Nav } from "./Nav";

document.querySelector("nav")!.appendChild(<Nav activePage="expertise" />);

const TARGET = "ca8b22d0db83a22db163b560b3e4e51527e533d31d067b614a0c33c4d2df8432";
const SUFFIX = "@ausbuildors.com";
const CHARS = "abcdefghijklmnopqrstuvwxyz";

function toHex(buf: ArrayBuffer): string {
  const b = new Uint8Array(buf);
  let h = "";
  for (let i = 0; i < b.length; i++) h += b[i].toString(16).padStart(2, "0");
  return h;
}

function renderChars(locked: string[], found: boolean[]): string {
  return [0, 1, 2, 3].map((pos) => {
    if (found[pos]) return `<span style="color:var(--accent);">${locked[pos]}</span>`;
    return `<span style="opacity:0.7;">${CHARS[Math.random() * 26 | 0]}</span>`;
  }).join("") + `<span style="color:var(--text-muted);font-weight:400;">${SUFFIX}</span>`;
}

const btn = document.getElementById("pow-btn") as HTMLButtonElement;
const mining = document.getElementById("pow-mining")!;
const charsEl = document.getElementById("pow-chars")!;
const hashEl = document.getElementById("pow-hash")!;
const emailRow = document.getElementById("pow-email")!;
const glowEl = document.getElementById("pow-glow")!;
let solved = false;

async function mine() {
  if (solved) return;

  // Expand the mining UI, hide button
  btn.style.display = "none";
  mining.style.display = "block";
  mining.style.maxHeight = "0";
  mining.style.opacity = "0";
  // Force reflow then animate open
  mining.offsetHeight;
  mining.style.maxHeight = "200px";
  mining.style.opacity = "1";

  const encoder = new TextEncoder();
  const found = [false, false, false, false];
  const locked = ["?", "?", "?", "?"];
  let attempts = 0;

  for (let a = 0; a < 26; a++) {
    for (let b = 0; b < 26; b++) {
      const batch: string[] = [];
      for (let c = 0; c < 26; c++) {
        for (let d = 0; d < 26; d++) {
          batch.push(CHARS[a] + CHARS[b] + CHARS[c] + CHARS[d]);
        }
      }

      const hashes = await Promise.all(
        batch.map((s) => crypto.subtle.digest("SHA-256", encoder.encode(s)))
      );

      for (let i = 0; i < batch.length; i++) {
        attempts++;
        const hex = toHex(hashes[i]);
        const guess = batch[i];

        if (attempts % 31 === 0) {
          charsEl.innerHTML = renderChars(locked, found);
          hashEl.textContent = `sha256(${guess}) = ${hex.slice(0, 32)}…  [${attempts.toLocaleString()} attempts]`;
        }

        if (hex === TARGET) {
          // Lock chars one by one
          const finalChars = guess.split("");
          for (let p = 0; p < 4; p++) {
            locked[p] = finalChars[p];
            found[p] = true;
            charsEl.innerHTML = renderChars(locked, found);
            await new Promise((r) => setTimeout(r, 200));
          }

          solved = true;
          const email = guess + SUFFIX;

          // Fire the glow
          glowEl.classList.add("solved");

          // Update hash line
          hashEl.textContent = `sha256(${guess}) = ${hex}`;
          hashEl.style.color = "var(--accent)";

          // Turn chars into a mailto link in place
          const link = document.createElement("a");
          link.href = `mailto:${email}`;
          link.innerHTML = `<span style="color:var(--accent);">${guess}</span><span style="color:var(--text-muted);font-weight:400;">${SUFFIX}</span>`;
          link.id = "pow-chars";
          link.style.cssText = "position:relative;z-index:1;font-size:1.4rem;letter-spacing:0.05em;color:var(--brown);font-weight:600;text-decoration:none;";
          charsEl.replaceWith(link);

          // Add copy button
          const copyBtn = document.createElement("button");
          copyBtn.textContent = "Copy";
          copyBtn.className = "btn btn-outline pow-copy-btn";
          copyBtn.style.cssText = "padding:0.4rem 0.9rem;font-size:0.8rem;flex-shrink:0;";
          copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(email);
            copyBtn.textContent = "Copied";
            setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
          });
          emailRow.appendChild(copyBtn);

          // Show status message
          document.getElementById("pow-status-msg")!.classList.add("visible");

          return;
        }
      }

      await new Promise((r) => setTimeout(r, 0));
    }
  }
}

btn.addEventListener("click", mine);
