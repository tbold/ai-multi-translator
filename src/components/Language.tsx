import { TextField, IconButton } from "@mui/material";
import React from "react";
import Dropdown from "./Dropdown";
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

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
  
  const copyToClipboard = async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      <div className="flex-shrink-0">
        <Dropdown
          disabled={disabled}
          label="Target Language"
          languageCode={languageCode} 
          defaultLanguage="fra_Latn" 
          onChange={(y: string) => onChange(index, y)} 
        />
      </div>
      
      <div className="flex-grow relative">
        <TextField 
          multiline 
          fullWidth 
          value={output} 
          placeholder="Translation will appear here..."
          rows={4}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }
            }
          }}
        />
        
        {output && (
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 bg-white/60 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110"
            title="Copy to clipboard"
          >
            <ContentCopyIcon className="text-neutral-600" fontSize="small" />
          </button>
        )}
      </div>
      
      <div className="flex-shrink-0 flex items-center">
        {index !== 0 && (
          <button
            disabled={disabled}
            onClick={() => onDelete(index)}
            className="p-3 bg-red-50 hover:bg-red-100 disabled:bg-gray-100 disabled:opacity-50 rounded-xl transition-all duration-200 hover:scale-105 group"
            title="Remove language"
          >
            <DeleteIcon className="text-red-500 group-hover:text-red-600 disabled:text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
}