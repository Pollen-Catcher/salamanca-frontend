import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Paperbase from './components/Paperbase';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Edit from './components/Content/edit';

ReactDOM.render(
  <Router>
    <div>
      <Route path="/" element={App} />
      <Route path='/edit/:id' component={Edit} />
    </div>
  </Router>,
  document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
