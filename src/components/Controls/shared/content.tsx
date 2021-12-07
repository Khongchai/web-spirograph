const Content: React.FC<{ paramName: string; value: number | boolean }> = ({
  paramName,
  value,
}) => (
  //Different switches for number and boolean values

  <div className="flex flex-row">
    <h2 className="font-bold text-base mr-1.5">{paramName}: </h2>
    <div>
      <h3 className="text-white">{value.toString()}</h3>
    </div>
  </div>
);

export default Content;
