import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import styles from "./form.module.css";
import { RxWidth } from "react-icons/rx";
import { SymbolsContext } from "../helper/helperContext";
const Form = ({ setAmount }) => {
  const setCurrencySymbols = useContext(SymbolsContext);
  const [currencyDetails, setCurrencyDetails] = useState([]);
  const [fromCurrency, setfromCurrencyInput] = useState("");
  const [toCurrency, settoCurrencyInput] = useState("");
  const [filterCurrency, setfilterCurrency] = useState([]);
  const [value, setValue] = useState(0);
  const [isFocused, setIsFocused] = useState("");

  const handleFromChange = (e) => {
    const from = e.target.value;
    setfromCurrencyInput(from);

    const fromObject = currencyDetails.filter((currency) =>
      currency.description.toLowerCase().includes(fromCurrency.toLowerCase())
    );
    setfilterCurrency(fromObject);
  };

  const handleToChange = (e) => {
    const to = e.target.value;
    settoCurrencyInput(to);
    const toObject = currencyDetails.filter((currency) =>
      currency.description.toLowerCase().includes(toCurrency.toLowerCase())
    );

    setfilterCurrency(toObject);
  };

  const handleDirectChange = (e) => {
    const currencyName = e.target.innerText;

    if (e.target.className === "from") {
      setfromCurrencyInput(currencyName);
      setfilterCurrency([]);
    } else if (e.target.className === "to") {
      settoCurrencyInput(currencyName);
      setfilterCurrency([]);
    }
  };

  const handleExchange = async (e) => {
    e.preventDefault();
    const fromSymbol = fromCurrency.split("-")[1];
    const toSymbol = toCurrency.split("-")[1];
    const response = await axios.get(
      `https://api.exchangerate.host/convert?from=${fromSymbol}&to=${toSymbol}`
    );

    setAmount({
      rate: response.data.result,
      amount: value * response.data.result,
      currency: toSymbol,
    });
  };

  const handleFocus = (focus) => {
    if (focus === "from") {
      setIsFocused("from");
    } else if (focus === "to") {
      setIsFocused("to");
    }
  };

  useEffect(() => {
    const getSymbols = async () => {
      const symbols = await axios("https://api.exchangerate.host/symbols");
      setCurrencySymbols(Object.keys(symbols.data.symbols));
      setCurrencyDetails(Object.values(symbols.data.symbols));
    };
    getSymbols();
  }, [setCurrencySymbols]);
  console.log(isFocused);

  return (
    <div className={`${styles.form}`}>
      <form>
        <div className={`${styles.inputSection}`}>
          <div className={`${styles.formGroup}`}>
            <input
              type="text"
              onChange={handleFromChange}
              onFocus={() => handleFocus("from")}
              value={fromCurrency}
              placeholder="your currency"
            />
            <div className={`${styles.currencyList}`}>
              {isFocused === "from" &&
                fromCurrency &&
                filterCurrency.map((Maincurrency, id) => {
                  return (
                    <p
                      onClick={handleDirectChange}
                      id={Maincurrency.code}
                      key={id}
                      className="from"
                    >
                      {Maincurrency.description} -{Maincurrency.code}
                    </p>
                  );
                })}
            </div>
          </div>
          <div className={`${styles.arrowBettwen}`}>
            <RxWidth />
          </div>
          <div className={`${styles.formGroup}`}>
            <input
              type="text"
              className=""
              onChange={handleToChange}
              onFocus={() => handleFocus("to")}
              placeholder="derived currency"
              value={toCurrency}
            />
            <div className={`${styles.currencyList}`}>
              {isFocused === "to" &&
                toCurrency &&
                filterCurrency.map((Maincurrency, id) => {
                  return (
                    <p
                      onClick={handleDirectChange}
                      id={Maincurrency.code}
                      key={id}
                      className="to"
                    >
                      {Maincurrency.description} -{Maincurrency.code}
                    </p>
                  );
                })}
            </div>
          </div>
        </div>
        <input
          type="number"
          onChange={(e) => setValue(e.target.value)}
          name=""
          id=""
        />
        <button type="submit" onClick={handleExchange}>
          Translate
        </button>
      </form>
    </div>
  );
};

export default Form;
