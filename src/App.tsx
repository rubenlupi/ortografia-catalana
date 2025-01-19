import './App.css'
import { useState } from 'react'
import WordPicker from './components/WordPicker/WordPicker'
import bVWords from '../jsonWords/b-v.json'

function App() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const boxes = [
    { id: "b-v", title: "La b i la v" },
    { id: "m-n", title: "La m i la n" },
    { id: "esses", title: "Les esses: s, ss, c, ç, z" },
    { id: "h", title: "La h" },
    { id: "g-j", title: "La g i la j" },
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
  ]

  const handleBoxClick = (boxId: string) => {
    setSelectedBox(boxId);
  }

  const handleBack = () => {
    setSelectedBox(null);
  }

  return (
    <>
      {selectedBox ? (
        <WordPicker words={bVWords.words} rules={bVWords.rules} onBack={handleBack} boxId={selectedBox} boxes={boxes} links={bVWords.links} />
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-6xl font-bold text-center my-4">Ortografia Catalana</h1>
          <p className="text-center text-sm text-gray-300 mb-4">
            Escull una caixa per començar a practicar.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-8">
            {boxes.map((box) => (
              <div
                key={box.id}
                className={`p-4 text-xl rounded-lg cursor-pointer ${box.id === "b-v" ? "bg-blue-500 text-white hover:bg-blue-700" : "bg-blue-950 text-blue-200 cursor-not-allowed"}`}
                onClick={() => box.id === "b-v" && handleBoxClick(box.id)}
              >
                {box.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default App


