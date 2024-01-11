import React from "react";
import { LANGUAGES } from "../constants";
import { InputLabel, Select, SelectChangeEvent, FormControl, MenuItem } from "@mui/material";

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
    <FormControl >
      <InputLabel>{label}</InputLabel>
      <Select onChange={(event) => onChange(event.target.value)}
        label={label}
        value={languageCode}
        defaultValue={defaultLanguage}
        disabled={disabled}
        inputProps={{ "data-testid": "select-option" }}
      >
        {LANGUAGES.map((value, index) =>
          <MenuItem key={index} value={value.languageCode} > {value.friendlyName} </MenuItem>
        )}
      </Select>
    </FormControl>

  );
}