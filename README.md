# AI Thumbnail Editor

A modern web application for editing photos with natural language using Google's Gemini 2.5 Flash Image model (Nano Banana). Specifically designed for creating professional YouTube thumbnails with multi-turn editing capabilities.

## Features

- **Natural Language Editing**: Describe changes in plain English and watch AI transform your images
- **Multi-turn Workflow**: Make multiple edits step-by-step to perfect your thumbnail
- **YouTube Optimization**: Built-in suggestions and formatting for YouTube thumbnail best practices
- **Edit History**: Track and revert to any previous version of your image
- **Drag & Drop Upload**: Easy image upload with support for JPG, PNG, and GIF formats
- **Instant Download**: Download your finished thumbnails in high quality

## Tech Stack

- **Frontend**: Next.js 15 with React 18
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash Image (Nano Banana) via fal.ai
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

1. Node.js 18+ installed on your system
2. A fal.ai API key (get one at [fal.ai](https://fal.ai/))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` and add your fal.ai API key:
```env
FAL_KEY=your_actual_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Upload Your Photo**: Drag and drop or click to browse and select your image
2. **Describe Your Edit**: Type what you want to change in natural language (e.g., "Make the colors more vibrant and add bold text")
3. **Apply Changes**: Click "Edit Thumbnail" and wait for the AI to process
4. **Iterate**: Continue making edits to refine your thumbnail
5. **Download**: Save your final thumbnail when you're satisfied

### Example Prompts

- "Make the colors more vibrant and add bold text overlay"
- "Add dramatic lighting and shadow effects"
- "Create a split-screen comparison layout"
- "Add glowing neon effects and futuristic elements"
- "Make it look like a movie poster with dramatic composition"
- "Add explosion effects and dynamic action elements"

## API Reference

The app uses Google's Gemini 2.5 Flash Image model (Nano Banana) through fal.ai. Key details:

- **Model**: `fal-ai/gemini-25-flash-image`
- **Pricing**: Pay-per-use via fal.ai unified billing
- **Capabilities**: Text-to-image, image editing, style transfer
- **Benefits**: Unified API access to multiple models, better rate limits

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-image/
│   │       └── route.ts          # fal.ai API integration
│   ├── globals.css               # Global styles
│   └── page.tsx                  # Main application page
└── components/
    ├── ImageUpload.tsx           # File upload component
    ├── EditingInterface.tsx      # Main editing UI
    └── EditHistory.tsx           # Edit history sidebar
```

## Environment Variables

- `FAL_KEY` - Your fal.ai API key (required)

## Deployment

This app can be deployed on Vercel, Netlify, or any platform that supports Next.js. Make sure to set your environment variables in your deployment platform.

## License

This project is licensed under the MIT License.
