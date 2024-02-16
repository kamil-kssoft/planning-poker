import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CreateSessionView from './CreateSessionView';
import ApiClient from "./api";
import ShowSessionView from "./ShowSessionView";


const App = () => {
  const [notification, setNotification] = useState({
    message: '',
    type: null
  }); // Notification state

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const context = {
    showNotification: showNotification,
    api: new ApiClient()
  };

  const [sessionId, setSessionId] = useState(null); // Session id state

  useEffect(() => {
    const id = window.location.pathname.slice(1); // Get the path excluding the first slash
    if (id) {
      setSessionId(id);
      context.api.createSession(id);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      window.history.pushState(null, '', `/${sessionId}`);
    }
  }, [sessionId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 2000); // Disable notification after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [notification]); // Effect depends on notification state

  return (
    <div>
      <div style={{ width: "100vw" }}>
        <img src="./assets/logo.png" alt="Poker planner logo" style={{ maxHeight: 300, textAlign: "center", margin: "auto" }} />
      </div>
      <div style={{margin: "10px 10px"}}>
        {!sessionId && <CreateSessionView context={context} setSessionId={setSessionId} />}
        {sessionId && <ShowSessionView context={context} sessionId={sessionId} />}
      </div>
      {notification && (
        <div className={"alert mt-3 alert-" + notification.type} role="alert">
          {notification.message}
        </div>
      )}
    </div>
  );

};
export default App;
