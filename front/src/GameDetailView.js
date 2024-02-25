import { useEffect, useState } from "react";

const GameDetailView = ({ context, session, userName, userType, unloadGame }) => {
  const [currentGame, setCurrentGame] = useState(new Set());

  const userTypes = ['DEV', 'Q&A', 'Scrum master'];
  const allowedUserTypesToVote = ['DEV', 'Q&A'];

  const availableScores = [0, 1, 2, 3, 5, 8, 13];

  const addScore = (score) => {
    context.api.addScore(session.id, userName, score);
  };

  useEffect(() => {
    setCurrentGame(session.games[session.active_game]);
  }, [session, session.active_game]);

  const revealScores = async () => {
    await context.api.revealScores(session.id)
  }

  const displayAverage = (userType) => {
    if (currentGame.hidden === true || allowedUserTypesToVote.indexOf(userType) === -1
      || !('scores' in currentGame))
      return;

    let average = 0;
    if (Object.keys(currentGame.scores).length > 0 && userType in currentGame.scores) {
      const scores = Object.values(currentGame.scores[userType]);
      const sum = scores.reduce((a, b) => a + b, 0);
      average = sum / scores.length;
    }
    if (average === 0) return;

    return <span style={{ fontWeight: "bold" }}>(Average: {average.toFixed(1)})</span>
  }

  const displayTotalAverage = () => {
    if (currentGame.hidden === true || !('scores' in currentGame))
      return;

    let average = 0;
    let counter = 0;
    if (Object.keys(currentGame.scores).length > 0) {
      for (const userType in currentGame.scores) {
        const scores = Object.values(currentGame.scores[userType]);
        const sum = scores.reduce((a, b) => a + b, 0);
        average += sum;
        counter += scores.length;
      }
    }
    if (counter === 0) return;

    average = average / counter;
    if (average === 0) return;

    return <span style={{ fontWeight: "bold" }}>(Total average: {average.toFixed(1)})</span>
  }

  const isUserVoted = (userName, userType) =>
    allowedUserTypesToVote.indexOf(userType) > -1
    && currentGame
    && currentGame.scores
    && userType in currentGame.scores
    && userName in currentGame.scores[userType];

  const displayScore = (userName, userType) => {
    const isValid = currentGame && currentGame.scores
      && currentGame.hidden === false
      && userType in currentGame.scores
      && userName in currentGame.scores[userType];
    if (!isValid) return;

    return <span className="badge bg-danger" style={{ marginLeft: "5px" }}>
      {currentGame.scores[userType][userName]}
    </span>
  }

  const displayVoteSingularOrPluralForm = (groupedVotes) => {
    return groupedVotes.length > 1 ? `${groupedVotes.length} votes` : `1 vote`;
  }

  const displaySummary = (scores) => {
    const userScoreDict = {};
    for (const userType in scores) {
      for (const userName in scores[userType]) {
        userScoreDict[userName] = scores[userType][userName]
      }
    }

    const groupedScores = {};
    for (const userName in userScoreDict) {
      const score = userScoreDict[userName];
      if (!(score in groupedScores)) {
        groupedScores[score] = [];
      }
      groupedScores[score].push(userName);
    }

    const orderedScores = Object.keys(groupedScores).sort((a, b) => b - a);

    return (<div style={{marginTop: "20px"}}>
      {orderedScores.map((score, index) => (
        <div key={score}>
          <div><span style={{fontWeight: "600"}}>{displayVoteSingularOrPluralForm(groupedScores[score])} for <span className="badge bg-danger">{score}</span>:</span>
            {groupedScores[score].map((userName, userIndex) => (
              <span key={userName}>
                {userIndex > 0 ? ',' : ''} {userName}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>)
  }

  return (currentGame && <div>
    <h4>Active game: {currentGame.name}</h4>
    <h6>Players {displayTotalAverage()}</h6>
    <div>
      {
        userTypes.map(userType => {
          return (<div key={userType}>
            <h6 style={{ marginTop: "20px" }}>{userType} {displayAverage(userType)}</h6>
            {session && session.users && Object.entries(session.users)
              .sort((a, b) => a[0] - b[0])
              .filter(([_, type]) => type === userType)
              .map(([userName, _]) => {
                const isVoted = isUserVoted(userName, userType);
                return (<div key={userName}>
                  {userName}
                  {isVoted && <span className="badge bg-success" style={{ marginLeft: "5px" }}>voted</span>}
                  {displayScore(userName, userType)}
                </div>)
              }
              )}
          </div>)

        })
      }
    </div>
    {allowedUserTypesToVote.includes(session.users[userName]) &&
      <div style={{ "marginTop": "20px" }}>
        <h6>Your choice:</h6>
        {availableScores.map(score =>
          <button key={score} className="btn btn-primary btn-sm"
            onClick={() => addScore(score)}
            style={{ margin: "0 10px 0 0", width: "30px", height: "30px", verticalAlign: "middle", textAlign: "center", padding: "0" }}>{score}</button>)
        }
      </div>
    }
    {currentGame.hidden === false && displaySummary(currentGame.scores)}
    {userType == "Scrum master" && <div style={{ marginTop: "20px" }}>
      <button className="btn btn-success" onClick={revealScores} style={{ marginRight: "10px" }}>Reveal scores</button>
      <button className="btn btn-warning" onClick={unloadGame}>Create new game</button>
    </div>}
  </div>);

};

export default GameDetailView;