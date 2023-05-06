import { createSignal } from "solid-js";
import { RoundButton } from "./RoundButton";

export function OverlappingButton(props: {
  placeholder?: string;
  onSubmit: (text: string) => void;
}) {
  const [showInput, setShowInput] = createSignal(false);
  const [sectionInput, setSectionInput] = createSignal("");
  const [valid, setValid] = createSignal(true);
  let inputRef: HTMLInputElement | undefined = undefined;

  function handleSectionInputChange(
    event: Event & { target: HTMLInputElement }
  ) {
    setSectionInput(event.target.value);
  }

  function handleKeyUp(e: Event) {
    setValid(inputRef?.value !== "");
  }

  function onSubmit(e: Event) {
    e.preventDefault();
    if (!valid()) {
      setShowInput(false);
      setValid(true);
      return;
    } else if (!showInput()) {
      setValid(false);
      setShowInput(true);
    } else {
      if (sectionInput() == "") return;
      props.onSubmit(sectionInput());
      setSectionInput("");
      setShowInput(false);
    }
  }

  return (
    <form onSubmit={onSubmit} class="relative w-fit">
      <input
        ref={inputRef}
        class={`neu-input p-2 transition-width ${
          showInput() ? "w-40" : "w-10"
        }`}
        disabled={!showInput()}
        type="text"
        value={sectionInput()}
        onChange={handleSectionInputChange}
        onKeyUp={handleKeyUp}
        placeholder={props.placeholder}
      />
      <RoundButton class="absolute top-1 right-1" valid={valid()} />
    </form>
  );
}
