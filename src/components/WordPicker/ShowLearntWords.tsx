import { useState, useEffect } from 'react';
import { User } from './WordPicker';

interface ShowLearntWordsProps {
  onBack: () => void;
  boxId: string;
  onUpdateLearntWords: (updatedLearntWords: string[]) => void;
  user: User;
}

const ShowLearntWords: React.FC<ShowLearntWordsProps> = ({ onBack, boxId, onUpdateLearntWords, user }) => {
  const [learntWords, setLearntWords] = useState<string[]>([]);

  useEffect(() => {
    const storedLearntWords = JSON.parse(localStorage.getItem(`learntWords-${user.name}-${boxId}`) || '[]');
    setLearntWords(storedLearntWords);
  }, [boxId, user.name]);

  const handleDeleteWord = (word: string) => {
    const updatedLearntWords = learntWords.filter(w => w !== word);
    setLearntWords(updatedLearntWords);
    localStorage.setItem(`learntWords-${user.name}-${boxId}`, JSON.stringify(updatedLearntWords));
    onUpdateLearntWords(updatedLearntWords);
  };

  const handleClearLearntWords = () => {
    setLearntWords([]);
    localStorage.removeItem(`learntWords-${user.name}-${boxId}`);
    onUpdateLearntWords([]);
  };

  return (
    <div>
      <div>
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-gray-500 text-white rounded">Tornar</button>
        <button onClick={handleClearLearntWords} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded">Esborrar tot</button>
      </div>
      <div className="flex flex-col items-center mt-12">
        <p className="text-center text-sm text-gray-300 mb-4">
          {user.name}, aquestes són les paraules que has après.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {learntWords.map((word, index) => (
            <div key={index} className="p-4 bg-green-500 text-white text-xl rounded-lg flex justify-between items-center">
              {word}
              <button onClick={() => handleDeleteWord(word)} className="ml-4 p-2 bg-gray-700 text-white rounded">Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowLearntWords;
