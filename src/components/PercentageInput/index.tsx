import {
  FC,
  ChangeEvent,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import PercentageButton from "../PercentageButton";

interface PercentageInputProps {
  currency: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  onFocus: () => void;
}

const PercentageInput: FC<PercentageInputProps> = ({
  currency,
  min,
  max,
  step,
  value,
  onChange,
  onFocus,
}) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  const percentages = useMemo(() => [25, 50, 75, 100], []);

  const handlePercentageClick = useCallback(
    (percentage: number) => {
      const newValue = (max * percentage) / 100;
      onChange(newValue);
    },
    [max, onChange]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Проверяем, что введённое значение соответствует формату числа
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        const numericValue = parseFloat(value);

        // Если значение некорректное (NaN), устанавливаем min
        if (isNaN(numericValue)) {
          onChange(min);
          setInputValue(min.toString());
          return;
        }

        // Если значение меньше min, устанавливаем min
        if (numericValue < min) {
          onChange(min);
          setInputValue(min.toString());
          return;
        }

        // Если значение больше max, устанавливаем max
        if (numericValue > max) {
          onChange(max);
          setInputValue(max.toString());
          return;
        }

        // Если значение корректное, обновляем состояние
        onChange(numericValue);
        setInputValue(value);
      }
    },
    [min, max, onChange]
  );

  const calculateWidth = useCallback(
    (percentage: number): number => {
      const percentageValue = (value / max) * 100;
      if (percentageValue >= percentage) {
        return 100;
      } else if (
        percentageValue > percentage - 25 &&
        percentageValue < percentage
      ) {
        return ((percentageValue - (percentage - 25)) / 25) * 100;
      } else {
        return 0;
      }
    },
    [value, max]
  );

  const currencyOffsetX = useMemo(() => inputValue.length * 24, [inputValue]);

  // Синхронизация inputValue с value из пропсов
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  return (
    <div className="percentage-input">
      <div className="percentage-input__wrapper">
        <input
          className="percentage-input__field"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={onFocus}
          type="text"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
        />
        <span
          className="percentage-input__currency"
          style={{ left: currencyOffsetX }}
        >
          {currency}
        </span>
      </div>
      <div className="percentage-input__buttons">
        {percentages.map((percentage) => (
          <PercentageButton
            key={percentage}
            percentage={percentage}
            onClick={handlePercentageClick}
            width={calculateWidth(percentage)}
          />
        ))}
      </div>
    </div>
  );
};

export default PercentageInput;
