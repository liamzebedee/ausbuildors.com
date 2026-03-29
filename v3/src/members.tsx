import { h, Fragment } from "./jsx";
import { Nav } from "./Nav";
import { members } from "./data/members";

document.querySelector("nav")!.appendChild(<Nav activePage="members" />);

const list = document.getElementById("member-list")!;
const filterContainer = document.getElementById("member-filters")!;

const filters = { people: true, projects: true };

function render() {
  list.innerHTML = "";
  const filtered = members.filter((m) => {
    if (m.type === "person") return filters.people;
    return filters.projects;
  });
  list.appendChild(
    <>
      {filtered.map((m) => (
        <a href={m.url} target="_blank" rel="noopener" className="member-row">
          <img src={`assets/logos/${m.logo}`} alt={m.name} />
          <span className="member-name">{m.name}</span>
          <span className="member-area">{m.area}</span>
        </a>
      ))}
    </>
  );
}

function renderFilters() {
  filterContainer.innerHTML = "";
  filterContainer.appendChild(
    <div className="filter-row">
      <button
        className={`filter-card ${filters.people ? "active" : ""}`}
        onclick={() => { filters.people = !filters.people; renderFilters(); render(); }}
      >
        <span className="filter-check">{filters.people ? "\u2713" : ""}</span>
        People
      </button>
      <button
        className={`filter-card ${filters.projects ? "active" : ""}`}
        onclick={() => { filters.projects = !filters.projects; renderFilters(); render(); }}
      >
        <span className="filter-check">{filters.projects ? "\u2713" : ""}</span>
        Projects
      </button>
    </div>
  );
}

renderFilters();
render();
