export function h(
  tag: string | ((props: any) => Node),
  props: Record<string, any> | null,
  ...children: any[]
): Node {
  if (typeof tag === "function") {
    return tag({ ...props, children: children.length <= 1 ? children[0] : children });
  }

  const el = document.createElement(tag);

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === "className") {
        el.className = value;
      } else if (key.startsWith("on") && typeof value === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, String(value));
      }
    }
  }

  appendChildren(el, children);
  return el;
}

function appendChildren(parent: Node, children: any[]) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    if (child instanceof Node) {
      parent.appendChild(child);
    } else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  }
}

export function Fragment({ children }: { children?: any }): DocumentFragment {
  const frag = document.createDocumentFragment();
  if (children != null) {
    appendChildren(frag, Array.isArray(children) ? children : [children]);
  }
  return frag;
}

declare global {
  namespace JSX {
    type Element = Node;
    interface IntrinsicElements {
      [tag: string]: any;
    }
  }
}
