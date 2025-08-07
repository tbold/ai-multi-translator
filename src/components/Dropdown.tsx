import React from "react";
import { LANGUAGES } from "../constants";
import { InputLabel, Select, FormControl, MenuItem } from "@mui/material";

interface DropdownProps {
  languageCode: string;
  onChange(newLanguage: string): void;
  defaultLanguage: string;
  label: string;
  disabled: boolean;
}

export default function Dropdown({
  languageCode,
  onChange,
  defaultLanguage,
  label,
  disabled
}: DropdownProps) {

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel>{label}</InputLabel>
      <Select 
        onChange={(event) => onChange(event.target.value)}
        label={label}
        value={languageCode}
        defaultValue={defaultLanguage}
        disabled={disabled}
        inputProps={{ "data-testid": "select-option" }}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3b82f6',
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              maxHeight: 300,
              '& .MuiMenuItem-root': {
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.3)',
                  }
                }
              }
            }
          }
        }}
      >
        {LANGUAGES.map((value, index) =>
          <MenuItem key={index} value={value.languageCode}>
            {value.friendlyName}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}