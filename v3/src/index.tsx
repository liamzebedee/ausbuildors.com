import { h } from "./jsx";
import { Nav } from "./Nav";

document.querySelector("nav")!.appendChild(<Nav activePage="home" />);

// Calculate monthly meetups since Nov 2022
const start = new Date(2022, 10);
const now = new Date();
const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
document.getElementById("meetup-count")!.textContent = months + "+";
