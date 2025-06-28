# SDG Platform Setup

## Gemini AI Integration

To use the AI-powered chat functionality, you need to set up the Gemini API:

### 1. Get Your Gemini API Key

**Step-by-step process:**

1. **Visit Google AI Studio**: Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. **Sign in**: Use your Google account to sign in
3. **Create API Key**: Click "Create API Key" button
4. **Choose Project**: Select an existing Google Cloud project or create a new one
5. **Copy the Key**: Copy the generated API key (it starts with "AIza...")

**Important Notes:**
- Keep your API key secure and never commit it to version control
- The API key is free to use with generous quotas for testing
- If you get quota errors, check your usage at [Google AI Studio](https://makersuite.google.com/)

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory of your project:

```bash
# Create the file
touch .env.local
```

Add your API key to the file:
```env
GEMINI_API_KEY=AIza...your_actual_api_key_here
```

**Example `.env.local` file:**
```env
# Gemini API Configuration
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Note: Replace the above with your actual API key from Google AI Studio
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Test the Integration

1. Navigate to `http://localhost:3000/chat`
2. Try asking a question about the SDGs
3. You should receive dynamic AI-generated responses

## Troubleshooting

### Common Issues:

**❌ "API key expired" error:**
- Get a new API key from Google AI Studio
- Replace the old key in your `.env.local` file
- Restart your development server

**❌ "API key not configured" error:**
- Make sure `.env.local` exists in your project root
- Check that `GEMINI_API_KEY` is spelled correctly
- Restart your development server after adding the key

**❌ "Quota exceeded" error:**
- Check your API usage at Google AI Studio
- Wait for the quota to reset (usually daily)
- Consider upgrading your Google Cloud project if needed

**❌ "Failed to generate response" error:**
- Check your internet connection
- Verify your API key is valid
- Check the browser console for detailed error messages

## Features
- ✨ Modern, minimal chat interface
- 🤖 AI-powered responses using Google Gemini
- 📱 Responsive design
- 🎨 Beautiful animations and transitions
- 🚀 Real-time chat experience
- 🛡️ Comprehensive error handling

The chat page is located at `/chat` and provides an intuitive interface for learning about the Sustainable Development Goals. 