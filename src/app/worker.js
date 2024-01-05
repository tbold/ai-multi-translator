import { pipeline } from '@xenova/transformers';

/**
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
class MyTranslationPipeline {
  static task = 'translation';
  static model = 'Xenova/nllb-200-distilled-600M';
  static instance = null;

  static async getInstance(progress_callback) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  // Retrieve the translation pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  let translator = await MyTranslationPipeline.getInstance((x) => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    self.postMessage(x);
  });

  Promise.all(event.data.outputLanguages.map((x) =>
    translator(event.data.text, {
      tgt_lang: x.languageCode,
      src_lang: event.data.sourceLanguage
    })
  )).then(allData => {
    // Send the output back to the main thread
    var output = allData.map(((x, index) => {
      return {
        index,
        output: x[0].translation_text,
      }
    }))
    self.postMessage({
      status: 'complete',
      result: output,
    });
  })
});