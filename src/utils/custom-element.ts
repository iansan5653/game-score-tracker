const idCounts = new Map<string, number>()

function uniqueId(prefix: string) {
  let count = (idCounts.get(prefix) ?? -1) + 1
  idCounts.set(prefix, count)
  return `${prefix}-${count}`
}

export abstract class CustomElement<EventMap extends Record<string, Event>> extends HTMLElement {
  addEventListener<K extends keyof EventMap>(
    type: K,
    listener: EventListenerObject | ((this: this, event: EventMap[K]) => void),
    options?: boolean | AddEventListenerOptions
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener, options);
  }

  /** For convenience - can be used as the base ID for child elements. */
  protected readonly uniqueId = uniqueId(this.tagName);

  /**
   * @param template Template containing HTML to clone into the shadow root.
   */
  constructor(template?: HTMLTemplateElement) {
    super();

    if (template) {
      this.attachShadow({mode: 'open'});
      this.shadowRoot?.append(template.content.cloneNode(true));
    }
  }
}

type Constructor<T> = new (...args: any[]) => T;

/** Decorator to register a custom element to the registry. */
export const register = <Name extends keyof HTMLElementTagNameMap>(name: Name) => (target: Constructor<HTMLElementTagNameMap[Name]>) => {
  customElements.define(name, target);
  }
