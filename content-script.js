const CAMBRIDGE_DICT_URL = 'https://dictionary.cambridge.org'

// var listener = function(evt) {
//     var selection = window.getSelection();
//     if (selection.rangeCount > 0) {
//         var range = selection.getRangeAt(0);
//         var text = range.cloneContents().textContent;
//         console.log(text);
//     }

// };
// document.addEventListener('dblclick', listener);

const getResultWordAndType = (resultEl) => {
    const resultWord = resultEl.getElementsByClassName("hw dhw")[0].textContent
    const wordType = resultEl.getElementsByClassName("pos dpos")[0] ? resultEl.getElementsByClassName("pos dpos")[0].textContent : ''
    return [resultWord, wordType]
}

const getSubWordAndTypeAndGuideWord = (resultEl) => {
    const resultWord = resultEl.getElementsByClassName("hw dsense_hw")[0] ? resultEl.getElementsByClassName("hw dsense_hw")[0].textContent : ''
    const wordType = resultEl.getElementsByClassName("pos dsense_pos")[0] ? resultEl.getElementsByClassName("pos dsense_pos")[0].textContent : ''
    const guideWord = resultEl.getElementsByClassName("guideword dsense_gw")[0] ? resultEl.getElementsByClassName("guideword dsense_gw")[0].textContent : ''
    return [resultWord, wordType,guideWord]
}

const getLevelAndDefinition = (resultEl) => {
    var definitionString = '',
        level = ''

    const levelAndDefinitionEl = resultEl.getElementsByClassName("ddef_h")[0]
    const levelEl = levelAndDefinitionEl.getElementsByClassName("def-info ddef-info")[0]
    const definitionEl = levelAndDefinitionEl.getElementsByClassName("def ddef_d db")[0]

    
    if (levelEl.children[0]) {
        level = levelEl.children[0].textContent
        hasLevel = true
    }
    

    Array.from(definitionEl.childNodes).forEach(element => {
        if (element.textContent) {
            definitionString += element.textContent
        }
    });
    if (definitionString.trimEnd().endsWith(":")) {
        definitionString = definitionString.trimEnd().slice(0, -1);
    }
    return [definitionString,level]
}

const getAudioAndIPA = (resultEl) => {
    var ukPronounce = '',
        ukPronounceAudio = '', 
        usPronounce = '', 
        usPronounceAudio = ''

    const ukElement = resultEl.getElementsByClassName("uk dpron-i ")[0]
    const usElement = resultEl.getElementsByClassName("us dpron-i ")[0]

    if (ukElement) {
        if (ukElement.getElementsByClassName("pron dpron")[0]) {
            const ukElementPronounceElement = ukElement.getElementsByClassName("pron dpron")[0].childNodes
            Array.from(ukElementPronounceElement).forEach((element) => {
                if (element.textContent) {
                    ukPronounce += element.textContent
                }
            })
        }
        ukPronounce = ukPronounce.replace("ə","<sup>ə</sup>")
        ukPronounceAudio = CAMBRIDGE_DICT_URL + ukElement.getElementsByClassName("hdn")[0].children[1].getAttribute("src")
    }

    if (usElement) {
        if (usElement.getElementsByClassName("pron dpron")[0]) {
            const usElementPronounceElement = usElement.getElementsByClassName("pron dpron")[0].childNodes
            Array.from(usElementPronounceElement).forEach((element) => {
                if (element.textContent) {
                    usPronounce += element.textContent
                }
            })
        }
        usPronounce = usPronounce.replace("ə","<sup>ə</sup>")
        usPronounceAudio = CAMBRIDGE_DICT_URL + usElement.getElementsByClassName("hdn")[0].children[1].getAttribute("src")
    }
    return [ukPronounce, ukPronounceAudio, usPronounce, usPronounceAudio]
}

const mainWordResultWordAndTypeElementGenerator = (resultWord, wordType) => {
    return `
    <div class="text-box-div">
        <h2 class="h2-text" style="display: inline-block;">
            <strong class="strong-text">
                ${resultWord}
            </strong>
        </h2>
        <p class="normal-p" style="display: inline-block;">
            ${wordType}
        </p>
    </div>
    `
}

const resultWordAndTypeElementGenerator = (resultWord, wordType, guideWord) => {
    return `
    <div class="text-box-div">
        <h2 class="h2-text" style="display: inline-block;">
            <strong class="strong-text">
                ${resultWord}
            </strong>
        </h2>
        <p class="normal-p" style="display: inline-block;">
            ${wordType}
        </p>
        <p class="normal-p" style="display: inline-block;">
            ${guideWord}
        </p>
    </div>
    `
}

const levelAndDefinitionElementGenerator = (level, definitionString) => {
    var levelEl = `
    <div class="text-box-div">
        <h3 class="h3-text" style="display: inline-block;">
            Level: 
        </h3> 
        <p class="normal-p" style="display: inline-block;">
            <strong class="strong-text">
                ${level}
            </strong>
        </p> 
    </div>
    `
    const definitionEl = `
    <div class="text-box-div"> 
        <p class="normal-p">
        ${definitionString}
        </p>
    </div>
    `

    if (!level) {
        levelEl = ''
    }

    return [levelEl,definitionEl]
}

const audioAndIPAElementGenerator = (ukPronounce, ukPronounceAudio, usPronounce, usPronounceAudio) => {
    var ukDisplayEl = '',
    usDisplayEl = ''
    if (ukPronounce != '') {
        ukDisplayEl = `
        <div class="text-box-div">
            <p class="paragraph" style="display: inline-block;">
                <strong>UK</strong>
            </p> 
            <audio class="pronounceAudio" src="${ukPronounceAudio}"></audio>
            <button style="display: inline-block;" class="audio-button">
                &#9658;
            </button>
            <p class="paragraph ipa" style="display: inline-block;">
                ${ukPronounce}
            </p> 
        </div>
        `
    }

    if (usPronounce != '') {
        usDisplayEl = `
        <div class="text-box-div">
            <p class="paragraph" style="display: inline-block;">
                <strong>
                    US
                </strong>
            </p>
            <audio class="pronounceAudio" src="${usPronounceAudio}"></audio>
            <button style="display: inline-block;" class="audio-button">
                &#9658;
            </button>
            <p class="paragraph ipa" style="display: inline-block;">${usPronounce}</p>
        </div>
        `
    }
    return [ukDisplayEl, usDisplayEl]
}

const getSubwordInfo = (resultEl) => {
    const [subWord, subWordType, guideWord] = getSubWordAndTypeAndGuideWord(resultEl)
    const [definitionString,level] = getLevelAndDefinition(resultEl)
    return [subWord, subWordType, guideWord, definitionString,level]
} 

const getWordListFromAPage = (pageEl) => {
    const entryElementList = pageEl.getElementsByClassName("pr entry-body__el")
    var wordListOfCertainType = []
    Array.from(entryElementList).forEach((resultEl) => {
        // Get word's type and the word itself and make to element
        const [resultWord, wordType] = getResultWordAndType(resultEl)
        const resultWordAndTypeEl = mainWordResultWordAndTypeElementGenerator(resultWord, wordType)
        const [ukPronounce, ukPronounceAudio, usPronounce, usPronounceAudio] = getAudioAndIPA(resultEl)
        var [ukDisplayEl, usDisplayEl] = audioAndIPAElementGenerator(ukPronounce, ukPronounceAudio, usPronounce, usPronounceAudio)
        let wordWithSubWord = {
            resultWordAndType: resultWordAndTypeEl,
            ukDisplayEl: ukDisplayEl,
            usDisplayEl: usDisplayEl,
            subWordList: []
        }
        // Retrieve all words with the same word's type
        Array.from(resultEl.getElementsByClassName("pr dsense ")).forEach((subResultEl) => {
            var [subWord, subWordType, guideWord, definitionString,level] = getSubwordInfo(subResultEl)
            if (!subWord) {
                subWord = resultWord
            }
            if (!subWordType) {
                subWordType = wordType
            }
            wordWithSubWord.subWordList.push(generateSubWordDiv(subWord, subWordType, guideWord, definitionString,level))
        })
        wordListOfCertainType.push(wordWithSubWord)
    })
    return wordListOfCertainType
}

const generateDivForPage = (title, wordListOfCertainType) => {
    const wordListDisplayEl = wordListOfCertainType.map(wordInfoWithSubword => `
        <div class="card">
            <div class="card-header">
                <h3>${wordInfoWithSubword.resultWordAndType}</h3>
                ${wordInfoWithSubword.ukDisplayEl}
                ${wordInfoWithSubword.usDisplayEl}
            </div>
            <div class="card-body">
                ${wordInfoWithSubword.subWordList.map(subWordEl => `${subWordEl}`).join('')}
            </div>
        </div>
    `).join('');
    return `
    <div>
        <h3>${title}</h3>
        ${wordListDisplayEl}
    </div>`
}

const generateSubWordDiv = (resultWord, wordType, guideWord, definitionString, level) => {
    var wordAndTypeEl = resultWordAndTypeElementGenerator(resultWord, wordType, guideWord)
    var [levelEl, defintionEl] = levelAndDefinitionElementGenerator(level, definitionString)

    const subWordDiv = `
    <div class="div-with-bottom-line">
        ${wordAndTypeEl}
        ${levelEl}
        ${defintionEl}
    </div>
     `
    return subWordDiv
}


const generateDialog = (wordDiv) => {
    const dialogHTML = `
    <dialog class="info-dialog">
        ${wordDiv}
        <br><button class="close-button" id="closeButton">
            X
        </button>
    </dialog>
     `

    const finalDialogDiv = `
    <div id="spe-dialog">
        ${dialogHTML}
    </div>
    `
    return finalDialogDiv
}

const readWordInEachPageAndGenerateEl = (parsedDocument) => {
    const pageElList = []
    const pageListEl = parsedDocument.body.getElementsByClassName("page")[0]
    Array.from(pageListEl.getElementsByClassName("pr dictionary")).forEach((pageEl) => {
        const [title, wordListEl] = getWordAndInfoFromAPage(pageEl)
        pageElList.push(generateDivForPage(title,wordListEl))
    })
    return pageElList.map(pageDisplayEl => `${pageDisplayEl}`).join('')
}

const getWordAndInfoFromAPage = (pageEl) => {
    const wordListEl = getWordListFromAPage(pageEl)
    const titleEl = pageEl.getElementsByClassName("di-head c_h di_h")[0]
    const resultWord = pageEl.getElementsByClassName("hw dhw")[0].textContent
    const title = titleEl ? titleEl.textContent : "Meaning of " + resultWord + " in English"
    return [title, wordListEl]
}


//Event listener to receive message from pageEvent
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(message, "text/html");

    const displayEl = readWordInEachPageAndGenerateEl(parsedDocument)

    const finalDialogDiv = generateDialog(displayEl)

    const oldSpeDialog = document.getElementById("spe-dialog")
    if (oldSpeDialog) {
        const newDiv = document.createElement('div');
        newDiv.innerHTML = finalDialogDiv;
        oldSpeDialog.replaceWith(newDiv)
    } else {
        document.body.innerHTML += finalDialogDiv
    }
    var dialog = document.querySelector("dialog")
    var dialogDiv = document.getElementById("spe-dialog")
    const closeButton = document.getElementById("closeButton")

    const buttons = document.querySelectorAll('.audio-button');
    const audios = document.querySelectorAll('.pronounceAudio');

    buttons.forEach((button,index) => { 
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            audios[index].play();
        });
    });

    document.querySelectorAll('.card').forEach(card => {
        const cardHeader = card.querySelector('.card-header');
        cardHeader.addEventListener('click', () => {
          card.classList.toggle('is-expanded');
        });
    });

    dialog.addEventListener('click', function(event) {
        if (event.target === dialog || !dialogDiv.contains(event.target)) {
            dialog.close()
        }
      });

    closeButton.addEventListener("click", function() {
        dialog.close()
    })
    dialog.showModal()
});

