import { useState, useEffect } from 'react';
import ShowWrongWords from './ShowWrongWords';
import ShowLearntWords from './ShowLearntWords';
import ShowRules from './ShowRules';

export interface Word {
  word: string;
  wrongVariants: string[];
  level: number;
  rule: number;
  sentence: string;
  meaning: string;
}

export interface Rule {
  id: number;
  message: string;
  rule: string;
  ex: string;
}

export interface Box {
  id: string;
  title: string;
}

export interface Link {
  title: string;
  description: string;
  url: string;
}

interface WordPickerProps {
  words: Word[];
  rules: Rule[];
  links: Link[];
  onBack: () => void;
  boxId: string;
  boxes: Box[];
}

const WordPicker: React.FC<WordPickerProps> = ({ words, rules, links, onBack, boxId, boxes }) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [ruleMessage, setRuleMessage] = useState<string>('');
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [wrongWords, setWrongWords] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState<{ [key: string]: number }>({});
  const [showWrongWords, setShowWrongWords] = useState<boolean>(false);
  const [showLearntWords, setShowLearntWords] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [correctWords, setCorrectWords] = useState<string[]>([]);

  const boxTitle = boxes.find(box => box.id === boxId)?.title || '';

  useEffect(() => {
    if (words.length > 0) {
      const filteredWords = selectedLevel === 0 ? words : words.filter(word => word.level === selectedLevel);
      const weightedWords = filteredWords.flatMap(word => wrongWords.includes(word.word) ? [word, word, word] : [word]);
      const randomWordObj = weightedWords[Math.floor(Math.random() * weightedWords.length)];
      const allWords = [randomWordObj.word, ...randomWordObj.wrongVariants].sort(() => 0.5 - Math.random());
      setDisplayedWords(allWords.slice(0, 3));
      setCurrentWord(randomWordObj);
    }
  }, [words, selectedLevel]);

  useEffect(() => {
    const storedWrongWords = JSON.parse(localStorage.getItem(`wrongWords-${boxId}`) || '[]');
    setWrongWords(storedWrongWords);
    const storedCorrectCount = JSON.parse(localStorage.getItem(`correctCount-${boxId}`) || '{}');
    setCorrectCount(storedCorrectCount);
    const storedCorrectWords = JSON.parse(localStorage.getItem(`learntWords-${boxId}`) || '[]');
    setCorrectWords(storedCorrectWords);
  }, [boxId]);

  const updateWrongWords = (word: string) => {
    const updatedWrongWords = [...wrongWords, word];
    const uniqueWrongWords = Array.from(new Set(updatedWrongWords));
    setWrongWords(uniqueWrongWords);
    localStorage.setItem(`wrongWords-${boxId}`, JSON.stringify(uniqueWrongWords));
  };

  const updateCorrectWords = (word: string) => {
    const updatedCorrectWords = [...correctWords, word];
    const uniqueCorrectWords = Array.from(new Set(updatedCorrectWords));
    setCorrectWords(uniqueCorrectWords);
    localStorage.setItem(`learntWords-${boxId}`, JSON.stringify(uniqueCorrectWords));
  }

  const updateCorrectCount = (word: string) => {
    const newCorrectCount = { ...correctCount, [word]: (correctCount[word] || 0) + 1 };
    setCorrectCount(newCorrectCount);
    localStorage.setItem(`correctCount-${boxId}`, JSON.stringify(newCorrectCount));
    return newCorrectCount;
  };

  const removeWordFromWrongWords = (word: string) => {
    const updatedWrongWords = wrongWords.filter(w => w !== word);
    setWrongWords(updatedWrongWords);
    localStorage.setItem(`wrongWords-${boxId}`, JSON.stringify(updatedWrongWords));
  };

  const addWordToLearntWords = (word: string) => {
    const storedLearntWords = JSON.parse(localStorage.getItem(`learntWords-${boxId}`) || '[]');
    const updatedLearntWords = [...storedLearntWords, word];
    localStorage.setItem(`learntWords-${boxId}`, JSON.stringify(updatedLearntWords));
  };

  const selectNewWord = () => {
    const filteredWords = selectedLevel === 0 ? words : words.filter(word => word.level === selectedLevel);
    const weightedWords = filteredWords.flatMap(word => wrongWords.includes(word.word) ? [word, word, word] : [word]);
    const randomWordObj = weightedWords[Math.floor(Math.random() * weightedWords.length)];
    const allWords = [randomWordObj.word, ...randomWordObj.wrongVariants].sort(() => 0.5 - Math.random());
    setDisplayedWords(allWords.slice(0, 3));
    setCurrentWord(randomWordObj);
  };

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    if (currentWord && word === currentWord.word) {
      setFeedback('Correcta!');
      setRuleMessage('');
      const newCorrectCount = updateCorrectCount(currentWord.word);
      if (newCorrectCount[currentWord.word] > 4) {
        removeWordFromWrongWords(currentWord.word);
        addWordToLearntWords(currentWord.word);
        delete newCorrectCount[currentWord.word];
        localStorage.setItem(`correctCount-${boxId}`, JSON.stringify(newCorrectCount));
      }
      updateCorrectWords(currentWord.word);
      setTimeout(() => {
        setFeedback('');
        setSelectedWord(null);
        selectNewWord();
      }, 2000);
    } else {
      const ruleMessage = currentWord?.rule === -1 ? "No hi ha regles ortogràfiques per aquesta paraula" : rules.find(rule => rule.id === currentWord?.rule)?.message;
      setFeedback(`Ups, t'has equivocat! Provem amb una altra paraula.`);
      setRuleMessage(ruleMessage || '');
      if (currentWord) {
        updateWrongWords(currentWord.word);
      }
      setTimeout(() => {
        setSelectedWord(null);
      }, 2000); // Reset the feedback and selected word after 2 seconds
    }
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(Number(event.target.value));
    setSelectedWord(null);
    setFeedback('');
    setRuleMessage('');
  };

  const handleViewWrongWords = () => {
    setShowWrongWords(true);
  };

  const handleViewLearntWords = () => {
    setShowLearntWords(true);
  };

  const handleViewRules = () => {
    setShowRules(true);
  };

  const handleUpdateWrongWords = (updatedWrongWords: string[]) => {
    setWrongWords(updatedWrongWords);
  };

  return (
    <>
      {showWrongWords ? (
        <ShowWrongWords onBack={() => setShowWrongWords(false)} boxId={boxId} onUpdateWrongWords={handleUpdateWrongWords} />
      ) : showLearntWords ? (
        <ShowLearntWords onBack={() => setShowLearntWords(false)} boxId={boxId} onUpdateLearntWords={setCorrectWords} />
      ) : showRules ? (
        <ShowRules onBack={() => setShowRules(false)} rules={rules} />
      ) : (
        <div>
          <div>
            <div className="absolute top-4 left-4">
              <button onClick={onBack} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Tornar al menú principal</button>
            </div>
            <div className="absolute top-4 right-4">
              <select id="level" value={selectedLevel} onChange={handleLevelChange} className="p-2 border rounded">
                <option value={0}>Tots el nivells</option>
                {[1, 2, 3].map(level => (
                  <option key={level} value={level}>Nivell {level}</option>
                ))}
              </select>

            </div>
          </div>
          <h1 className="text-4xl font-bold text-center my-4">{boxTitle}</h1>
          <div className="mt-4 mb-8">
            <button onClick={handleViewRules} className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600">Veure regles ortogràfiques</button>
          </div>
          <div className="flex flex-wrap justify-center items-center ">
            <button onClick={handleViewWrongWords} className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 m-2">Veure paraules incorrectes - {wrongWords.length}</button>
            <button onClick={handleViewLearntWords} className="p-2 bg-green-500 text-black rounded hover:bg-green-600 m-2">Veure paraules apreses - {correctWords.length}</button>
          </div>
          <p className="text-center text-sm text-gray-400 mt-12">
            Tria la paraula correcta.
          </p>
          <div className="flex flex-wrap justify-center items-center mb-6">
            {displayedWords.map((word, index) => (

              <button
                key={index}
                onClick={() => handleWordClick(word)}
                className={`p-12 rounded-lg cursor-pointer text-xl ${selectedWord === word
                  ? word === currentWord?.word
                    ? 'bg-green-500 text-white hover:bg-green-500'
                    : 'bg-red-500 text-white hover:bg-red-500'
                  : 'bg-blue-500 text-white hover:bg-blue-700'
                  } align-middle m-4`}
              >
                {word}
              </button>

            ))}
          </div>
          <p className="text-center  text-gray-300">
            {currentWord?.sentence}
          </p>
          <p className="text-center text-sm text-gray-400 mt-4">
            {currentWord?.meaning}
          </p>
          <p className="mt-4 text-center text-xl">{feedback}</p>
          {ruleMessage && <p className="mt-4 text-center text-gray-400">{ruleMessage}</p>}
          <div className="flex flex-col items-center mt-8 space-y-4">
            {links.map((link, index) => (
              <button key={index} onClick={() => window.open(link.url, '_blank')} className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                <p>{link.title}</p>
                {link.description && <p className="text-sm text-gray-300">{link.description}</p>}
              </button>
            ))}
          </div>
        </div >
      )}
    </>
  );
}

export default WordPicker;