import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from 'vitest';
import '@testing-library/jest-dom';

import PercentageButton from "./index";

describe("PercentageButton Component", () => {
  const mockOnClick = vi.fn();
  const percentage = 50;
  const width = 75;

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test("renders correctly with given props", () => {
    render(<PercentageButton percentage={percentage} onClick={mockOnClick} width={width} />);
    
    const button = screen.getByText(`${percentage}%`);
    expect(button).toBeInTheDocument();
    
    const layer = button.querySelector(".percentage-input__button-layer");
    expect(layer).toHaveStyle(`width: ${width}%`);
  });

  test("calls onClick handler with correct percentage when clicked", () => {
    render(<PercentageButton percentage={percentage} onClick={mockOnClick} width={width} />);
    
    const button = screen.getByText(`${percentage}%`);
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(percentage);
  });
});