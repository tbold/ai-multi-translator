import React from "react";
import { LANGUAGES } from "../constants";
import { InputLabel, Select, SelectChangeEvent, FormControl, MenuItem } from "@mui/material";

interface DropdownProps {
  languageCode: string;
  onChange(event: SelectChangeEvent): void;
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
      <Select onChange={onChange}
        label={label}
        value={languageCode}
        defaultValue={defaultLanguage}
        disabled={disabled}
      >
        {LANGUAGES.map((value, index) =>
          <MenuItem key={index} value={value.languageCode} > {value.friendlyName} </MenuItem>
        )}
      </Select>
    </FormControl>

  );
}