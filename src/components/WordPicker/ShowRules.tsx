import { useEffect, useState } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

interface Rule {
  id: number;
  message: string;
  rule: string;
  ex: string;
}

interface ShowRulesProps {
  onBack: () => void;
  rules: Rule[];
}

const ShowRules: React.FC<ShowRulesProps> = ({ onBack, rules }) => {
  const [sortedRules, setSortedRules] = useState<Rule[]>([]);
  const [learntRules, setLearntRules] = useState<Rule[]>([]);
  const [lastTap, setLastTap] = useState<number>(0);

  useEffect(() => {
    const sorted = [...rules].sort((a, b) => a.id - b.id);
    setSortedRules(sorted);

    const storedLearntRules = JSON.parse(localStorage.getItem('learntRules') || '[]');
    setLearntRules(storedLearntRules);
  }, [rules]);

  const handleDoubleClick = (rule: Rule) => {
    if (learntRules.includes(rule)) {
      const updatedLearntRules = learntRules.filter(r => r.id !== rule.id);
      setLearntRules(updatedLearntRules);
      setSortedRules([...sortedRules, rule].sort((a, b) => a.id - b.id));
      localStorage.setItem('learntRules', JSON.stringify(updatedLearntRules));
      toastr.info(`La regla "${rule.message}" s'ha mogut a "Regles per aprendre".`);
    } else {
      const updatedLearntRules = [...learntRules, rule];
      setLearntRules(updatedLearntRules);
      setSortedRules(sortedRules.filter(r => r.id !== rule.id));
      localStorage.setItem('learntRules', JSON.stringify(updatedLearntRules));
      toastr.success(`La regla "${rule.message}" s'ha mogut a "Regles apreses".`);
    }
  };

  const handleTouch = (rule: Rule) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
      handleDoubleClick(rule);
    }
    setLastTap(currentTime);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center my-4">Regles Ortogràfiques</h1>
      <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-gray-500 text-white rounded">Tornar</button>
      <p className="text-center my-4">Doble clic a una regla per moure-la entre les seccions "regles apreses" i "regles per aprendre".</p>
      <div className="mt-8 w-full">
        <h2 className="text-2xl font-bold text-center my-4">Regles per aprendre</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedRules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 bg-gray-800 text-white text-xl rounded-lg cursor-pointer"
              onDoubleClick={() => handleDoubleClick(rule)}
              onTouchEnd={() => handleTouch(rule)}
            >
              <p className="font-bold">{rule.message}</p>
              <p className="text-gray-400">{rule.ex}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 w-full">
        <h2 className="text-2xl font-bold text-center my-4">Regles apreses</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {learntRules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 bg-green-500 text-black text-xl rounded-lg cursor-pointer"
              onDoubleClick={() => handleDoubleClick(rule)}
              onTouchEnd={() => handleTouch(rule)}
            >
              <p className="font-bold">{rule.message}</p>
              <p className="text-gray-800">{rule.ex}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowRules;
