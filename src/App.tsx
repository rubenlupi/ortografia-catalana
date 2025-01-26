import './App.css'
import { useState, useEffect } from 'react'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import WordPicker from './components/WordPicker/WordPicker'
import WordSummary from './components/WordPicker/WordSummary'
import UserProfile from './components/UserProfile/UserProfile'
import bVWords from '../jsonWords/b-v.json'
import aEWords from '../jsonWords/a-e.json'
import oUWords from '../jsonWords/o-u.json'
import mNWords from '../jsonWords/m-n.json'
import sZWords from '../jsonWords/s-ss.json'
import hWords from '../jsonWords/h.json'
import gJWords from '../jsonWords/g-j.json'
import pBWords from '../jsonWords/p-b.json'
import lGeminada from '../jsonWords/l-geminada.json'
import tDWords from '../jsonWords/t-d.json'
import cGWords from '../jsonWords/c-g.json'
import type { Word, Rule, Link } from './components/WordPicker/WordPicker'

interface User {
  name: string;
  avatar: string;
  createdAt: string;
}

function App() {
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [confirmationText, setConfirmationText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  }, []);

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
  };

  const handleUserCreate = (user: User) => {
    const updatedUsers = [...users, { ...user, createdAt: new Date().toLocaleString() }];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleUserChange = () => {
    setCurrentUser(null);
  };

  const handleUserDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteUser = () => {
    if (confirmationText.toLowerCase() === 'esborra') {
      const updatedUsers = users.filter(u => u.name !== userToDelete?.name);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem(`wrongWords-${userToDelete?.name}`);
      localStorage.removeItem(`correctCount-${userToDelete?.name}`);
      localStorage.removeItem(`failCounts-${userToDelete?.name}`);
      localStorage.removeItem(`learntWords-${userToDelete?.name}`);
      setShowDeleteConfirmation(false);
      setConfirmationText('');
      setErrorMessage('');
      toastr.info(`Usuari "${userToDelete?.name}" eliminat.`);
      if (currentUser?.name === userToDelete?.name) {
        setCurrentUser(null);
      }
    } else {
      setErrorMessage('Escriu "esborra" per confirmar.');
    }
  };

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

  const activeBoxIds = ["b-v", "a-e", "o-u", "m-n", "esses", "h", "g-j", "l-l·l", "p-b", "t-d", "c-g"];

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
      case "m-n":
        return mNWords;
      case "esses":
        return sZWords;
      case "h":
        return hWords;
      case "g-j":
        return gJWords;
      case "l-l·l":
        return lGeminada;
      case "p-b":
        return pBWords;
      case "t-d":
        return tDWords;
      case "c-g":
        return cGWords;
      default:
        return { words: [] as Word[], rules: [] as Rule[], links: [] as Link[] };
    }
  }

  return (
    <>
      {currentUser ? (
        selectedBox ? (
          <WordPicker
            words={getBoxData(selectedBox).words}
            rules={getBoxData(selectedBox).rules}
            onBack={handleBack}
            boxId={selectedBox}
            boxes={boxes}
            links={getBoxData(selectedBox).links}
            user={currentUser}
          />
        ) : showSummary ? (
          <WordSummary boxes={boxes} onBack={handleBack} user={currentUser} />
        ) : (
          <div className="flex flex-col items-center mt-24 md:mt-0">
            <h1 className="text-6xl font-bold text-center my-4">Ortografia Catalana</h1>
            <p className="text-center text-sm text-gray-300 mb-4">
              {currentUser.name}, escull una caixa per començar a practicar.
            </p>
            <div className="absolute top-4 right-4 flex flex-col items-center md:flex-row md:space-x-4">
              <p className="text-4xl">{currentUser.avatar}</p>
              <p className="text-white">{currentUser.name}</p>
              <button onClick={handleUserChange} className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600">Canvia Usuari</button>
            </div>
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
        )
      ) : (
        <UserProfile onUserSelect={handleUserSelect} onUserCreate={handleUserCreate} onUserDelete={handleUserDelete} users={users} />
      )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
          <div className="bg-black p-4 rounded-lg">
            <p className="text-center mb-4">Escriu "esborra" per confirmar l'eliminació de l'usuari</p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Escriu 'esborra' per confirmar"
              className="p-2 border rounded mb-4 w-full"
            />
            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
            <div className="flex justify-between">
              <button onClick={confirmDeleteUser} className="p-2 bg-red-500 text-white rounded">OK</button>
              <button onClick={() => setShowDeleteConfirmation(false)} className="p-2 bg-gray-500 text-white rounded">Cancel·lar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App


