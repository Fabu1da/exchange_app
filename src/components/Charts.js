import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import styles from "./charts.module.css";
const Charts = ({ currencySymbol }) => {
  const [rateHistory, setRateHistory] = useState(null);
  const [option, setOption] = useState({});
  const [series, setSeries] = useState([]);
  const [currency, setCurrency] = useState("UGX");
  const loadTheChart = (e) => {
    setCurrency(e.target.value);
  };

  useEffect(() => {
    const date = new Date(Date.now());
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    const currentDate = `${year}-0${month}-${day}`;
    console.log(currentDate);

    // last week
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let Lastday = lastWeek.getDate();
    let Lastmonth = lastWeek.getMonth() + 1;
    let Lastyear = lastWeek.getFullYear();
    const lastWeekDate = `${Lastyear}-0${Lastmonth}-${Lastday}`;
    console.log(lastWeekDate);

    const chart = async () => {
      console.log("current" + currentDate);
      try {
        const history = await axios.get(
          `https://api.exchangerate.host/timeseries?start_date=${lastWeekDate}&end_date=${currentDate}`
        );
        setRateHistory(history.data.rates);
      } catch (e) {
        console.log("error :", e);
      }
    };
    if (rateHistory === null) {
      chart();
    } else {
      setOption({
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: Object.keys(rateHistory),
          labels: {
            style: {
              colors: "#FFFFFF",
            },
          },
        },
        colors: ["#FF1654", "#247BA0"],
        yaxis: [
          {
            axisBorder: {
              show: true,
              color: "#FF1654",
            },
            labels: {
              style: {
                colors: "#FFFFFF",
              },
            },
          },
        ],
      });
      setSeries([
        {
          name: "series-1",
          data: [...Object.values(rateHistory).map((item) => item[currency])],
        },
      ]);
    }
  }, [rateHistory, currency]);

  return (
    <div>
      {rateHistory !== null ? (
        <div>
          <div className={`${styles.filter}`}>
            <div>EUR to {currency}</div>
            <div>
              <select className={styles.select} onChange={loadTheChart}>
                {currencySymbol.map((item, id) => (
                  <option key={id}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.chart}>
            <Chart options={option} series={series} type="line" width="700" />
          </div>
        </div>
      ) : (
        "no"
      )}
    </div>
  );
};

export default Charts;
