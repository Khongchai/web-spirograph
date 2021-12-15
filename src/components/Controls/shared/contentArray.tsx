import SelectionButton from "./SelectionButton";

const ContentArray: React.FC<{
  paramName: string;
  values: any[];
  index: number;
  onClick: (newIndex: number) => void;
}> = ({ paramName, values, index, onClick }) => (
  <div>
    <h2 className="font-bold text-base mr-1.5">{paramName}: </h2>
    <div className="flex mt-2">
      {values.map((value, i) => (
        <SelectionButton
          onClick={() => onClick(i)}
          key={value}
          blur={i !== index}
          innerHTML={value.toString()}
        />
      ))}
    </div>
  </div>
);

export default ContentArray;
