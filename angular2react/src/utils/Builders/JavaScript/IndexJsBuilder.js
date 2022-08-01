import Builder from "../Builder";

export default class IndexJSBuilder extends Builder {
  constructor(folders) {
    super("index.js", folders);
    this.text = `import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
                
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
    this.location = this.folders.src;
    super.createFile();
  }
}
