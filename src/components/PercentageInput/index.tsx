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

  // Функция для округления ввода в зависимости от шага
  const roundToStep = (value: number, step: number) => {
    return Math.round(value / step) * step;
  };

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Разрешаем точку, если она в конце строки
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        const dotCount = value.split(".").length - 1;

        // Если точка в конце строки и вводятся цифры, разрешаем их
        if (dotCount === 1 && value[value.length - 1] === ".") {
          setInputValue(value); // Просто обновляем inputValue без изменений
          return;
        }

        // Преобразуем строку в число, если точка не в конце
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

        // Округляем значение в зависимости от шага
        const roundedValue = roundToStep(numericValue, step);

        // Если значение корректное, обновляем состояние
        onChange(roundedValue);
        setInputValue(roundedValue.toString());
      }
    },
    [min, max, step, onChange]
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
