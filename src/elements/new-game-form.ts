import {CustomElement, register} from "../utils/custom-element.js";

class NewGameFormSubmitEvent extends Event {
  constructor(public readonly names: readonly string[]) {
    super('create-game');
  }
}

type NewGameFormEventMap = {
  'create-game': NewGameFormSubmitEvent;
}

declare global {
  interface HTMLElementTagNameMap {
    'new-game-form': NewGameFormElement;
  }
}

const newGameFormTemplate = document.createElement('template');
newGameFormTemplate.innerHTML = /* html */`
<style>
  :host {
    display: block;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>

<form>
  <label for="names-field">Names</label>
  <p id="names-field-description">Enter one name per line.</p>
  <textarea
    name="names"
    id="names-field"
    placeholder="Player 1&#10;Player 2&#10;Player 3"
    required
    aria-describedby="names-field-description"
  ></textarea>

  <button type="submit">Create Game</button>
</form>
`;

@register('new-game-form')
class NewGameFormElement extends CustomElement<NewGameFormEventMap> {
  #form: HTMLFormElement | undefined;

  constructor() {
    super(newGameFormTemplate);

    this.#form = this.shadowRoot?.querySelector('form') ?? undefined;

    this.#form?.addEventListener('submit', this.#onSubmit.bind(this));
  }

  #onSubmit(event: SubmitEvent) {
    event.preventDefault();

    const namesEntry = new FormData(this.#form).get('names');
    const names = typeof namesEntry === 'string' ? namesEntry.split('\n') : []

    this.dispatchEvent(new NewGameFormSubmitEvent(names));
  }
}
