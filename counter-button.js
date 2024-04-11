class CounterButton extends HTMLElement {
  static get observedAttributes() {
    return ["label", "name"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._counter = 0;
  }

  connectedCallback() {
    this.render();
    this.containerElement = this.shadowRoot.querySelector(".container");
    this.counterElement = this.shadowRoot.querySelector("span");
    this.containerElement.addEventListener("click", () => this.increment());
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "label" || name === "name") {
      this.render();
    }
  }

  get counter() {
    return this._counter;
  }

  get label() {
    return this.getAttribute("label");
  }

  set label(newValue) {
    this.setAttribute("label", newValue);
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(newValue) {
    this.setAttribute("name", newValue);
  }

  get value() {
    return this._counter;
  }

  set value(newValue) {
    this._counter = newValue;
    this.counterElement.textContent = this._counter;
  }

  increment() {
    this._counter = (this._counter + 1) % 10;
    this.counterElement.textContent = this._counter;
    this.dispatchEvent(new CustomEvent("input")); // Dispatch an input event when the counter changes
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container, button {
          box-sizing: border-box;
          cursor: pointer;
          user-select: none;
        }
        .container {
          height: 2rem;
          display: flex;
          align-items: center;
          border: 1px solid var(--dark);
          font-size: 1rem;
          font-family: sans-serif;
          line-height: 1rem;
        }
        button {
          height: 100%;
          border: 0;
          margin: 0;
          background: var(--dark);
          color: white;
          font-family: sans-serif;
          padding: 0.25rem 0.5rem;
        }
        span {
          padding: 0 0.5rem;
        }
      </style>
      <div class="container">
        <button>${this.label}</button>
        <span>${this._counter}</span>
      </div>
    `;
  }
}

customElements.define('counter-button', CounterButton);