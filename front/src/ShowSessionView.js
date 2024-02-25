import { useEffect, useState } from "react";
import AddUserView from "./AddUserView";
import io from "socket.io-client";
import GameView from "./GameView";
import config from "./config";

const ShowSessionView = ({ context, sessionId }) => {
  const [userData, setUserData] = useState({ name: '', type: '' });
  const [session, setSession] = useState(null);

  let socket;
  const connectToSocket = () => {
    if (socket && socket.connected) return;

    socket = io(config.apiUrl, {
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on(sessionId, (payload) => {
      setSession(payload);
    });
  };

  useEffect(() => {
    connectToSocket();
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadSession = async () => {
      const currentSession = await context.api.getSession(sessionId);
      setSession(currentSession);
    }
    loadSession();
    return () => { ignore = true; };
  }, [context.api, sessionId]);

  const onAddUser = ({ userName, userType }) => {
    setUserData({ name: userName, type: userType });
  };

  useEffect(() => {
    const userDataFromStorage = JSON.parse(localStorage.getItem('userData')) ?? { name: '', type: '' };
    setUserData(userDataFromStorage);
    if (userDataFromStorage.name)
      context.api.addPlayer(sessionId, userDataFromStorage.name, userDataFromStorage.type);
  }, []);

  useEffect(() => {
    if (userData?.name) {
      localStorage.setItem('userData', JSON.stringify(userData));
      context.api.addPlayer(sessionId, userData.name, userData.type);
    }
  }, [userData]);

  return (
    <div>
      {(!userData?.name) && <AddUserView onAddUser={onAddUser} />}
      {userData && userData.name && <GameView
        context={context}
        session={session}
        setSession={setSession}
        userName={userData.name}
        userType={userData.type}/>}
    </div>
  )
};

export default ShowSessionView;