import React from "react";
import { render } from "react-dom";
import Button from "./Components/Button/button";
import Checkbox from "./Components/Checkbox/checkbox";

const { useState } = React;
function App () {
  const [checked, setChecked] = useState(false);
  const toggleChecked = () => setChecked(value => !value);
    return (
      <><div>
        <label>
          <Checkbox
            checked={this.state.checked}
            onChange={this.handleCheckboxChange} />
          <span>Label Text</span>
        </label>
      </div><div>
          <Button>Hello World</Button>
        </div><div>
          <form action="/action_page.php">
            <input type="text" placeholder="Search.." name="search" />
            <button type="submit">Submit</button>
          </form>
        </div><div>
          <input type="checkbox" id="chkb" name="chkb" value="Name" />
          <label htmlFor="Name"> Remember me</label>
        </div></>   
    ); 
  );
}

export default App;
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
