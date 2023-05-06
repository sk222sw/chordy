const chordLetters = ["A", "B", "C", "D", "E", "F", "G"] as const;

type ChordLetter = (typeof chordLetters)[number];
type Accidental = null | "#" | "b";
type ChordFlavor = null | "min";
type Alteration = null | "7" | "maj7";

var sodih: ChordLetter = "A";

type X = ChordLetter | Accidental | ChordFlavor | Alteration;

type Length<T extends unknown[]> = T["length"];
export type HasLength<
  T extends unknown[],
  N extends number
> = Length<T> extends N ? true : false;

// prettier-ignore
type Chord<T extends unknown[]> = 
  HasLength<T, 4> extends true
    ? [ChordLetter, Accidental, ChordFlavor, Alteration]

    : HasLength<T, 3> extends true
      ? [ChordLetter, ChordLetter, ChordLetter]

      : HasLength<T, 2> extends true
       ? [ChordLetter,  Accidental]

        : never
// [ChordLetter]

// prettier-ignore
type Chord2<T extends unknown[]> =
  HasLength<T, 1> extends true ? number : string

let a: Chord2<["A"]>; // = ["A"];
let b: Chord<[9]>; // = ["A"];
