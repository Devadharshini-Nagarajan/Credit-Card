import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [formDetails, setFormDetails] = useState({
    cardNo: "",
    cardName: "",
    expDate: undefined,
    expYear: undefined,
    CVV: "",
  });
  const [cardType, setCardType] = useState("visa");

  let monthArray = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  let yearArray = [
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
  ];

  // Credit card numbers validation - [maxlength, length with spaces]
  let cardDigits = {
    visa: [16, 19],
    mastercard: [16, 19],
    amex: [15, 18],
    jcb: [16, 19],
    dinersclub: [14, 17],
    discover: [16, 16],
    unionpay: [16, 16],
  };

  var getCardType = function (number) {
    let cardType = "visa";
    const numberFormated = number.replace(/\D/g, "");
    var patterns = {
      visa: new RegExp("^4[0-9]{0,15}$"),
      mastercard: new RegExp("^5$|^5[1-5][0-9]{0,14}$"),
      amex: new RegExp("^3$|^3[47][0-9]{0,13}$"),
      jcb: new RegExp(
        "^2[1]?$|^21[3]?$|^1[8]?$|^18[0]?$|^(?:2131|1800)[0-9]{0,11}$|^3[5]?$|^35[0-9]{0,14}$"
      ),
      dinersclub: new RegExp("^3$|^3[068]$|^3(?:0[0-5]|[68][0-9])[0-9]{0,11}$"),
      discover: new RegExp(
        "^6$|^6[05]$|^601[1]?$|^65[0-9][0-9]?$|^6(?:011|5[0-9]{2})[0-9]{0,12}$"
      ),
      unionpay: new RegExp(/^(62|88)\d+$/),
    };
    for (var key in patterns) {
      // if (patterns[key].test(numberFormated)) {
      if (numberFormated.match(patterns[key])) {
        cardType = key;
      }
    }
    return cardType;
  };

  const getValue = (value) => {
    var val = value;
    var newval = "";
    val = val.replace(/\s/g, "");

    // spacing after every 4 digits
    for (var i = 0; i < val.length; i++) {
      if (i % 4 === 0 && i > 0) newval = newval.concat(" ");
      newval = newval.concat(val[i]);
    }
    return newval;
  };

  const updateValues = (e, type) => {
    let value = e.target.value;
    if (["cardNo", "CVV"].includes(type)) {
      const re = /^[0-9\s]+$/;
      if (value === "" || re.test(value)) {
        updateFormDetails(
          type === "cardNo"
            ? // ? value.replace(/\W/gi, "").replace(/(.{4})/g, "$1 ")
              getValue(value)
            : value,
          type
        );
        if (type === "cardNo") setCardType(getCardType(value));
      }
    } else {
      updateFormDetails(value, type);
    }
  };

  const updateFormDetails = (value, type) => {
    let details = { ...formDetails, [type]: value };
    setFormDetails(details);
  };

  const submitDetails = () => {
    let { cardNo, cardName, expDate, expYear, CVV } = { ...formDetails };
    toast.clearWaitingQueue();
    if (!cardName || !cardNo || !expDate || !expYear) {
      toast.error("Please fill all fields");
      return false;
    }
    if (cardNo.length !== cardDigits[cardType][1]) {
      toast.error(`Please enter ${cardDigits[cardType][0]} digit card number`);
      return false;
    }
    if (CVV.length !== 4) {
      toast.error("Please enter 4 digit CVV");
      return false;
    }
    setFormDetails({
      cardNo: "",
      cardName: "",
      expDate: "Month",
      expYear: "Year",
      CVV: "",
    });
    toast.success("Card details submitted successfully");
  };

  const callOnfocus = () => {
    var card = document.querySelector(".card-body");
    card.classList.toggle("is-flipped");
  };

  const focusClassChange = (item) => {
    var cardValue = document.querySelector(`.${item}`);
    cardValue.classList.toggle("card-border");
  };

  const getCardNumber = () => {
    let num = formDetails.cardNo;
    let cardNo = "";
    for (let i = 0; i < cardDigits[cardType][1]; i++) {
      if (num[i]) cardNo += num[i];
      else if ([4, 9, 14].includes(i)) cardNo += " ";
      else cardNo += "#";
    }
    return cardNo;
  };

  return (
    <div className="home">
      <div className="content">
        {/* Credit Card Image */}
        <div className="card-body">
          {/* card front */}
          <div className="credit-img credit-front">
            <div className="imgs-row">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/chip.png`}
                alt="chip"
                className="chip-img"
              />
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/${cardType}.png`}
                alt="chip"
                className="visa-img"
              />
            </div>
            <div style={{ marginTop: "1em", textAlign: "center" }}>
              <span className="card-no">{getCardNumber()}</span>
            </div>
            <div style={{ marginTop: "1.5em" }} className="details-row">
              <div className="header-div card-name">
                <span className="header-text">Card Holder</span>
                <span className="header-value card-name-text">
                  {formDetails.cardName
                    ? formDetails.cardName.toLocaleUpperCase()
                    : "Your Name Here"}
                </span>
              </div>
              <div className="header-div card-expires">
                <span className="header-text">Expires</span>
                <span className="header-value">
                  {formDetails.expDate ? formDetails.expDate : "MM"}/
                  {formDetails.expYear ? formDetails.expYear : "YY"}
                </span>
              </div>
            </div>
          </div>
          {/* card back */}
          {/* <div className="credit-img credit-back">
            <div className="black-row"></div>
            <div className="cvv-div">
              <span>CVV</span>
              <div className="cvv-input">
                <span>{formDetails.CVV}</span>
              </div>
              <div className="visa-div">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/${cardType}.png`}
                  alt="chip"
                  className="visa-img"
                />
              </div>
            </div>
          </div> */}
        </div>
        {/* Credit Card Form */}
        <div className="credit-form">
          <div style={{display:'flex',justifyContent: 'center'}}>{process.env.NODE_ENV}</div>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              className="form-control"
              value={formDetails.cardNo}
              maxLength={cardDigits[cardType][1]}
              onChange={(e) => updateValues(e, "cardNo")}
              onFocus={() => focusClassChange("card-no")}
              onBlur={() => focusClassChange("card-no")}
            />
          </div>
          <div className="form-group">
            <label>Card Name</label>
            <input
              type="text"
              className="form-control"
              value={formDetails.cardName}
              maxLength="25"
              onChange={(e) => updateValues(e, "cardName")}
              style={{ textTransform: "uppercase" }}
              onFocus={() => focusClassChange("card-name")}
              onBlur={() => focusClassChange("card-name")}
            />
          </div>
          <div className="date-region">
            <div className="form-group">
              <label>Expiration Date</label>
              <select
                className="form-control"
                defaultValue="Month"
                value={formDetails.expDate}
                onChange={(e) => updateValues(e, "expDate")}
                onFocus={() => focusClassChange("card-expires")}
                onBlur={() => focusClassChange("card-expires")}
              >
                <option disabled>Month</option>
                {monthArray.map((el, index) => {
                  return <option key={index}>{el}</option>;
                })}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: "-7px" }}>
              <select
                className="form-control"
                defaultValue="Year"
                value={formDetails.expYear}
                onChange={(e) => updateValues(e, "expYear")}
                onFocus={() => focusClassChange("card-expires")}
                onBlur={() => focusClassChange("card-expires")}
              >
                <option disabled>Year</option>
                {yearArray.map((el, index) => {
                  return <option key={index}>{el}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                className="form-control"
                value={formDetails.CVV}
                maxLength="4"
                onChange={(e) => updateValues(e, "CVV")}
                onFocus={callOnfocus}
                onBlur={callOnfocus}
              />
            </div>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary btn-block submit-btn"
              onClick={submitDetails}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <ToastContainer limit={1} />
    </div>
  );
}

export default Home;
