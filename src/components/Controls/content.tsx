const Content: React.FC<{ paramName: string; value: any }> = ({
  paramName,
  value,
}) => (
  <div className="flex flex-row">
    <h2 className="font-bold text-base mr-1.5">{paramName}: </h2>
    <h3 className="text-white">{value.toString()}</h3>
  </div>
);

export default Content;
