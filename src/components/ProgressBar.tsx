import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

interface ProgressBarProps {
  text: string;
  percentage: number;
}

export default function ProgressBar({ text, percentage }: ProgressBarProps) {
  percentage = percentage ?? 0;
  return (
    <>
      <Typography>
        {text}
      </Typography>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>

        <CircularProgress variant="determinate" value={percentage} />
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
            color="text.secondary"
          >{`${Math.round(percentage)}%`}</Typography>
        </Box>
      </Box>
    </>
  );
}