const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const amount = document.querySelector("form input");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        const option = document.createElement("option");
        option.innerText = currCode;
        option.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            option.selected = true;
        }

        if (select.name === "to" && currCode === "INR") {
            option.selected = true;
        }

        select.append(option);

        option.addEventListener("change", () => {
            updateFlag(select);
        });
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

btn.addEventListener("click", async (e) => {
    e.preventDefault();

    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const fromCurr = document.querySelector(".from select").value.toLowerCase();
    const toCurr = document.querySelector(".to select").value.toLowerCase();

    const URL = `${BASE_URL}/${fromCurr}.json`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        const rate = data[fromCurr][toCurr];

        const finalAmount = (amtVal * rate).toFixed(2);

        msg.innerText = `${amtVal} ${fromCurr.toUpperCase()} = ${finalAmount} ${toCurr.toUpperCase()}`;
    } catch (err) {
        msg.innerText = "Unable to fetch exchange rate.";
        console.log(err);
    }
});

window.addEventListener("load", () => {
    updateFlag(document.querySelector(".from select"));
    updateFlag(document.querySelector(".to select"));
});