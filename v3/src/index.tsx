import { h } from "./jsx";
import { Nav } from "./Nav";

document.querySelector("nav")!.appendChild(<Nav activePage="home" />);

const AUSBUILDOR_API_BASE_URL = "https://liamz.co/api/ausbuildor";

// Calculate meetup count: 49 + months since today (2026-03-29)
const meetupBase = 49;
const meetupEpoch = new Date(2026, 2); // March 2026
const now = new Date();
const monthsSinceEpoch = (now.getFullYear() - meetupEpoch.getFullYear()) * 12 + (now.getMonth() - meetupEpoch.getMonth());
const meetupCount = meetupBase + Math.max(0, monthsSinceEpoch);
document.getElementById("meetup-count")!.textContent = meetupCount + "+";

// Static member count fallback
const STATIC_MEMBER_COUNT = 460;

// Ticker animation from current value to target
function tickerFlick(el: HTMLElement, from: number, to: number, duration = 800) {
  if (from === to) return;
  const start = performance.now();
  const diff = to - from;
  function frame(t: number) {
    const elapsed = t - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(from + diff * progress);
    el.textContent = current + "+";
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// Fetch live stats
(async () => {
  try {
    const res = await fetch(AUSBUILDOR_API_BASE_URL);
    if (!res.ok) return;
    const data = await res.json();

    if (data.totalMemberCount && typeof data.totalMemberCount === "number") {
      const el = document.getElementById("member-count")!;
      tickerFlick(el, STATIC_MEMBER_COUNT, data.totalMemberCount);
    }

    if (data.lastMessageDate) {
      const lastActive = document.getElementById("last-active")!;
      const date = new Date(data.lastMessageDate);
      const ago = timeSince(date);
      lastActive.querySelector(".active-text")!.textContent = `Active ${ago}`;
      lastActive.style.display = "";
    }
  } catch {
    // API unavailable — static values remain
  }
})();

function timeSince(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
