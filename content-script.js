const CAMBRIDGE_DICT_URL = 'https://dictionary.cambridge.org'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(message, "text/html");
    const firstResult = parsedDocument.body.getElementsByClassName("pr entry-body__el")[0]

    const levelAndDefinitionEl = firstResult.getElementsByClassName("ddef_h")[0]
    
    const levelEl = levelAndDefinitionEl.getElementsByClassName("def-info ddef-info")[0]
    
    const definitionEl = levelAndDefinitionEl.getElementsByClassName("def ddef_d db")[0]
    var level = ""
    var hasLevel = false
    if (levelEl.children[0]) {
        level = levelEl.children[0].textContent
        hasLevel = true
    }
    var definitionString = ""

    Array.from(definitionEl.childNodes).forEach(element => {
        if (element.textContent) {
            definitionString += element.textContent
        }
    });
    definitionString = definitionString.trimEnd().slice(0, -1);

    const resultWord = firstResult.getElementsByClassName("hw dhw")[0].textContent
    const wordType = firstResult.getElementsByClassName("pos dpos")[0].textContent
    const ukElement = firstResult.getElementsByClassName("uk dpron-i ")[0]
    const usElement = firstResult.getElementsByClassName("us dpron-i ")[0]

    var ukPronounce = "/" + ukElement.getElementsByClassName("ipa dipa lpr-2 lpl-1")[0].textContent + "/"
    ukPronounce = ukPronounce.replace("ə","<sup>ə</sup>")

    var usPronounce = "/" + usElement.getElementsByClassName("ipa dipa lpr-2 lpl-1")[0].textContent + "/"
    usPronounce = usPronounce.replace("ə","<sup>ə</sup>")

    const ukPronounceAudio = CAMBRIDGE_DICT_URL + ukElement.getElementsByClassName("hdn")[0].children[1].getAttribute("src")
    const usPronounceAudio = CAMBRIDGE_DICT_URL + usElement.getElementsByClassName("hdn")[0].children[1].getAttribute("src")

    const headerDiv = '<div class="text-box-div"> <h2 class="h2-text" style="display: inline-block;"><strong>' + resultWord + '</strong></h2> <p class="normal-p" style="display: inline-block;">' + wordType + '</p> </div>'

    var levelDiv = '<div class="text-box-div"> <h3 class="h3-text" style="display: inline-block;">Level: </h3> <p class="normal-p" style="display: inline-block;"><strong>' + level + '</strong></p> </div>'
    if (!hasLevel) {
        levelDiv = ""
    }
    const definitionDiv = '<div class="text-box-div"> <p class="normal-p">' + definitionString + '</p>'
    const ukDisplayDiv = '<div class="text-box-div"> <p class="paragraph" style="display: inline-block;"><strong>UK</strong></p> <audio class="pronounceAudio" src="' + ukPronounceAudio + '"></audio><button style="display: inline-block;" class="audioButtonClass">&#9658;</button>' + '<p class="paragraph" style="display: inline-block;">' + ukPronounce + '</p> </div>'
    const usDisplayDiv = '<div class="text-box-div"> <p class="paragraph" style="display: inline-block;"><strong>US</strong></p> <audio class="pronounceAudio" src="' + usPronounceAudio + '"></audio><button style="display: inline-block;" class="audioButtonClass">&#9658;</button>' + '<p class="paragraph" style="display: inline-block;">' + usPronounce + '</p> </div>'

    const dialogHTML = '<dialog class="info-dialog"> ' + headerDiv + levelDiv + definitionDiv + ukDisplayDiv + usDisplayDiv + ' <br><button class="close-button" id="closeButton">Close</button></dialog>'
    const finalDialogDiv = '<div id="spe-dialog">' + dialogHTML + '</div>'
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

    const buttons = document.querySelectorAll('.audioButtonClass');
    const audios = document.querySelectorAll('.pronounceAudio');

    buttons.forEach((button,index) => { 
        button.addEventListener('click', () => {
            audios[index].play();
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

