"use client";

import { useState } from "react";
import Viewer from "../components/Viewer";
import axios, { AxiosResponse } from "axios";

interface Obj{
  width: number,
  height: number,
  length: number,
  name?: string | undefined
}

export default function App() {
  const [money, setMoney] = useState(0);
  const [moneyObj, setMoneyObj] = useState<Obj>({width: -1, height: 1, length: 1});
  const [object, setObject] = useState<string>("");
  const [found, setFound] = useState<string | undefined>("");
  const [searchObj, setSearchObj] = useState<Obj>({width: 1, height: 1, length: 1});

  const compareData = async () => {
    // inches
      const billWidth = 2.61;
      const billHeight = 0.0043;
      const billLength = 6.14;

      const response: AxiosResponse = await axios.get(`http://localhost:4000/find/${object}`);

      const data: Obj = response.data;

      let max_base_width_cash = Math.floor(data.width / billWidth);
      let max_base_length_cash = Math.floor(data.length / billLength);

      let moneyWidth = Math.min(money * billWidth, billWidth * max_base_width_cash);
      let moneyLength = Math.min(money * billLength, billLength * max_base_length_cash);
      let moneyHeight = billHeight * Math.ceil(money / (moneyWidth * moneyLength));

      console.log({ width: moneyWidth, height: moneyHeight, length: moneyLength });
      console.log({ width: data.width, height: data.height, length: data.length })

      setFound(data.name);
      setSearchObj({ width: data.width, height: data.height, length: data.length })
      setMoneyObj({ width: moneyWidth, height: moneyHeight, length: moneyLength });
  };

  return (
    <div className="app">
      <h1 className="title">Physical Money Visualizer</h1>
      <p>It's hard to imagine how much a certain amount of cash actually looks like in person.</p>
      <p>Now's your chance to answer those random what ifs. What does my college tuition look like next to a car?</p>
      <div className="entry">
        <div className="money-container">
          <p style={{fontSize: "1.4rem", fontFamily: "Cash Currency"}}>Amount of Money</p>
          <div className="dollar-input">
            <p style={{paddingLeft: "5px", fontSize: "1.2rem", color: "green", fontFamily: "Cash Currency"}}>$</p>
            <input type="text" className="money" onChange={(e) => setMoney(parseInt(e.target.value))}/>
          </div>
        </div>

        <div className="object-container">
          <p style={{fontSize: "1.4rem", fontFamily: "Cash Currency"}}>Object Name</p>
          <input type="text" className="object" onChange={(e) => setObject(e.target.value)}/>
        </div>
      </div>

      <button className="compare-btn" onClick={() => compareData()}>Compare</button>

      {moneyObj.width !== -1 && <div style={{display: "flex", flexDirection: "column", placeItems: "center", backgroundColor: "lightgray", borderRadius: "5px", padding: "15px", marginTop: "40px"}}>
          <h2>Dimension Properties (LxWxH)</h2>
          <p><strong>Object ({found}):</strong> {searchObj.width.toFixed(2)} in. x {searchObj.length.toFixed(2)} in. x {searchObj.height.toFixed(2)} in.</p>
          <p><strong>Money:</strong> {moneyObj.width.toFixed(2)} in. x {moneyObj.length.toFixed(2)} in. x {moneyObj.height} in.</p>
        </div>}

        <h2 style={{marginBottom: -10}}>3D Viewer</h2>
      <div style={{ width: "70vw", height: "70vh", border: "2px solid black", overflow: "hidden", borderRadius: "20px", marginTop: "20px"}}>
        {moneyObj.width !== -1 ? <Viewer
            moneyObject={moneyObj}
            searchObject={searchObj}
        /> : <div className="placeholder">
              <p style={{fontFamily: "Cash Currency"}}>Enter a cash amount and an object to visualize</p>
            </div>}
      </div>
    </div>
  );
}