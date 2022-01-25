import BooleanValueControl from "../BooleanValueControl";
import DraggableValue from "./DraggableValueControl";

type ContentType = {
  paramName: string;
} & (
  | {
      numberValue: number;
      onDrag: (newValue: number) => void;
      booleanValue?: never;
      onClick?: never;
    }
  | {
      numberValue?: never;
      onDrag?: never;
      booleanValue: boolean;
      onClick: (newValue: boolean) => void;
    }
);

const Content: React.FC<ContentType> = ({
  paramName,
  numberValue,
  booleanValue,
  onDrag,
  onClick,
}) => {
  return (
    <div className="flex flex-row">
      <h2 className="font-bold text-base mr-1.5">{paramName}: </h2>
      <div>
        {booleanValue ? (
          <BooleanValueControl value={booleanValue} onClick={onClick!} />
        ) : (
          <DraggableValue onDrag={onDrag!} value={numberValue!} />
        )}
      </div>
    </div>
  );
};

export default Content;
