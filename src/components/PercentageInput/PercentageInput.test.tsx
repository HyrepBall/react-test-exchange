import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PercentageInput from './index';

// Мокаем компонент PercentageButton, так как он не является целью тестирования
vi.mock('../PercentageButton', () => ({
  default: vi.fn(({ percentage, onClick, width }) => (
    <button onClick={() => onClick(percentage)} style={{ width: `${width}%` }}>
      {percentage}%
    </button>
  )),
}));

describe('PercentageInput', () => {
  const props = {
    currency: '$',
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    onChange: vi.fn(),
    onFocus: vi.fn(),
  };

  it('renders correctly with initial value', () => {
    render(<PercentageInput {...props} />);
    expect(screen.getByRole('textbox')).toHaveValue('50');
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<PercentageInput {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '75' } });
    expect(props.onChange).toHaveBeenCalledWith(75);
    expect(input).toHaveValue('75');
  });

  it('handles percentage button clicks', () => {
    render(<PercentageInput {...props} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(props.onChange).toHaveBeenCalledWith(25);
  });

  it('calculates width correctly for percentage buttons', () => {
    render(<PercentageInput {...props} value={30} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveStyle('width: 100%');
    expect(buttons[1]).toHaveStyle('width: 20%');
  });

  it('updates currency position based on input length', () => {
    render(<PercentageInput {...props} value={1234} />);
    const currency = screen.getByText('$');
    expect(currency).toHaveStyle('left: 96px');
  });
});