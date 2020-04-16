import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Config from './pages/config';

class App extends React.Component{
  render() {
    return <>
      <React.Suspense fallback="loading">
        <Config />
      </React.Suspense>
    </>
  }
}

ReactDOM.render(<App />, document.getElementById('root'));