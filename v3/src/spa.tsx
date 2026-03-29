import { h, Fragment } from "./jsx";
import { Nav } from "./Nav";
import { members } from "./data/members";

// --- Route detection ---
function currentRoute(): string {
  const path = location.pathname.replace(/\/$/, "").split("/").pop() || "index.html";
  if (path === "" || path === "index.html") return "home";
  return path.replace(".html", "");
}

// --- Page init functions ---

function initHome() {
  const AUSBUILDOR_API_BASE_URL = "https://liamz.co/api/ausbuildor";
  const meetupBase = 49;
  const meetupEpoch = new Date(2026, 2);
  const now = new Date();
  const monthsSinceEpoch = (now.getFullYear() - meetupEpoch.getFullYear()) * 12 + (now.getMonth() - meetupEpoch.getMonth());
  const meetupCount = meetupBase + Math.max(0, monthsSinceEpoch);
  const meetupEl = document.getElementById("meetup-count");
  if (meetupEl) meetupEl.textContent = meetupCount + "+";

  const STATIC_MEMBER_COUNT = 460;

  function tickerFlick(el: HTMLElement, from: number, to: number, duration = 800) {
    if (from === to) return;
    const start = performance.now();
    const diff = to - from;
    function frame(t: number) {
      const elapsed = t - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(from + diff * progress) + "+";
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function timeSince(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  (async () => {
    try {
      const res = await fetch(AUSBUILDOR_API_BASE_URL);
      if (!res.ok) return;
      const data = await res.json();
      if (data.totalMemberCount && typeof data.totalMemberCount === "number") {
        const el = document.getElementById("member-count");
        if (el) tickerFlick(el, STATIC_MEMBER_COUNT, data.totalMemberCount);
      }
      if (data.lastMessageDate) {
        const lastActive = document.getElementById("last-active");
        if (lastActive) {
          const ago = timeSince(new Date(data.lastMessageDate));
          lastActive.querySelector(".active-text")!.textContent = `Active ${ago}`;
          lastActive.style.display = "";
        }
      }
    } catch {}
  })();
}

function initMembers() {
  const list = document.getElementById("member-list");
  const filterContainer = document.getElementById("member-filters");
  if (!list || !filterContainer) return;

  const filters = { people: true, projects: true };

  function render() {
    list.innerHTML = "";
    const filtered = members.filter((m) => m.type === "person" ? filters.people : filters.projects);
    list.appendChild(
      <>{filtered.map((m) => (
        <a href={m.url} target="_blank" rel="noopener" className="member-row">
          <img src={`assets/logos/${m.logo}`} alt={m.name} />
          <span className="member-name">{m.name}</span>
          <span className="member-area">{m.area}</span>
        </a>
      ))}</>
    );
  }

  function renderFilters() {
    filterContainer.innerHTML = "";
    filterContainer.appendChild(
      <div className="filter-row">
        <button className={`filter-card ${filters.people ? "active" : ""}`}
          onclick={() => { filters.people = !filters.people; renderFilters(); render(); }}>
          <span className="filter-check">{filters.people ? "\u2713" : ""}</span> People
        </button>
        <button className={`filter-card ${filters.projects ? "active" : ""}`}
          onclick={() => { filters.projects = !filters.projects; renderFilters(); render(); }}>
          <span className="filter-check">{filters.projects ? "\u2713" : ""}</span> Projects
        </button>
      </div>
    );
  }

  renderFilters();
  render();
}

function initExpertise() {
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
  const mining = document.getElementById("pow-mining");
  const charsEl = document.getElementById("pow-chars");
  const hashEl = document.getElementById("pow-hash");
  const emailRow = document.getElementById("pow-email");
  const glowEl = document.getElementById("pow-glow");
  if (!btn || !mining || !charsEl || !hashEl || !emailRow || !glowEl) return;

  let solved = false;

  async function mine() {
    if (solved) return;
    btn.style.display = "none";
    mining.style.display = "block";
    mining.style.maxHeight = "0";
    mining.style.opacity = "0";
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
        for (let c = 0; c < 26; c++)
          for (let d = 0; d < 26; d++)
            batch.push(CHARS[a] + CHARS[b] + CHARS[c] + CHARS[d]);

        const hashes = await Promise.all(batch.map((s) => crypto.subtle.digest("SHA-256", encoder.encode(s))));

        for (let i = 0; i < batch.length; i++) {
          attempts++;
          const hex = toHex(hashes[i]);
          const guess = batch[i];

          if (attempts % 31 === 0) {
            charsEl.innerHTML = renderChars(locked, found);
            hashEl.textContent = `sha256(${guess}) = ${hex.slice(0, 32)}...  [${attempts.toLocaleString()} attempts]`;
          }

          if (hex === TARGET) {
            const finalChars = guess.split("");
            for (let p = 0; p < 4; p++) {
              locked[p] = finalChars[p];
              found[p] = true;
              charsEl.innerHTML = renderChars(locked, found);
              await new Promise((r) => setTimeout(r, 200));
            }
            solved = true;
            const email = guess + SUFFIX;
            glowEl.classList.add("solved");
            hashEl.textContent = `sha256(${guess}) = ${hex}`;
            hashEl.style.color = "var(--accent)";

            const link = document.createElement("a");
            link.href = `mailto:${email}`;
            link.innerHTML = `<span style="color:var(--accent);">${guess}</span><span style="color:var(--text-muted);font-weight:400;">${SUFFIX}</span>`;
            link.id = "pow-chars";
            link.style.cssText = "position:relative;z-index:1;font-size:1.4rem;letter-spacing:0.05em;color:var(--brown);font-weight:600;text-decoration:none;";
            charsEl.replaceWith(link);

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
            document.getElementById("pow-status-msg")?.classList.add("visible");
            return;
          }
        }
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }

  btn.addEventListener("click", mine);
}

// --- Page init dispatch ---
const PAGE_INIT: Record<string, () => void> = {
  home: initHome,
  members: initMembers,
  expertise: initExpertise,
};

// --- Nav setup ---
function initNav(route: string) {
  const nav = document.querySelector("nav");
  if (!nav) return;
  nav.innerHTML = "";
  nav.appendChild(<Nav activePage={route} />);
}

// --- Fade-in observer ---
function initFadeIn() {
  document.querySelectorAll(".fade-in").forEach((el) => {
    (el as HTMLElement).style.opacity = "0";
    (el as HTMLElement).style.transform = "translateY(20px)";
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).style.transition = "opacity 0.6s, transform 0.6s";
        (e.target as HTMLElement).style.opacity = "1";
        (e.target as HTMLElement).style.transform = "translateY(0)";
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".fade-in").forEach((el) => obs.observe(el));
}

// --- Twitter embed reload ---
function reloadTwitterEmbeds() {
  if ((window as any).twttr?.widgets) {
    (window as any).twttr.widgets.load();
  }
}

// --- SPA navigation ---
const pageCache = new Map<string, string>();

async function navigate(url: string, pushState = true) {
  const route = url.replace(/\/$/, "").split("/").pop()?.replace(".html", "") || "home";
  const htmlFile = route === "home" ? "index.html" : route + ".html";

  // Fetch page HTML (cached)
  let html = pageCache.get(htmlFile);
  if (!html) {
    const res = await fetch(htmlFile);
    if (!res.ok) { location.href = url; return; }
    html = await res.text();
    pageCache.set(htmlFile, html);
  }

  // Parse and extract <main> and <title>
  const doc = new DOMParser().parseFromString(html, "text/html");
  const newMain = doc.querySelector("main");
  const newTitle = doc.querySelector("title")?.textContent || "Aus Buildooors";

  if (!newMain) { location.href = url; return; }

  // Swap
  document.title = newTitle;
  const main = document.querySelector("main")!;
  main.innerHTML = newMain.innerHTML;

  // Update URL
  if (pushState) history.pushState({}, "", url);

  // Re-init
  initNav(route === "index" ? "home" : route);
  initFadeIn();
  reloadTwitterEmbeds();
  PAGE_INIT[route]?.();

  // Scroll to top
  window.scrollTo(0, 0);
}

// --- Intercept internal links ---
function isInternalLink(a: HTMLAnchorElement): boolean {
  if (a.target === "_blank") return false;
  if (a.origin !== location.origin) return false;
  const href = a.getAttribute("href") || "";
  return /^(index|about|members|expertise)\.html$/.test(href) ||
         /^\.\/(index|about|members|expertise)\.html$/.test(href);
}

document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest("a") as HTMLAnchorElement | null;
  if (!a || !isInternalLink(a)) return;
  e.preventDefault();
  const href = a.getAttribute("href")!.replace("./", "");
  navigate(href);
});

window.addEventListener("popstate", () => {
  const path = location.pathname.split("/").pop() || "index.html";
  navigate(path, false);
});

// --- Initial page load ---
const route = currentRoute();
initNav(route);
initFadeIn();
PAGE_INIT[route]?.();
