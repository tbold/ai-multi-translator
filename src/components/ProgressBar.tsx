import { Box, LinearProgress, Typography } from "@mui/material";
import React from "react";

interface ProgressBarProps {
  text: string;
  percentage: number;
}

export default function ProgressBar({ text, percentage }: ProgressBarProps) {
  percentage = percentage ?? 0;
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" value={percentage} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            percentage
          )}%`}</Typography>
        </Box>
      </Box>
    </>
  );
}