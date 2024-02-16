import { useState } from "react";

const AddGameView = ({ onAddGame }) => {
  const [name, setName] = useState('');

  const handleAddGame = () => {
    onAddGame(name);
    setName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddGame();
    }
  };

  return (
    <div style={{maxWidth: "300px"}}>
      <label htmlFor="gameName" className="form-label">Game name (JIRA ticket)</label>
      <input
        type="text"
        className="form-control"
        value={name}
        onKeyDown={handleKeyDown}
        onChange={(e) => setName(e.target.value)}
      /><br/>
      <button className="btn btn-primary" onClick={handleAddGame}>Add Game</button>
    </div>
  );
}

export default AddGameView;