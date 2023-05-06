import { For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { OverlappingButton } from "./ui/OverlappingButton";
import { EditableText } from "./ui/EditableText";
const chordLetters = ["A", "B", "C", "D", "E", "F", "G"] as const;

type Song = {
  title: string;
  sections: SectionType[];
};

type SectionType = {
  name: string;
  bars: Bar[];
};

type Chord = {
  text: string;
  length: Resolution;
};

type Bar = {
  chords: Chord[];
};

type KeyUpEvent = KeyboardEvent & {
  currentTarget: HTMLInputElement;
  target: Element;
};

function ChordInput(props: {
  onFocus: (e: Event) => void;
  onKeyUp: (e: KeyUpEvent) => void;
}) {
  const [value, setValue] = createSignal("");
  function onChange(e: any) {
    setValue(e.target.value);
  }
  return (
    <input
      onFocus={props.onFocus}
      class="bg-inherit border w-16"
      type="text"
      onKeyUp={props.onKeyUp}
      value={value()}
      onChange={onChange}
    />
  );
}

function Section(props: {
  section: SectionType;
  addChord: (section: SectionType, sectionIndex: number) => void;
  sectionIndex: number;
}) {
  const [activeFormInput, setActiveFormInput] = createSignal("");
  const resolution = WHOLE;

  const onKeyUp =
    (section: SectionType, sectionIndex: number, chordIndex: number) =>
    (event: KeyUpEvent) => {
      if (event.key !== "Enter") {
        return;
      }

      const barIndex = +activeFormInput().split("-")?.[1];
      const newBar = section.bars[barIndex];
      newBar.chords.push({
        text: event.currentTarget.value,
        length: resolution,
      });
      section.bars[barIndex] = newBar;

      section.bars.push({ chords: [] });

      props.addChord(section, sectionIndex);
    };

  function onFocus(section: number, bar: number, i: number) {
    return function (e: Event) {
      e.preventDefault();
      setActiveFormInput(`${section}-${bar}-${i}`);
    };
  }

  return (
    <>
      <div class="col-span-2 grid items-center justify-end">
        <h3 class="text-xl font-bold">{props.section.name}</h3>
      </div>
      <div class="neu-card min-h-20 col-span-10 flex items-center p-4 flex-wrap justify-between">
        <For each={props.section.bars}>
          {(bar, barIndex) => (
            <div class="">
              {[0].map((chordIndex) => (
                <>
                  |{" "}
                  <ChordInput
                    onFocus={onFocus(
                      props.sectionIndex,
                      barIndex(),
                      chordIndex
                    )}
                    onKeyUp={onKeyUp(
                      props.section,
                      props.sectionIndex,
                      chordIndex
                    )}
                  />
                </>
              ))}
            </div>
          )}
        </For>
      </div>
    </>
  );
}

function Sections(props: {
  sections: SectionType[];
  addChord: (section: SectionType, sectionIndex: number) => void;
}) {
  return (
    <div class="grid grid-cols-12 gap-4">
      <For each={props.sections}>
        {(section, sectionIndex) => (
          <Section
            addChord={props.addChord}
            section={section}
            sectionIndex={sectionIndex()}
          />
        )}
      </For>
    </div>
  );
}

function SectionInput({ addSection }: { addSection: (arg0: string) => void }) {
  function onSubmit(text: string) {
    addSection(text);
  }

  return (
    <div class="flex">
      <div class="flex justify-around">
        {["Chorus", "Verse"].map((s) => (
          <button
            class="mr-4 neu-btn px-4 text-slate-600 active:text-slate-300 hover:text-slate-400 font-bold"
            onClick={() => addSection(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <OverlappingButton onSubmit={onSubmit} />
    </div>
  );
}

const createSection = (name: string) => ({ name, bars: [{ chords: [] }] });

const WHOLE = 1;
const HALF = WHOLE / 2;
const QUARTER = HALF / 2;
type Whole = typeof WHOLE;
type Half = typeof HALF;
type Quarter = typeof QUARTER;
type Resolution = Whole | Half | Quarter;

export default function Chordy() {
  const [state, setState] = createStore({
    title: "Title",
    sections: [createSection("Verse"), createSection("Chorus")],
  });
  const [resolution, setResolution] = createSignal<Resolution>(WHOLE);

  function updateTitle(title: string) {
    setState("title", title);
    // setSong((song) => ({ ...song, name: title }));
  }

  function handleAddSection(value: string) {
    setState("sections", (prev) => [...prev, createSection(value)]);
  }

  function addChord(section: SectionType, sectionIndex: number) {
    // console.log(section);
    // const found = song().sections.find((x) => x === section);
    // console.log("found", found);
    // setSong((song) => {
    //   const sections = song.sections;
    //   sections[sectionIndex] = section;
    //   return {
    //     ...song,
    //     sections,
    //   };
    // });
    // console.log(song());
  }

  return (
    <div class="flex justify-center">
      <div class="w-3/4">
        <div class="m-4">
          <EditableText text={state.title} onChange={updateTitle} />
        </div>
        {/* <div class="chordy-grid border grid grid-cols-3 grid-rows-3 w-36">
        {chordLetters.map((cl) => (
          <div class="col-span-1 row-span-1 flex justify-center">
            <div class="w-6 h-6 flex">{cl}</div>
          </div>
        ))}
      </div> */}
        <SectionInput addSection={handleAddSection} />
        <Sections sections={state.sections} addChord={addChord} />
      </div>
    </div>
  );
}
