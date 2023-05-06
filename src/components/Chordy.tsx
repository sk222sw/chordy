import { For, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { OverlappingButton } from "./ui/OverlappingButton";
import { EditableText } from "./ui/EditableText";
import { RoundButton } from "./ui/RoundButton";

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
      class="bg-inherit border border-cyan-300"
      type="text"
      onKeyUp={props.onKeyUp}
      value={value()}
      onChange={onChange}
    />
  );
}

function Section(props: {
  section: SectionType;
  addChord: (
    chord: string,
    section: SectionType,
    sectionIndex: number,
    barIndex: number
  ) => void;
  sectionIndex: number;
  addBars: (sectionIndex: number) => void;
}) {
  const [activeFormInput, setActiveFormInput] = createSignal("");

  const onKeyUp =
    (section: SectionType, sectionIndex: number) => (event: KeyUpEvent) => {
      if (event.key === "Tab") {
        console.log("tab");
        event.preventDefault();
      } else if (event.key !== "Enter") {
        return;
      }

      const barIndex = +activeFormInput().split("-")?.[1];

      props.addChord(
        event.currentTarget.value,
        section,
        sectionIndex,
        barIndex
      );
    };

  function onFocus(section: number, bar: number, i: number) {
    return function (e: Event) {
      e.preventDefault();
      setActiveFormInput(`${section}-${bar}-${i}`);
    };
  }

  function onAddBarsClick() {
    props.addBars(props.sectionIndex);
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
                  <ChordInput
                    onFocus={onFocus(
                      props.sectionIndex,
                      barIndex(),
                      chordIndex
                    )}
                    onKeyUp={onKeyUp(props.section, props.sectionIndex)}
                  />
                </>
              ))}
            </div>
          )}
        </For>
        <RoundButton class="mt-4" valid={true} onClick={onAddBarsClick} />
      </div>
    </>
  );
}

function Sections(props: {
  sections: SectionType[];
  addChord: (
    chord: string,
    section: SectionType,
    sectionIndex: number,
    barIndex: number
  ) => void;
  addBars: (sectionIndex: number) => void;
}) {
  return (
    <div class="grid grid-cols-12 gap-4">
      <For each={props.sections}>
        {(section, sectionIndex) => (
          <Section
            addChord={props.addChord}
            section={section}
            sectionIndex={sectionIndex()}
            addBars={props.addBars}
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

const createSection = (name: string) => ({
  name,
  bars: [{ chords: [] }, { chords: [] }, { chords: [] }, { chords: [] }],
});

const WHOLE = 1;
const HALF = 0.5;
const QUARTER = 0.25;
type Whole = typeof WHOLE;
type Half = typeof HALF;
type Quarter = typeof QUARTER;
type Resolution = Whole | Half | Quarter;

type State = {
  resolution: Resolution;
  title: string;
  sections: SectionType[];
};

const initialState: State = {
  title: "Title",
  sections: [createSection("Verse"), createSection("Chorus")],
  resolution: WHOLE,
};

export default function Chordy() {
  const [state, setState] = createStore<typeof initialState>(initialState);

  function updateTitle(title: string) {
    setState("title", title);
  }

  function handleAddSection(value: string) {
    setState("sections", (prev: SectionType[]) => [
      ...prev,
      createSection(value),
    ]);
  }

  function addChord(
    chord: string,
    section: SectionType,
    sectionIndex: number,
    barIndex: number
  ) {
    console.log(chord);
    setState(
      produce((s) => {
        s.sections[sectionIndex].bars[barIndex].chords.push({
          text: chord,
          length: state.resolution,
        });
      })
    );
  }

  function addBars(sectionIndex: number) {
    setState(
      produce((s) => {
        const section = s.sections[sectionIndex];
        console.log(s.sections, sectionIndex, section);
        section.bars = [
          ...section.bars,
          { chords: [] },
          { chords: [] },
          { chords: [] },
          { chords: [] },
        ];
      })
    );
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
        <Sections
          sections={state.sections}
          addChord={addChord}
          addBars={addBars}
        />
        <div>{JSON.stringify(state)}</div>
      </div>
    </div>
  );
}
