import { useState } from "react";

const AddUserView = ({ onAddUser }) => {
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('DEV' || 'Q&A' || 'Scrum master');

  const options = ['DEV', 'Q&A', 'Scrum master'];

  const handleAddUser = () => {
    onAddUser({ userName, userType });
    setUserName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddUser();
    }
  };

  return (
    <div style={{maxWidth:"300px"}}>
      User name:
      <input
        type="text"
        className="form-control"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        handleKeyDown={handleKeyDown}
      /><br/>
      User type:
      <select value={userType} onChange={e => setUserType(e.target.value)} className="form-select">
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select><br/>
      <button className="btn btn-primary" onClick={handleAddUser}>Add User</button>
    </div>
  );
}

export default AddUserView;