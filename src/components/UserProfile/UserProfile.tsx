import { useState } from 'react';

interface User {
  name: string;
  avatar: string;
  createdAt: string;
}

interface UserProfileProps {
  onUserSelect: (user: User) => void;
  onUserCreate: (user: User) => void;
  onUserDelete: (user: User) => void;
  users: User[];
}

const avatars = ['🐉', '🤡', '🦄', '🐯', '🐸', '🐵', '🐧', '🐼', '🐨', '🐰', '🦊', '🦁', '🐮', '🐷', '🐭', '🐹', '🐻', '🐔', '🦉', '🧟'];

const UserProfile: React.FC<UserProfileProps> = ({ onUserSelect, onUserCreate, onUserDelete, users }) => {
  const [newUserName, setNewUserName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatars[0]);

  const handleCreateUser = () => {
    if (newUserName.trim()) {
      onUserCreate({ name: newUserName, avatar: selectedAvatar, createdAt: new Date().toLocaleString() });
      setNewUserName('');
    }
  };

  return (
    <div className="flex flex-col items-center">

      <h1 className="text-4xl font-bold text-center my-4">Selecciona usuari per començar o crea un nou usuari</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {users.map((user, index) => (
          <div
            key={index}
            className="p-4 bg-blue-500 text-white text-xl rounded-lg cursor-pointer hover:bg-blue-600"
          >
            <div onClick={() => onUserSelect(user)}>
              <p className="font-bold">{user.name}</p>
              <p className="text-4xl">{user.avatar}</p>
              <p className="text-sm text-white">{user.createdAt}</p>
              <p>
                <button
                  onClick={() => onUserDelete(user)}
                  className=" p-2 m-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="Nom del nou usuari"
          className="p-2 border rounded mb-4 w-full"
        />
        <div className={`grid gap-4 mb-4 ${window.innerWidth < 768 ? 'grid-cols-4' : 'grid-cols-10'}`}>
          {avatars.map((avatar, index) => (
            <span
              key={index}
              className={`text-4xl cursor-pointer p-2 rounded ${selectedAvatar === avatar ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
              onClick={() => setSelectedAvatar(avatar)}
            >
              {avatar}
            </span>
          ))}
        </div>

        <button onClick={handleCreateUser} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Crear Usuari</button>
      </div>
    </div>
  );
};

export default UserProfile;