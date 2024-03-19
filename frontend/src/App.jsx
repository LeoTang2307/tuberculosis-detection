import React from "react"
import { useState } from "react"
import axios from "axios"
import "./App.css"

function App() {
  let file
  const [result, setResult] = useState({})
  const [isProcessed, setIsProcessed] = useState(false)
    
  function browseFile() {
    document.getElementById("hiddenInput").click()
  }

  function callPrediction(file) {
    const formData = new FormData()
    formData.append("file", file)
    axios.post("http://localhost:8000/predict", formData)
    .then(res => setResult(res.data))
    .catch(err => console.log(err))
  }

  function showImage(file) {
    const background = document.getElementById("background")
    const importArea = document.getElementById("import-area")
    const imageDisplay = document.getElementById("image-display")
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64_str = reader.result;
      const img_tag = `<img src="${base64_str}" class="h-64 w-64 rounded-lg"/>`
      importArea.setAttribute("hidden", "true")
      imageDisplay.innerHTML = img_tag;
      background.classList.remove("py-[15%]")
      background.classList.add("py-[5%]")
      setIsProcessed(true)
    }
  }

  function localInput(event) {
    event.preventDefault()
    file = event.target.files[0]
    showImage(file)
    callPrediction(file)
    console.log(file)
  }

  function inputFromDrag() {
    let importArea = document.getElementById("import-area")
    if (importArea.hasAttribute("hidden") == true) {
      importArea = document.getElementById("image-display")
    }
    importArea.ondragover = (event) => {
      event.preventDefault()
      importArea.classList.remove("border-dashed")
      importArea.classList.add("border-solid")
    }
    importArea.ondragleave = () => {
      importArea.classList.remove("border-solid")
      importArea.classList.add("border-dashed")
    }
    importArea.ondrop = (event) => {
      event.preventDefault()
      file = event.dataTransfer.files[0]
      showImage(file)
      callPrediction(file)
      console.log(file)
    }
  }

  return (
    <>
      <div className="flex items-center text-2xl font-bold text-white bg-red-500 h-[4rem]">
        <i className="fa-solid fa-lungs-virus mx-3"></i>
        <span>Tuberculosis Detection</span>
      </div>

      <div id="background" className="py-[15%] bg-[url(./assets/hospital.jpg)] bg-fixed bg-cover bg-no-repeat h-screen">
        {/* Input Area */}
        <div id="input-area" className="m-auto w-max h-max p-4 rounded-lg border-2 border-slate-600 border-opacity-40 shadow-lg">
          {/* Import Area */}
          <div id="import-area" onDragEnter={inputFromDrag} className="border-2 border-slate-100 border-dashed p-8 rounded-lg h-full w-full shadow-lg">
            <input id="hiddenInput" onInput={localInput} value={file} type="file" accept="image/*" className="w-full h-full" hidden></input>
            <div id="content" className="grid items-center justify-center text-center">
              <i className="fa-solid fa-cloud-arrow-up text-4xl mx-auto"></i>
              <span className="text-lg">Drag and Drop Chest X-ray Image</span>
              <span className="text-md">Or</span>
              <button type="button" onClick={browseFile} className="text-md text-white bg-black w-fit mx-auto p-2 rounded-xl">
                Browse File
              </button>
            </div>
          </div>
          {/* Image Display */}
          <div id="image-display" onDragEnter={inputFromDrag}>

          </div>
          {/* Prediction Area */}
          {isProcessed
          ? <div id="prediction-area" className="grid grid-cols-2 mx-auto bg-white mt-2 p-3 rounded-lg shadow-lg">
              <b>Label:</b>
              <span>{result[Object.keys(result)[0]]}</span>
              <b>Accuracy:</b>
              <span>{result[Object.keys(result)[1]]}</span>
            </div>
          : null}
        </div>
        {/* Browse New Image */}
        {isProcessed
        ? <div className="text-center">
            <button type="button" onClick={browseFile} className="w-max px-[9%] my-3 hover:bg-sky-900 hover:text-white rounded-lg border-2 border-slate-600 border-opacity-40 shadow-lg">
              Change File
            </button>
          </div>
        : null}      
      </div>
    </>
  )
}

export default App