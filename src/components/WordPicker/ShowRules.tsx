import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const sorted = [...rules].sort((a, b) => a.id - b.id);
    setSortedRules(sorted);
  }, [rules]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center my-4">Regles Ortogràfiques</h1>
      <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-gray-500 text-white rounded">Tornar al WordPicker</button>
      <div className="mt-16 grid grid-cols-1 gap-8">
        {sortedRules.map((rule) => (
          <div key={rule.id} className="p-4 bg-gray-800 text-white text-xl rounded-lg">
            <p className="font-bold">{rule.message}</p>
            <p className="text-gray-400">{rule.ex}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowRules;
