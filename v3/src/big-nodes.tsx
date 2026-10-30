import { h, Fragment } from "./jsx";
import { Nav } from "./Nav";
import { bigNodes } from "./data/big-nodes";

document.querySelector("nav")!.appendChild(<Nav activePage="big-nodes" />);

const list = document.getElementById("big-nodes-list")!;

function render() {
  list.innerHTML = "";
  list.appendChild(
    <>
      {bigNodes.map((m) => (
        <a href={m.url} target="_blank" rel="noopener" className="member-row">
          <span className="member-name">{m.name}</span>
          {m.area && <span className="member-area">{m.area}</span>}
        </a>
      ))}
    </>
  );
}

render();
