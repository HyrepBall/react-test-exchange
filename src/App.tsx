import React, {
  useState,
  useCallback,
  useEffect,
} from "react";

import PercentageInput from "./components/PercentageInput";

const App: React.FC = () => {
  const [leftValue, setLeftValue] = useState<number>(10000);
  const [rightValue, setRightValue] = useState<number>(0);
  const [isLeftFocused, setIsLeftFocused] = useState<boolean>(false);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);

  const fetchExchangeRate = useCallback(
    async (amount: number, isLeft: boolean) => {
      const now = Date.now();
      if (now - lastRequestTime < 1000) {
        console.log("Превышен лимит запросов (1 запрос в секунду)");
        return;
      }
      setLastRequestTime(now);

      const payload = isLeft
        ? { inAmount: amount, outAmount: null }
        : { inAmount: null, outAmount: amount };

      try {
        const response = await fetch(
          "https://awx.pro/b2api/change/user/pair/calc",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              serial: "a7307e89-fbeb-4b28-a8ce-55b7fb3c32aa",
            },
            body: JSON.stringify({
              pairId: 133,
              ...payload,
            }),
          }
        );
        const data = await response.json();

        if (isLeft) {
          setRightValue(data.outAmount);
        } else {
          setLeftValue(data.inAmount);
        }
      } catch (error) {
        console.error("Ошибка при запросе к API:", error);
      }
    },
    [lastRequestTime]
  );

  useEffect(() => {
    if (isLeftFocused) {
      fetchExchangeRate(leftValue, true);
    }
  }, [leftValue, isLeftFocused, fetchExchangeRate]);

  useEffect(() => {
    if (!isLeftFocused) {
      fetchExchangeRate(rightValue, false);
    }
  }, [rightValue, isLeftFocused, fetchExchangeRate]);

  return (
    <div className="app">
      <div className="row">
        <PercentageInput
          currency="RUB"
          min={10000}
          max={70000000}
          step={100}
          value={leftValue}
          onChange={setLeftValue}
          onFocus={() => setIsLeftFocused(true)}
        />
        <PercentageInput
          currency="USDT"
          min={0.000001}
          max={70000000 / 96.47} // Пример расчёта max на основе цены из API
          step={0.000001}
          value={rightValue}
          onChange={setRightValue}
          onFocus={() => setIsLeftFocused(false)}
        />
      </div>
    </div>
  );
};

export default App;
