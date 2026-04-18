interface Props {
  children: React.ReactNode;
  tilt?: "left" | "right";
}

export function MarginNote({ children, tilt = "left" }: Props) {
  return (
    <aside
      className="margin-note max-w-[22ch]"
      style={{ transform: `rotate(${tilt === "left" ? "-1.8deg" : "1.6deg"})` }}
    >
      <span className="block">{children}</span>
    </aside>
  );
}
