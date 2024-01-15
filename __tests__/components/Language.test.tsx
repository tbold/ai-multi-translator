import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Language from '@/components/Language';

test('renders Language component with default values', () => {
  render(<Language output="Some output text"
    languageCode="ace_Arab" index={0} disabled={false} onChange={() => { }} onDelete={() => { }} />);

  // Check for Dropdown, TextField, and initial non-existence of DeleteIcon
  // expect(screen.getByLabelText('Output')).toBeInTheDocument();
  expect(screen.getByRole('textbox')).toBeInTheDocument();
  expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument(); // First item, no delete
});

test.only('calls onChange handler when Dropdown value changes', () => {
  const mockOnChange = jest.fn();
  render(<Language output="Some output text"
    languageCode="ace_Arab" index={1} disabled={false} onChange={mockOnChange} onDelete={() => { }} />);

  const dropdown = screen.getAllByText('Output');
  fireEvent.change(dropdown[0], { target: { value: 'eng' } });

  expect(mockOnChange).toHaveBeenCalledWith(1, 'eng');
});

test('renders DeleteIcon and calls onDelete handler', () => {
  const mockOnDelete = jest.fn();
  render(<Language output="Some output text"
    languageCode="eng" index={1} disabled={false} onChange={() => { }} onDelete={mockOnDelete} />);

  const deleteButton = screen.getByLabelText('Delete');
  fireEvent.click(deleteButton);

  expect(mockOnDelete).toHaveBeenCalledWith(1);
});

test('disables Dropdown and Delete Icon when disabled prop is true', () => {
  render(<Language output="Some output text"
    languageCode="eng" index={1} disabled={true} onChange={() => { }} onDelete={() => { }} />);

  expect(screen.getByLabelText('Output')).toBeDisabled();
  expect(screen.getByLabelText('Delete')).toBeDisabled();
});
