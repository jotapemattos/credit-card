import "./css/index.css"
import IMask from "imask"

//take the colors behind the credit card
const cardBgFirstColor = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
)
const cardBgSecondColor = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
)
const creditCardLogo = document.querySelector(".cc-logo span:nth-child(2) img")
const ccStyle = document.querySelector(".cc")

//according to the parameter received, edit the card
function setCardType(type) {
  const creditCardColors = {
    visa: ["none", "none", "bg1"],
    mastercard: ["none", "none", "bg2"],
    americanExpress: ["none", "none", "bg4"],
    elo: ["none", "none", "bg3"],
    default: ["black", "grey", "bg"],
  }
  //modify the colors behind the credit card
  cardBgFirstColor.setAttribute("fill", creditCardColors[type][0])
  cardBgSecondColor.setAttribute("fill", creditCardColors[type][1])
  creditCardLogo.setAttribute("src", `cc-${type}.svg`)
  ccStyle.style.backgroundImage = `url("/cc-${creditCardColors[type][2]}.svg")`
}
//to execut directly in console
globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:
        /(^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^62(7780)|^63(6297|6368|6369))\d{0,10}/,
      cardType: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47]\d{0,13}/,
      cardType: "americanExpress",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    //concatena o que foi digitado no cardNumber, e se o que for digitado é um "não digito", ele é substituido por uma string vazia
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    //procura o regex de cada objeto, e da find com number que foi digitado acima, se for igual retorna true e o foundMask passa a valer o valor do regex
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  window.alert("Cartão adicionado com sucesso")
})

const ccNumberReset = document.querySelector(".cc-number")
const ccHolderReset = document.querySelector(".cc-holder .value")
const ccExtraReset = document.querySelector(".cc-extra .value")
const ccSecurityReset = document.querySelector(".cc-security .value")
const cardNumberReset = document.querySelector("#card-number")
const cardHolderReset = document.querySelector("#card-holder")
const expirationDateReset = document.querySelector("#expiration-date")
const securityCodeReset = document.querySelector("#security-code")

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
  setCardType("default")
  ccNumberReset.innerText = "1234 5678 9012 3456"
  ccHolderReset.innerText = "FULANO DA SILVA"
  ccExtraReset.innerText = "02/32"
  ccSecurityReset.innerText = "123"
  cardNumberReset.value = ""
  cardHolderReset.value = ""
  expirationDateReset.value = ""
  securityCodeReset.value = ""
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("keypress", function (e) {
  const keyCode = e.keyCode ? e.keyCode : e.wich
  if (keyCode >= 47 && keyCode < 58) {
    e.preventDefault()
  }
  //mesma coisa que checkChar(e) == false
  if (!checkChar(e)) {
    e.preventDefault()
  }
})

function checkChar(e) {
  //recebe o keycode do char e transforma em caractere
  const char = String.fromCharCode(e.keyCode)
  const pattern = "[a-zA-Z 125]"
  if (char.match(pattern)) {
    return true
  }
}

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  //if ternário
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExtra = document.querySelector(".cc-extra .value")
  ccExtra.innerText = date.length === 0 ? "02/32" : date
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}
