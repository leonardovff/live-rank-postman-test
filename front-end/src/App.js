import React, {useEffect, useState} from 'react';
import './App.css';

let maximumValidAssertions = 0;

function App() {
  const [repositoryInfo, setRepositoryInfo] = useState(0);
  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:5000/git-report/connect');
    webSocket.addEventListener('open', ev => {
      console.info('WebSocket connected');
    });
    webSocket.addEventListener('close', ev => {
      console.info('WebSocket disconnected');
    });
    webSocket.addEventListener('error', ev => {
      console.error('WebSocket error');
      console.debug(ev);
    });
    webSocket.addEventListener('message', ev => {
      /** @type [] */
      const data = JSON.parse(ev.data);
      maximumValidAssertions = Math.max(...data.map(x => x.ValidAssertions));
      setRepositoryInfo(data);
    });
  }, []); // [] as dependencies makes it run only once

  const showRepositoryInfo = repositoryInfo && Array.isArray(repositoryInfo);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Live Git Report</h1>
        <div style={{display: 'grid', gridAutoFlow: 'column', gridGap: 16}}>
          {showRepositoryInfo ? repositoryInfo.map(x => {
            const path = x.Path;
            const pathDirName = path.substr(path.substr(0, path.substr(0, path.length - 1).lastIndexOf("\\.git")).lastIndexOf("\\")).replace("\\.git", "");
            return (
                <div key={x.Path} style={{
                  display: 'flex',
                  flexFlow: 'column nowrap',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, .2)',
                  padding: 16
                }}>
                  <div style={{minHeight: 300, display: 'flex', alignItems: 'end'}}>
                    <div style={{minHeight: 50, height: 300 * (x.ValidAssertions / maximumValidAssertions), width: 50, backgroundColor: 'white', color: 'dimgray'}}>
                      {x.ValidAssertions} {x.ValidAssertions === maximumValidAssertions ? "🥇" : ""}
                    </div>
                  </div>
                  <span>Valid assertions</span>
                  <p>
                    Repository: <br/>
                    <code>{pathDirName}</code>
                  </p>
                  <p>Commits: <code>{x.Commits}</code></p>
                </div>
            );
          }) : (
              <p>∅</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
