import {
  FC,
} from "react";

interface PercentageButtonProps {
  percentage: number;
  onClick: (percentage: number) => void;
  width: number;
}

const PercentageButton: FC<PercentageButtonProps> = ({
  percentage,
  onClick,
  width,
}) => {
  return (
    <div
      className="percentage-input__button"
      onClick={() => onClick(percentage)}
    >
      <div
        className="percentage-input__button-layer"
        style={{ width: `${width}%` }}
      ></div>
      {percentage}%
    </div>
  );
};

export default PercentageButton;
