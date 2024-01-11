import { Grid, TextField, IconButton, makeStyles, styled, GridProps } from "@mui/material";
import React from "react";
import Dropdown from "./Dropdown";
import DeleteIcon from '@mui/icons-material/Delete';

interface LanguageProps {
  index: number;
  disabled: boolean;
  onChange: Function;
  onDelete: Function;
  output: string;
  languageCode: string;
}

export default function Language({
  index,
  disabled,
  onChange,
  onDelete,
  output,
  languageCode,
}: LanguageProps) {
  return (
    <Grid container key={index} direction="row" spacing={1} sx={{ p: 2 }}>
      <Grid item >
        <Dropdown
          disabled={disabled}
          key={index}
          label="Output"
          languageCode={languageCode} defaultLanguage="fra_Latn" onChange={(y: string) => onChange(index, y)} />
      </Grid>
      <Grid item width="70%">
        <TextField multiline fullWidth value={output} InputProps={{
          readOnly: true,
        }}></TextField>
      </Grid>
      <Grid item >
        {index != 0 &&
          (<IconButton disabled={disabled} onClick={() => onDelete(index)}>
            <DeleteIcon />
          </IconButton>
          )}
      </Grid>
    </Grid>);
}