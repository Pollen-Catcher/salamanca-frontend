import React, { useState } from "react";
import { render } from "react-dom";
import Button from "./Components/Button/button";
import Checkbox from "./Components/Checkbox/checkbox";
import Search from "./Components/Searchbar/searchbar";

function App() {
  const [checked, setChecked] = useState(false);
  const toggleChecked = () => setChecked((value) => !value);

  return (
    <div align="center">
      <div align="center">
        <Button>Hello World</Button>
      </div>
      <div>
        <Search />
      </div>
      <br />
      <div>
        <label>
          <Checkbox checked={checked} onChange={toggleChecked} />
          <span style={{ marginLeft: 8 }}>Remember me</span>
        </label>
      </div>
    </div>
  );
}

render(<App />, document.getElementById("root"));
export default App;
