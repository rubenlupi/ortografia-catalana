import { useState, useEffect } from 'react';

interface ShowWrongWordsProps {
  onBack: () => void;
  boxId: string;
  onUpdateWrongWords: (updatedWrongWords: string[]) => void;
}

const ShowWrongWords: React.FC<ShowWrongWordsProps> = ({ onBack, boxId, onUpdateWrongWords }) => {
  const [wrongWords, setWrongWords] = useState<string[]>([]);
  const [copyMessage, setCopyMessage] = useState<string>('');

  useEffect(() => {
    const storedWrongWords = JSON.parse(localStorage.getItem(`wrongWords-${boxId}`) || '[]');
    setWrongWords(storedWrongWords);
  }, [boxId]);

  const handleDeleteWord = (word: string) => {
    const updatedWrongWords = wrongWords.filter(w => w !== word);
    setWrongWords(updatedWrongWords);
    localStorage.setItem(`wrongWords-${boxId}`, JSON.stringify(updatedWrongWords));
    onUpdateWrongWords(updatedWrongWords);
  };

  const handleClearWrongWords = () => {
    setWrongWords([]);
    localStorage.removeItem(`wrongWords-${boxId}`);
    onUpdateWrongWords([]);
  };

  const handleCopyPrompt = () => {
    const prompt = `Compose a dictation in Catalan containing approximately 45 words. The dictation must include the following incorrect words: ${wrongWords.join(', ')}. Use them in meaningful sentences, ensuring they fit naturally into the context.`;
    navigator.clipboard.writeText(prompt).then(() => {
      setCopyMessage('Prompt copiat!');
      setTimeout(() => setCopyMessage(''), 3000);
    });
  };

  return (
    <div>
      <div>
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-gray-500 text-white rounded">Tornar al WordPicker</button>
        <button onClick={handleClearWrongWords} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded">Esborrar totes les paraules incorrectes</button>
      </div>
      <div className="flex flex-col items-center mt-12">
        <p className="text-center text-sm text-gray-300 mb-4">
          Després de practicar, aquestes són les paraules que has escrit incorrectament.
        </p>
        <p className="text-center text-sm text-gray-300 mb-4">
          Les paraules s'esborraran automàticament quan les encertis més de 3 vegades.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {wrongWords.map((word, index) => (
            <div key={index} className="p-4 bg-red-500 text-white text-xl rounded-lg flex justify-between items-center">
              {word}
              <button onClick={() => handleDeleteWord(word)} className="ml-4 p-2 bg-gray-700 text-white rounded">Eliminar</button>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-300 mt-12">
          Fes clic per copiar un text que pots utilitzar per generar una dictat amb les paraules incorrectes.
        </p>
        <button onClick={handleCopyPrompt} className="mt-8 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Genera Prompt</button>
        {copyMessage && <p className="mt-4 text-center text-green-500">{copyMessage}</p>}
      </div>
    </div>
  );
};

export default ShowWrongWords;
