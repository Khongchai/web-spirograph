import { SidebySideButtonsVariant } from "./shared/control";

export default function SidebySideButtonsControl({
  onLeftClicked,
  onRightClicked,
}: SidebySideButtonsVariant) {
  return (
    <div className="flex ">
      <Button innerHTML={"+"} onClick={onLeftClicked} />
      <Button innerHTML={"-"} onClick={onRightClicked} />
    </div>
  );
}

function Button({
  onClick,
  innerHTML,
}: {
  onClick: VoidFunction;
  innerHTML: any;
}) {
  return (
    <div className="pl-3 cursor-pointer select-none text-lg " onClick={onClick}>
      {innerHTML}
    </div>
  );
}
