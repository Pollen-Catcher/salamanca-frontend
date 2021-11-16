import React, { useState } from "react";
import { render } from "react-dom";
import SearchBar from "./Components/Searchbar/searchbar";
import Button from "./Components/Button/button";
import Checkbox from "./Components/Checkbox/checkbox";
import Table from "./Components/Table/table";
import Speech from "./Components/Speech/speech";
import Footer from "./Components/Footer/footer";

function App() {
  const [checked, setChecked] = useState(false);
  const toggleChecked = () => setChecked((value) => !value);

  const test_data = [{
    polen: 'Acer', _00h: '21', _01h: '03', _02h: '20', _03h: '8', _04h: '10',
    _05h: '15', _06h: '20', _07h: '05', _08h: '28', _09h: '12', _10h: '98',
    _11h: '33',
  },
  {
    polen: 'Populus', _00h: '01', _01h: '02', _02h: '03', _03h: '09', _04h: '04',
    _05h: '21', _06h: '00', _07h: '25', _08h: '41', _09h: '02', _10h: '00',
    _11h: '00',
  },
  {
    polen: 'Betula', _00h: '07', _01h: '32', _02h: '54', _03h: '00', _04h: '43',
    _05h: '09', _06h: '16', _07h: '17', _08h: '12', _09h: '07', _10h: '90',
    _11h: '32',
  }];

  return (
    <div>
      <div>
        <SearchBar/>
      </div>
      <div>
        <Speech />
      </div>
      <div>
        <label>
          <Checkbox checked={checked} onChange={toggleChecked} />
          <span style={{ marginLeft: 8 }}>Remember me</span>
        </label>
      </div>
      <div>
        <Table data={test_data} />
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("root"));
export default App;
