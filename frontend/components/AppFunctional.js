import axios from "axios";
import React, { useState } from "react";

// önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 0; //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState(initialMessage);

  function getXY() {
    return {
      x: (index%3) + 1 , 
      y: Math.floor(index/3) + 1
    };
  }

  function getXYMesaj() {
    const {x, y} = getXY();
    return `Koordinatlar (${x},${y})`;
  }

  function reset() {
    setIndex(initialIndex);
    setSteps(initialSteps);
    setMessage(initialMessage);
    setEmail(initialEmail);
  }

  function sonrakiIndex(yon) {
    if(yon === 'left'){
      if(index %3 === 0){
        setIndex(index-1);
        setSteps(steps+1);
      }
      else setMessage('Sola gidemezsiniz');
    }
    if(yon === 'right'){
      if(index %3 === 2){
        setIndex(index+1);
        setSteps(steps+1);
      }
      else setMessage('Sağa gidemezsiniz');
    }
    if(yon === 'up'){
      if(index %3 >2 ){
        setIndex(index-3);
        setSteps(steps+1);
      }
      else setMessage('Yukarıya gidemezsiniz');
    }
    if(yon === 'down'){
      if(index %3 < 6){
        setIndex(index+3);
        setSteps(steps+1);
      }
      else setMessage('Aşağıya gidemezsiniz');
    }
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
  }

  function onChange(evt) {
    evt.preventDefault();
    setEmail(evt.target.value);
    console.log('Email : ',email);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const payload = {
      email : email,
      steps : steps,
      ...getXY(),
    }
    console.log('payload : ',payload);
    axios
    .post(`http://localhost:9000/api/result`,payload)
    .then((res) => {
      setMessage(res.data.message);
      setEmail('');
      
    })
    .catch((err) => {
      console.log('sunucu- hatası ...', err);
      setMessage(err);
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={(e) => sonrakiIndex(e.target.id)} id="left">SOL</button>
        <button onClick={(e) => sonrakiIndex(e.target.id)} id="up">YUKARI</button>
        <button onClick={(e) => sonrakiIndex(e.target.id)} id="right">SAĞ</button>
        <button onClick={(e) => sonrakiIndex(e.target.id)} id="down">AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
