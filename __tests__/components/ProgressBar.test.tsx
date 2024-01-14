
import { render, screen } from '@testing-library/react';
import ProgressBar from '@/components/ProgressBar';

describe('ProgressBar Component', () => {
  it('should render the text and progress bar correctly', () => {
    const testText = "Download Progress";
    const testPercentage = 68;

    render(<ProgressBar text={testText} percentage={testPercentage} />);

    // Check if the text is displayed
    const textElement = screen.getByText(testText);
    expect(textElement).toBeInTheDocument();

    // Check if the percentage is displayed inside the progress bar
    const progressTextElement = screen.getByText(`${testPercentage}%`);
    expect(progressTextElement).toBeInTheDocument();

    // Check if the CircularProgress component has the correct value    
    const progressElement = screen.getByRole('progressbar');
    expect(progressElement).toHaveAttribute('aria-valuenow', testPercentage.toString());
  });

  it('should handle a missing or undefined percentage', () => {
    render(<ProgressBar text="Loading" />);

    // Percentage should be displayed as "0%"
    const progressTextElement = screen.getByText('0%');
    expect(progressTextElement).toBeInTheDocument();

    // CircularProgress should have a value of 0
    const progressElement = screen.getByRole('progressbar');
    expect(progressElement).toHaveAttribute('aria-valuenow', '0');
  });
});