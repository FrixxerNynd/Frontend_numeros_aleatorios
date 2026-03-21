import React from "react";
import "./CardInputSimulator.css";

export default function CardInputSimulator() {
  return (
    <div className="card-sim-container">
      <div className="card-sim-header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
          alt="Visa"
          className="card-sim-logo"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Mastercard-logo.png"
          alt="Mastercard"
          className="card-sim-logo"
        />
        <span className="card-sim-title">Credit or debit card</span>
      </div>
      <div className="card-sim-form">
        <div className="card-sim-row">
          <input
            className="card-sim-input"
            type="text"
            placeholder="Número de tarjeta"
            disabled
          />
        </div>
        <div className="card-sim-row card-sim-row-2">
          <input
            className="card-sim-input"
            type="text"
            placeholder="Nombre del titular de la tarjeta"
            disabled
          />
          <input
            className="card-sim-input"
            type="text"
            placeholder="Fecha de caducidad"
            disabled
          />
        </div>
        <div className="card-sim-row">
          <input
            className="card-sim-input"
            type="text"
            placeholder="cvc"
            style={{ width: "120px" }}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
