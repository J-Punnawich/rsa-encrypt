import "./App.css";
import { useState } from "react";
import { encryptRsa } from "./RsaEncryptionHelper";
import { publicKeyPEM } from "./constants";
import CryptoJS from "crypto-js";

function App() {
  const [publicKey, setPublicKey] = useState(publicKeyPEM);
  const [data, setData] = useState("");
  const [encryptedData, setEncryptedData] = useState("");
  const [encryptedKey, setEncryptedKey] = useState("");
  const symmetricKey = CryptoJS.lib.WordArray.random(128 / 8).toString(
    CryptoJS.enc.Hex
  );

  function encryptAESData(data, key) {
    // Convert data to WordArray (CryptoJS format)
    const dataToEncrypt = CryptoJS.enc.Utf8.parse(data);

    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    console.log("encrypted:", encrypted);

    const combined = encrypted.ciphertext.concat(iv);

    if (combined) {
      return CryptoJS.enc.Base64.stringify(combined);
    } else {
      throw new Error(
        "Error: Combined variable is undefined during encryption"
      );
    }
  }

  const handleEncrypt = async () => {
    try {
      const encryptedAESKey = await encryptRsa(symmetricKey, publicKey);
      setEncryptedKey(encryptedAESKey);

      const encryptAES = await encryptAESData(data, symmetricKey);
      setEncryptedData(encryptAES);

    } catch (e) {
      setEncryptedKey(e);
      setEncryptedData(e);
    }
  };

  return (
    <>
      <div className="mt-10 grid grid-cols-12 gap-2 w-full">
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
            Public Key
          </label>
          <textarea
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            rows="12"
            className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-slate-500 focus:border-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
            placeholder="Write product description here"
          ></textarea>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
            Data to Encrypt
          </label>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            rows="12"
            className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-slate-500 focus:border-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
            placeholder="Write product description here"
          ></textarea>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <button
          onClick={handleEncrypt}
          type="submit"
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Encrypt
        </button>
      </div>
      <div className="grid grid-cols-12 gap-2 w-full">
        <div className="col-span-12">
          <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
            Encrypted Data
          </label>
          <textarea
            value={encryptedData}
            rows="4"
            className="block p-2.5 w-full text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-slate-500 focus:border-slate-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
            placeholder="Write product description here"
          ></textarea>
        </div>
        <h1>test : {encryptedKey}</h1>
      </div>
    </>
  );
}

export default App;
