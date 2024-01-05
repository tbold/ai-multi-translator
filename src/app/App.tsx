'use client'
import { useEffect, useRef, useState } from 'react'
import Dropdown from '../components/Dropdown';
import ProgressBar from '../components/ProgressBar';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import { OutputLanguage } from '../structs';

function App() {

  // Model loading
  const [ready, setReady] = useState<boolean | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState<any[]>([]);

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
          console.log(e.data);
          outputCopy[e.data.result.index] = e.data.result.output;
          setOutput(outputCopy);
          break;

        case 'complete':
          // Generation complete: re-enable the "Translate" button
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
    outputLanguages.forEach((x, index) => {
      worker.current!.postMessage({
        index,
        text: input,
        src_lang: sourceLanguage,
        tgt_lang: x.languageCode,
      });
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
  }

  function updateTargetLanguage(index: number, languageCode: string) {
    const languagesCopy = [...outputLanguages];
    var newLanguage = new OutputLanguage(languageCode);
    languagesCopy[index] = newLanguage;
    setOutputLanguages(languagesCopy)
  }

  function buildOutputLanguages(): React.JSX.Element[] {
    return outputLanguages.map((x, index) => {
      return <div key={index}>
        <Box sx={{ p: 1 }} />
        <Dropdown
          key={index}
          label="Output language"
          languageCode={x.languageCode} defaultLanguage="fra_Latn" onChange={y => updateTargetLanguage(index, y.target.value)} />
        <TextField value={output[index]} rows={3} InputProps={{
          readOnly: true,
        }}></TextField>
        {index != 0 &&
          (<IconButton onClick={() => deleteLanguage(index)}>
            <DeleteIcon />
          </IconButton>
          )}
      </div>
    })

  }

  return (
    <>
      <h2 >Multi-translator</h2>
      <div>
        <Dropdown
          label="Source language"
          languageCode={sourceLanguage} defaultLanguage="eng_Latn" onChange={x => setSourceLanguage(x.target.value)} />
        <TextField value={input} rows={3} onChange={e => setInput(e.target.value)}></TextField>
      </div>
      {buildOutputLanguages()}
      <Box sx={{ p: 1 }} />

      <div>
        <Button
          variant='outlined'
          onClick={addLanguage}
          disabled={disabled}>
          Add language
        </Button>
      </div>
      <Box sx={{ p: 1 }} />

      <Button variant='contained' disabled={disabled} onClick={translate}>Translate</Button>

      <div className='progress-bars-container'>
        {ready === false && (
          <label>Loading models... (only run once)</label>
        )}
        {progressItems.map((data, index) => (
          <ProgressBar key={index} text={data.file} percentage={data.progress} />
        ))}
      </div>
    </>
  )
}

export default App