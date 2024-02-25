import { useEffect, useState } from "react";
import AddGameView from "./AddGameView";
import GameDetailView from "./GameDetailView";

const GameView = ({context, session, userName, userType}) => {
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    if (session && session.active_game) {
      setGameLoaded(true);
    }
  }, [session, session?.active_game]);

  const onAddGame = async (name) => {
    await context.api.createGame(session.id, name);
    setGameLoaded(true);
  };

  const unloadGame = () => setGameLoaded(false);

  return (
    <div>
      {(!session || !gameLoaded) && <AddGameView
        context={context}
        onAddGame={onAddGame} />}
      {session && gameLoaded && <GameDetailView
        context={context}
        session={session}
        userName={userName}
        userType={userType}
        unloadGame={unloadGame}/>}
    </div>
  );
}

export default GameView;