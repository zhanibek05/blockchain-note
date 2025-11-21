// Адрес контракта
const contractAddress =
  "0xa6F0F8154ACC763Bf9F4257E3403D9b9A4dE3F5E"; // проверь, что адрес и сеть верные

// ABI контракта
const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_note",
        type: "string",
      },
    ],
    name: "setNote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getNote",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let provider;
let signer;
let contract;

async function init() {
  if (!window.ethereum) {
    alert("MetaMask не найден. Установи расширение MetaMask.");
    return;
  }

  // Подключаемся к провайдеру (сеть можно не передавать, она берётся из MetaMask)
  provider = new ethers.providers.Web3Provider(window.ethereum);

  // Запрашиваем аккаунты
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  // Создаём объект контракта
  contract = new ethers.Contract(contractAddress, abi, signer);

  console.log("Contract initialized:", contract);

  // Вешаем обработчики на кнопки только после инициализации
  document.getElementById("setNoteBtn").onclick = setNote;
  document.getElementById("getNoteBtn").onclick = getNote;
}

// Вызываем init после загрузки страницы
window.addEventListener("load", init);

// Вызываем setNote() в смарт-контракте
async function setNote() {
  if (!contract) {
    alert("Контракт ещё не инициализирован, подожди пару секунд.");
    return;
  }

  const note = document.getElementById("note").value;

  try {
    const tx = await contract.setNote(note);
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed");
  } catch (err) {
    console.error("Error in setNote:", err);
  }
}

// Вызываем getNote() и показываем результат пользователю
async function getNote() {
  if (!contract) {
    alert("Контракт ещё не инициализирован, подожди пару секунд.");
    return;
  }

  try {
    const note = await contract.getNote();
    console.log("Note from contract:", note);
    document.getElementById("result").innerText = note;
  } catch (err) {
    console.error("Error in getNote:", err);
  }
}
