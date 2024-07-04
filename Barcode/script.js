  const encodings = {
    "G":{
        0: "0100111",
        1: "0110011",
        2: "0011011",
        3: "0100001",
        4: "0011101",
        5: "0111001",
        6: "0000101",
        7: "0010001",
        8: "0001001",
        9: "0010111",
        },
    "L":{
        0: "0001101",
        1: "0011001",
        2: "0010011",
        3: "0111101",
        4: "0100011",
        5: "0110001",
        6: "0101111",
        7: "0111011",
        8: "0110111",
        9: "0001011",
        },
     "R":{
        0: "1110010",
        1: "1100110",
        2: "1101100",
        3: "1000010",
        4: "1011100",
        5: "1001110",
        6: "1010000",
        7: "1000100",
        8: "1001000",
        9: "1110100", 
        }
    };

  
  const encodingPatterns = {
    0: "LLLLLL", 1: "LLGLGG", 2: "LLGGLG", 3: "LLGGGL", 4: "LGLLGG",
    5: "LGGLLG", 6: "LGGGLL", 7: "LGLGLG", 8: "LGLGGL", 9: "LGGLGL"
  };
  
  function eanToBinary(EAN) {
    let binary = "101";
    const encodingPattern = encodingPatterns[EAN[0]];
    for (let i = 1; i < 7; i++) {
      binary += encodings[encodingPattern[i - 1]][EAN[i]];
    }
    binary += "01010";
    for (let i = 1; i < 7; i++) {
      binary += encodings["R"][EAN[i + 6]];
    }
    binary += "1010";
    console.log(binary)
    return binary;
  }
  
  function binaryToSVG(binary, EAN) {
    let xmlString = `<?xml version="1.0" ?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
    width="113.39pt" height="40.27pt">
    
    <!-- SVG content starts here -->
    <g>
      <rect width="100%" height="100%" style="fill:white" />`;
  
    let currentStreakStart = null;
    let currentStreakLength = 0;
  
    for (let i = 0; i < binary.length; i++) {
      const char = binary.charAt(i);
      if (char === '1') {
        if (currentStreakStart === null) {
          currentStreakStart = i;
          currentStreakLength = 1;
        } else {
          currentStreakLength++;
        }
      } else if (currentStreakStart !== null) {
        const x = currentStreakStart * 1.061 + 6.3;
        const width = currentStreakLength * 1.061;
        xmlString += `<rect x="${x}pt" width="${width}pt" height="100%" style="fill:#00224b" />`;
        currentStreakStart = null;
        currentStreakLength = 0;
      }
    }
  
    xmlString += `<text y="-8pt">${EAN}</text>
    </g>
  </svg>`;
  
    return xmlString;
  }
  
  function convertAndDownload() {
    const test = document.getElementById("eanInput").value.split(" ");
    test.forEach(EAN => {
        console.log(EAN)
        if(EAN !== "") {
            const binary = eanToBinary(EAN);
            const svgContent = binaryToSVG(binary, EAN);
            const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(svgBlob);
            downloadLink.download = `${EAN}.svg`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    });
  }