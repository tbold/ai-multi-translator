'use client'
import { useEffect, useRef, useState } from 'react'
import Dropdown from '../components/Dropdown';
import ProgressBar from '../components/ProgressBar';
import React from 'react';
import { TextField } from '@mui/material';
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
    return outputLanguages.map((lang, index) => (
      <div key={index} className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20 animate-scale-in">
        <Language 
          languageCode={lang.languageCode} 
          index={index} 
          disabled={disabled} 
          onDelete={deleteLanguage} 
          onChange={updateTargetLanguage} 
          output={output[index] ?? ''} 
        />
      </div>
    ))
  }

  return (
    <div className="min-h-screen p-4 md:p-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card rounded-3xl shadow-glass overflow-hidden animate-slide-up">
          <div className="px-6 py-8 md:px-12 md:py-12 bg-gradient-to-r from-white/10 to-white/5">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-modern">
                  <TranslateIcon className="text-white" style={{ fontSize: '2.5rem' }} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                  AI Multi-Translator
                </h1>
              </div>
              
              <div className="max-w-3xl mx-auto space-y-3 text-neutral-600">
                <p className="text-lg md:text-xl leading-relaxed">
                  Experience powerful AI translation supporting 200+ languages with complete privacy
                </p>
                <p className="text-base opacity-80">
                  Built with cutting-edge machine learning models that run entirely in your browser
                </p>
                <p className="text-sm opacity-70">
                  No data leaves your device • No API keys required • Completely offline-capable
                </p>
              </div>
              
              <a 
                href="https://github.com/tbold/ai-multi-translator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-glow"
              >
                <GitHubIcon className="text-neutral-700" />
                <span className="text-neutral-700 font-medium">View Source Code</span>
              </a>
            </div>
          </div>

          <div className="px-6 md:px-12 pb-8">
            <div className="mb-8">
              <div className="bg-white/30 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Dropdown
                      disabled={disabled}
                      label="Source language"
                      languageCode={sourceLanguage} 
                      defaultLanguage="eng_Latn" 
                      onChange={(x: string) => setSourceLanguage(x)} 
                    />
                  </div>
                  <div className="flex-grow">
                    <TextField 
                      fullWidth 
                      disabled={disabled} 
                      value={input} 
                      multiline 
                      rows={4}
                      placeholder="Enter text to translate..."
                      onChange={(e: any) => setInput(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          borderRadius: '12px',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {
               buildOutputLanguages()
              }
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <button
                onClick={addLanguage}
                disabled={disabled}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 rounded-xl font-medium text-neutral-700 transition-all duration-300 hover:scale-105 hover:shadow-glow border border-white/20"
              >
                + Add Language
              </button>
              <button
                onClick={translate}
                disabled={disabled}
                className="px-8 py-3 bg-gradient-modern hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-modern"
              >
                {disabled ? 'Translating...' : 'Translate'}
              </button>
            </div>

            {(ready === false || progressItems.length > 0) && (
              <div className="text-center space-y-6 py-8">
                <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                  {ready === false && (
                    <p className="text-lg font-medium text-neutral-700 mb-4">
                      Loading AI models... (this only happens once)
                    </p>
                  )}
                  <div className="space-y-4">
                    {progressItems.map((data, index) => (
                      <div key={index} className="animate-slide-up">
                        <ProgressBar text={data.file} percentage={data.progress} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App