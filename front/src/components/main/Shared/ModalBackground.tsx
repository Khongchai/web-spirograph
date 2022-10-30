interface ModalBackgroundProps {
  children: React.ReactNode;
  onBgClicked?: () => void;
}

export default function ModalBackground({
  children,
  onBgClicked,
}: ModalBackgroundProps) {
  return (
    <div className="fixed w-full h-full grid place-items-center top-0 left-0">
      <div className="z-20">{children}</div>
      <div
        className="fixed w-full h-full bg-purple-dark opacity-80 top-0 left-0 z-1
        transition-opacity duration-500 
        "
        onClick={onBgClicked}
      />
    </div>
  );
}
