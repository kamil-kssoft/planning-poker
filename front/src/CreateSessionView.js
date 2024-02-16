const CreateSessionView = ({context, setSessionId, setView}) => {
  const createSession = async () => {
    try {
      const sessionId = await context.api.createSession();
      setSessionId(sessionId);
      context.showNotification('Session created successfully!', 'success');
    } catch (error) {
      context.showNotification('Error creating session.', 'danger');
    }
  };

  return (<div>
    <button className="btn btn-success btn-md" onClick={createSession}>Start new session</button>
  </div>);
};

export default CreateSessionView;