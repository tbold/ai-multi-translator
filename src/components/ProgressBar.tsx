import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

interface ProgressBarProps {
  text: string;
  percentage: number;
}

export default function ProgressBar({ text, percentage }: ProgressBarProps) {
  percentage = percentage ?? 0;
  return (
    <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
      <div className="flex-shrink-0">
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress 
            variant="determinate" 
            value={percentage} 
            size={60}
            sx={{
              color: '#3b82f6',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              className="text-neutral-700 font-semibold"
            >{`${Math.round(percentage)}%`}</Typography>
          </Box>
        </Box>
      </div>
      
      <div className="flex-grow">
        <Typography className="text-neutral-700 font-medium text-sm">
          {text}
        </Typography>
        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}