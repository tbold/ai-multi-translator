import { LinearProgress } from "@mui/material";
import React from "react";

interface ProgressBarProps {
  text: string;
  percentage: number;
}

export default function ProgressBar({ text, percentage }: ProgressBarProps) {
  percentage = percentage ?? 0;
  return (
    <LinearProgress variant="determinate" value={percentage} />
  );
}