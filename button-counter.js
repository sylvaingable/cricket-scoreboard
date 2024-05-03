class CounterButton extends HTMLElement {
  static observedAttributes = ["data-label", "data-value"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Add a default value if the attribute if not set explicitly from outside
    if (!this.hasAttribute("data-value")) {
      this.setAttribute("data-value", 0);
    }
    this.shadowRoot.innerHTML = `
      <div class="container" part="container">
        <button type="button" part="button">${this.dataset.label}</button>
        <div id="value">0</div>
      </div>    
      <style>
        .container {
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
        }
        .container > * {
          font-size: 1rem;
          font-family: sans-serif;
          line-height: 1rem;  
          padding: 0 0.5rem;
        }
        button {
          height: 100%;
          border: 0;
        }
      </style
    `;
    this.shadowRoot.querySelector(".container").addEventListener("click", () =>
      this.increment()
    );
    this._counter = this.shadowRoot.querySelector("#value");
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (this._counter !== undefined && attrName === "data-value") {
      this._counter.textContent = newValue;
    }
  }

  increment() {
    this.dataset.value = (parseInt(this.dataset.value) + 1) % 10;
  }

  get value() {
    // Exposes the value as an integer rather than a string
    return parseInt(this.dataset.value);
  }

  reset() {
    this._counter.textContent = 0;
  }
}

customElements.define("button-counter", CounterButton);
