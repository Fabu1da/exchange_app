import "./App.css";
import { useState } from "react";
import Form from "./components/Form";
import { SymbolsContext } from "./helper/helperContext";
import "./App.css";
import Charts from "./components/Charts";
import logo from "./imgs/logo 1.png";

function App() {
  const [amount, setAmount] = useState({});
  const [currencySymbol, setCurrencySymbols] = useState([]);
  console.log(amount.amount === undefined);
  // to currency

  return (
    <SymbolsContext.Provider value={setCurrencySymbols}>
      <div className="App">
        <div className="leftSide">
          <img src={logo} alt="" />
          <p className="textLarge">
            Change from any currency to your preferable currency
          </p>
          <Form setAmount={setAmount} />

          <div className="outPut">
            <p className="RecievedAmount">
              Amount : {amount.amount ? amount.amount.toFixed(2) : 0.0}{" "}
              {amount.currency}
            </p>
            <p className="rate">rate : {amount.rate}</p>
          </div>
        </div>
        <div className="rightSide">
          <Charts currencySymbol={currencySymbol} />
        </div>
      </div>
    </SymbolsContext.Provider>
  );
}

export default App;
