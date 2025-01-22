import './App.css'
import { useState } from 'react'
import WordPicker from './components/WordPicker/WordPicker'
import WordSummary from './components/WordPicker/WordSummary'
import bVWords from '../jsonWords/b-v.json'
import aEWords from '../jsonWords/a-e.json'
import oUWords from '../jsonWords/o-u.json'
import type { Word, Rule, Link } from './components/WordPicker/WordPicker'

function App() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const boxes = [
    { id: "b-v", title: "La B i la V" },
    { id: "a-e", title: "La A i la E àtones" },
    { id: "o-u", title: "La O i la U àtones" },
    { id: "m-n", title: "La M i la N" },
    { id: "esses", title: "Les esses: s, ss, c, ç, z" },
    { id: "h", title: "La H" },
    { id: "g-j", title: "La G i la J" },
    { id: "l-l·l", title: "La l i la l·l" },
    { id: "p-b", title: "P/B en posició final" },
    { id: "t-d", title: "T/D en posició final" },
    { id: "c-g", title: "C/G en posició final" },
    { id: "apostrof", title: "L'apòstrof" },
    { id: "guionet", title: "El guionet" },
    { id: "accents", title: "Els accents" },
    { id: "diftongs", title: "Els diftongs" },
    { id: "dieres", title: "La dièresi" },
    { id: "accent", title: "L'accent diacrític" },
  ];

  const activeBoxIds = ["b-v", "a-e", "o-u"];

  const handleBoxClick = (boxId: string) => {
    setSelectedBox(boxId);
  }

  const handleBack = () => {
    setSelectedBox(null);
    setShowSummary(false);
  }

  const getBoxData = (boxId: string) => {
    switch (boxId) {
      case "b-v":
        return bVWords;
      case "a-e":
        return aEWords;
      case "o-u":
        return oUWords;
      default:
        return { words: [] as Word[], rules: [] as Rule[], links: [] as Link[] };
    }
  }

  return (
    <>
      {selectedBox ? (
        <WordPicker
          words={getBoxData(selectedBox).words}
          rules={getBoxData(selectedBox).rules}
          onBack={handleBack}
          boxId={selectedBox}
          boxes={boxes}
          links={getBoxData(selectedBox).links}
        />
      ) : showSummary ? (
        <WordSummary boxes={boxes} onBack={handleBack} />
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-6xl font-bold text-center my-4">Ortografia Catalana</h1>
          <p className="text-center text-sm text-gray-300 mb-4">
            Escull una caixa per començar a practicar.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {boxes.map((box) => (
              <div
                key={box.id}
                className={`p-4 text-xl rounded-lg cursor-pointer ${activeBoxIds.includes(box.id) ? "bg-blue-500 text-white hover:bg-blue-700" : "bg-blue-950 text-blue-200 cursor-not-allowed"}`}
                onClick={() => activeBoxIds.includes(box.id) && handleBoxClick(box.id)}
              >
                {box.title}
              </div>
            ))}
          </div>
          <button onClick={() => setShowSummary(true)} className="mt-8 p-2 bg-gray-500 text-white rounded hover:bg-gray-600">Paraules encertades i fallades</button>
        </div>
      )}
    </>
  )
}

export default App


