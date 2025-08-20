# AI Multi-Translator

> **Experience powerful AI translation supporting 200+ languages with complete privacy**

A modern, sophisticated AI-powered translation app built with Next.js featuring a beautiful glass-morphism UI. It uses pre-trained language models from [Hugging Face](https://huggingface.co/) that run entirely in your browser - no data leaves your device, no API keys required, completely offline-capable.

## Features

- Support for a vast array of languages and writing systems
- All processing happens in the browser - no data transmitted
- Works without internet after initial model download
- No API keys or configuration required

## Live Demo

[**Try it live →**](https://ai-multi-translator.vercel.app/)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Material-UI components
- **AI/ML**: Transformers.js, ONNX models
- **Design**: Glass-morphism, solid color system, modern animations

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
git clone https://github.com/tbold/ai-multi-translator.git

cd ai-multi-translator

npm install

# Start development server
npm run dev
```

### Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

### How It Works

1. **Model Loading**: On first visit, AI models are downloaded and cached in your browser
2. **Local Processing**: All translation happens locally using WebAssembly and ONNX
3. **Multi-Language Support**: Translate text into multiple target languages simultaneously
4. **Privacy First**: No data transmission - everything stays on your device

### Development

```bash
npm run dev

npm run build

# Start production server
npm start
```

### License

This project is open source and available under the [MIT License](LICENSE).

### Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/tbold/ai-multi-translator/issues).

### Show Your Support

Give a ⭐️ if this project helped you!
