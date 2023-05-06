import { createSignal } from "solid-js";

export function EditableText({
  text,
  onChange,
}: {
  text: string;
  onChange: (value: string) => void;
}) {
  const [editing, setEditing] = createSignal(false);
  const [_title, setTitle] = createSignal(text);
  function handleBlur() {
    onChange(_title());
    setEditing(false);
  }
  return (
    <div>
      {!editing() ? (
        <p class="text-3xl" onClick={() => setEditing(true)}>
          {_title()}
        </p>
      ) : (
        <input
          type="text"
          value={_title()}
          onBlur={handleBlur}
          onChange={(e) => {
            handleBlur();
            setTitle(e.target.value);
            onChange(_title());
          }}
        />
      )}
    </div>
  );
}
