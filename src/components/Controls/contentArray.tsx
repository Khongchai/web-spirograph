import SelectionButton from "./button";

const ContentArray: React.FC<{
  paramName: string;
  values: any[];
  index: number;
}> = ({ paramName, values, index }) => (
  <div>
    <h2 className="font-bold text-base mr-1.5">{paramName}: </h2>
    <div className="flex mt-2">
      {values.map((value, i) => (
        <SelectionButton blur={i !== index} innerHTML={value.toString()} />
      ))}
    </div>
  </div>
);

export default ContentArray;
