'use client'
import { useEffect, useRef, useState } from 'react'
import Dropdown from '../components/Dropdown';
import ProgressBar from '../components/ProgressBar';
import React from 'react';
import { Box, Button, Divider, Grid, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { OutputLanguage } from '../structs';
import Language from '@/components/Language';
import TranslateIcon from '@mui/icons-material/Translate';
import GitHubIcon from '@mui/icons-material/GitHub';

export function App() {
  // Model loading
  const [ready, setReady] = useState<boolean | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState<any[]>([
  ]);

  // Inputs and outputs
  const [input, setInput] = useState('I love coding.');
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [output, setOutput] = useState<string[]>([]);
  const [outputLanguages, setOutputLanguages] = useState<OutputLanguage[]>([
    new OutputLanguage("fra_Latn")
  ]);

  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: any) => {
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems(prev => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress }
              }
              return item;
            })
          );
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case 'update':
          // Generation update: update the output text.
          const outputCopy = [...output];
          outputCopy[e.data.result.index] = e.data.result.output;
          setOutput(outputCopy);
          break;

        case 'complete':
          const outputCopy2 = [...output];
          e.data.result.forEach((x: any) => {
            outputCopy2[x.index] = x.output;
          })
          setOutput(outputCopy2);
          setDisabled(false);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current!.removeEventListener('message', onMessageReceived);
  });

  const translate = () => {
    setDisabled(true);
    var map = outputLanguages.map((x, index) => {
      return {
        index,
        languageCode: x.languageCode
      }
    });
    worker.current?.postMessage({
      text: input,
      sourceLanguage: sourceLanguage,
      outputLanguages: map
    });
  }

  function addLanguage() {
    setOutputLanguages(
      outputLanguages => [...outputLanguages, new OutputLanguage("eng_Latn")]
    );
  }

  function deleteLanguage(index: number) {
    const languagesCopy = [...outputLanguages];
    languagesCopy.splice(index, 1);
    setOutputLanguages(languagesCopy);
    const outputCopy = [...output];
    outputCopy.splice(index, 1);
    setOutput(outputCopy);
  }

  function updateTargetLanguage(index: number, languageCode: string) {
    const languagesCopy = [...outputLanguages];
    var newLanguage = new OutputLanguage(languageCode);
    languagesCopy[index] = newLanguage;
    setOutputLanguages(languagesCopy)
  }

  function buildOutputLanguages(): React.JSX.Element[] {
    return outputLanguages.map((x, index) => {
      return (
        <Language languageCode={x.languageCode} key={index} index={index} disabled={disabled} onDelete={deleteLanguage} onChange={updateTargetLanguage} output={output[index] ?? ''} />
      )
    })
  }

  return (
    <Paper elevation={3}>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Box sx={{ p: 2 }} alignItems="center">
            <Stack direction="row" spacing={{ p: 1 }}>
              <TranslateIcon color="primary" fontSize='large' />
              <Box sx={{ p: 2 }} />
              <Typography align='center' variant="h4">AI multi-translator</Typography>
            </Stack>
            <Typography variant="body2">Simple translator that uses a pre-trained machine learning model to translate text into multiple languages.</Typography>
            <Typography variant="body2">The model runs in the browser and does not rely on an external AI provider.</Typography>
            <Typography variant="body2">Build with next.js and hosted on Vercel.</Typography>
            <IconButton size="large" href="https://github.com/tbold/ai-multi-translator" target='_blank' style={{ borderRadius: 8 }}>
              <GitHubIcon />
              <Typography variant='caption'>Source code</Typography>
            </IconButton>
          </Box>
          <Grid container direction="row" spacing={1} sx={{ p: 2 }} >
            <Grid item >
              <Dropdown
                disabled={disabled}
                label="Source language"
                languageCode={sourceLanguage} defaultLanguage="eng_Latn" onChange={(x: string) => setSourceLanguage(x)} />
            </Grid>
            <Grid item width="70%">
              <TextField fullWidth disabled={disabled} value={input} multiline onChange={(e: any) => setInput(e.target.value)}></TextField>
            </Grid>
          </Grid>
          <Divider />
          {buildOutputLanguages()}
          <Divider />
          <Grid container direction="row" spacing={1} sx={{ p: 2 }}>
            <Grid item>
              <Button
                variant='outlined'
                onClick={addLanguage}
                disabled={disabled}>
                Add language
              </Button>
            </Grid>
            <Grid item>
              <Button variant='contained' disabled={disabled} onClick={translate}>Translate</Button>
            </Grid>
          </Grid>
          <Grid container direction="column" spacing={1} sx={{ p: 2 }} alignItems="center">
            {ready == false && <Grid item>
              <Typography>Loading models... (only run once)</Typography>
            </Grid>}
            {progressItems.map((data, index) => (
              <Grid item key={index} sx={{ p: 1 }} >
                <ProgressBar text={data.file} percentage={data.progress} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </Paper >
  )
}

export default App