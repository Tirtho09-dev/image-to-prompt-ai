
import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import { generatePromptFromImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import PromptDisplay from './components/PromptDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setAppState(AppState.UPLOADING);
    setError(null);
    setUploadedImage(URL.createObjectURL(file));

    try {
      setAppState(AppState.GENERATING);
      const prompt = await generatePromptFromImage(file);
      setGeneratedPrompt(prompt);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setUploadedImage(null);
    setGeneratedPrompt('');
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.GENERATING:
        return (
          <div className="flex flex-col items-center gap-4 text-center">
             <img src={uploadedImage!} alt="Uploaded preview" className="max-h-64 rounded-xl shadow-lg animate-pulse" />
             <Spinner />
             <p className="text-gray-300 font-semibold animate-pulse">AI is thinking...</p>
          </div>
        );
      case AppState.SUCCESS:
        return (
          <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="w-full lg:w-1/2 flex-shrink-0">
                <img src={uploadedImage!} alt="Uploaded content" className="w-full rounded-2xl shadow-2xl shadow-indigo-900/40" />
            </div>
            <div className="w-full lg:w-1/2">
                <PromptDisplay prompt={generatedPrompt} />
            </div>
          </div>
        );
      case AppState.ERROR:
        return (
          <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-2xl">
              <h3 className="text-xl font-bold text-red-400">Oops! Something went wrong.</h3>
              <p className="mt-2 text-red-300">{error}</p>
          </div>
        );
      case AppState.IDLE:
      case AppState.UPLOADING:
      default:
        return <ImageUploader onImageUpload={handleImageUpload} disabled={appState !== AppState.IDLE} />;
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-gray-900 to-gray-900 z-0"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <main className="z-10 w-full flex flex-col items-center justify-center flex-grow transition-all duration-500">
        <header className="text-center mb-8 transform transition-transform duration-500 hover:scale-105">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Image to Prompt AI
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
            Transform your visuals into words. Upload an image and let our AI craft the perfect descriptive prompt.
          </p>
        </header>

        <div className="w-full flex items-center justify-center p-4 transition-opacity duration-500 ease-in-out">
          {renderContent()}
        </div>

        {(appState === AppState.SUCCESS || appState === AppState.ERROR) && (
          <div className="mt-8">
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 shadow-lg"
            >
              {appState === AppState.ERROR ? 'Try Again' : 'Start Over'}
            </button>
          </div>
        )}
      </main>

      <footer className="z-10 text-center text-gray-500 text-sm py-4">
        <p>Powered by Gemini</p>
      </footer>
       <style jsx="true">{`
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-4000 {
            animation-delay: -4s;
        }
    `}</style>
    </div>
  );
};

export default App;
