export function RoundButton(props: {
  valid?: boolean;
  onClick?: (arg0?: any) => void;
  class?: string;
}) {
  const valid = props.valid ?? true;
  const onClick = props.onClick ?? (() => {});
  let _class =
    "neu-btn-inside w-8 h-8 font-bold text-slate-600 active:text-slate-300 hover:text-slate-400";
  if (props.class) {
    _class += ` ${props.class}`;
  }

  return (
    <button onClick={onClick} class={_class}>
      {valid ? <span>+</span> : <span>x</span>}
    </button>
  );
}
