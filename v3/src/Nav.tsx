import { h } from "./jsx";

interface NavProps {
  activePage: string;
}

export function Nav({ activePage }: NavProps) {
  const toggle = () => document.querySelector(".nav-links")?.classList.toggle("open");

  return (
    <div className="nav-inner">
      <a href="index.html" className="nav-logo">
        <img src="logo.png" alt="Aus Buildooors" />
        <span>Aus Buildooors</span>
      </a>
      <button className="nav-toggle" aria-label="Menu" onClick={toggle}>
        {"\u2630"}
      </button>
      <div className="nav-links">
        <a href="index.html" className={activePage === "home" ? "active" : ""}>Home</a>
        <a href="about.html" className={activePage === "about" ? "active" : ""}>About</a>
        <a href="members.html" className={activePage === "members" ? "active" : ""}>Members</a>
        <a href="expertise.html" className={activePage === "expertise" ? "active" : ""}>Expertise</a>
        <a href="/join" className={activePage === "join" ? "active" : ""}>Join</a>
      </div>
    </div>
  );
}
