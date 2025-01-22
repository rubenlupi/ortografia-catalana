import { useEffect, useState } from 'react';
import ShowWrongWords from './ShowWrongWords';
import ShowLearntWords from './ShowLearntWords';

interface Box {
  id: string;
  title: string;
}

interface WordSummaryProps {
  boxes: Box[];
  onBack: () => void;
}

const WordSummary: React.FC<WordSummaryProps> = ({ boxes, onBack }) => {
  const [summary, setSummary] = useState<{ [key: string]: { correct: number; wrong: number } }>({});
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [showWrongWords, setShowWrongWords] = useState<boolean>(false);
  const [showLearntWords, setShowLearntWords] = useState<boolean>(false);
  const [confirmationText, setConfirmationText] = useState<string>('');
  const [showConfirmationPopup, setShowConfirmationPopup] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const newSummary: { [key: string]: { correct: number; wrong: number } } = {};
    boxes.forEach(box => {
      const correctWords = JSON.parse(localStorage.getItem(`learntWords-${box.id}`) || '[]').length;
      const wrongWords = JSON.parse(localStorage.getItem(`wrongWords-${box.id}`) || '[]').length;
      newSummary[box.id] = { correct: correctWords, wrong: wrongWords };
    });
    setSummary(newSummary);
  }, [boxes]);

  const handleClearAll = () => {
    if (confirmationText.toLowerCase() === 'esborra') {
      boxes.forEach(box => {
        localStorage.removeItem(`learntWords-${box.id}`);
        localStorage.removeItem(`wrongWords-${box.id}`);
      });
      setSummary({});
      setConfirmationText('');
      setShowConfirmationPopup(false);
      setErrorMessage('');
    } else {
      setErrorMessage('Escriu "esborra" per confirmar.');
    }
  };

  const handleViewWrongWords = (boxId: string) => {
    setSelectedBox(boxId);
    setShowWrongWords(true);
  };

  const handleViewLearntWords = (boxId: string) => {
    setSelectedBox(boxId);
    setShowLearntWords(true);
  };

  return (
    <>
      {showWrongWords ? (
        <ShowWrongWords onBack={() => setShowWrongWords(false)} boxId={selectedBox!} />
      ) : showLearntWords ? (
        <ShowLearntWords onBack={() => setShowLearntWords(false)} boxId={selectedBox!} onUpdateLearntWords={() => { }} />
      ) : (
        <div className="flex flex-col items-center">
          <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-gray-500 text-white rounded">Tornar al menú principal</button>
          <h1 className="text-4xl font-bold text-center my-4">Resum de Paraules</h1>
          <div className="absolute top-4 right-4 flex items-center">
            <button onClick={() => setShowConfirmationPopup(true)} className="p-2 bg-red-500 text-white rounded">Esborrar tots els resultats</button>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {boxes.map(box => (
              <div key={box.id} className="p-4 bg-gray-800 text-white text-xl rounded-lg">
                <p className="font-bold">{box.title}</p>
                <p className="text-gray-400">Correctes: {summary[box.id]?.correct || 0}</p>
                <p className="text-gray-400">Incorrectes: {summary[box.id]?.wrong || 0}</p>
                <button onClick={() => handleViewWrongWords(box.id)} className="mt-2 p-1 bg-yellow-500 text-black rounded hover:bg-yellow-600 text-sm mr-2">Veure paraules incorrectes</button>
                <button onClick={() => handleViewLearntWords(box.id)} className="mt-2 p-1 bg-green-500 text-black rounded hover:bg-green-600 text-sm">Veure paraules apreses</button>
              </div>
            ))}
          </div>
          {showConfirmationPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
              <div className="bg-black p-4 rounded-lg">
                <p className="text-center mb-4">Escriu "esborra" per poder eliminar totes les dades</p>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Escriu 'esborra' per confirmar"
                  className="p-2 border rounded mb-4 w-full"
                />
                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                <div className="flex justify-between">
                  <button onClick={handleClearAll} className="p-2 bg-red-500 text-white rounded">OK</button>
                  <button onClick={() => setShowConfirmationPopup(false)} className="p-2 bg-gray-500 text-white rounded">Cancel·lar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default WordSummary;
