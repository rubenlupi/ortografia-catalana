import { useState, useEffect } from 'react';

interface ShowWrongWordsProps {
  onBack: () => void;
  boxId: string;
  onUpdateWrongWords: (updatedWrongWords: string[]) => void;
}

const ShowWrongWords: React.FC<ShowWrongWordsProps> = ({ onBack, boxId, onUpdateWrongWords }) => {
  const [wrongWords, setWrongWords] = useState<string[]>([]);

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

  return (
    <div className="flex flex-col items-center">
      <p className="text-center text-sm text-gray-300 mb-4">
        Després de practicar, aquestes són les paraules que has escrit incorrectament.
      </p>
      <p className="text-center text-sm text-gray-300 mb-4">
        Les paraules s'esborraran automàticament quan les encertis més de 3 vegades.
      </p>
      <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-gray-500 text-white rounded">Tornar al WordPicker</button>
      <button onClick={handleClearWrongWords} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded">Esborrar totes les paraules incorrectes</button>
      <div className="mt-16 grid grid-cols-3 gap-8">
        {wrongWords.map((word, index) => (
          <div key={index} className="p-4 bg-red-500 text-white text-xl rounded-lg flex justify-between items-center">
            {word}
            <button onClick={() => handleDeleteWord(word)} className="ml-4 p-2 bg-gray-700 text-white rounded">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowWrongWords;
