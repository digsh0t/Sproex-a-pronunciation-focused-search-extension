const rightMenuItem = {
    id: 'SPE',
    title: 'Search by Cambridge Dictionary',
    contexts: ['selection']
  }

// Adding new option on right click menu (context selection)
chrome.contextMenus.create(rightMenuItem)

searchWord = (info) => {
    fetchCambridge(info.selectionText)
};

fetchCambridge = (word) => {
    var headers = new Headers();
    headers.append('Content-Type','text/html; charset=UTF-8');
    fetch('https://dictionary.cambridge.org/dictionary/english/' + word,headers).then(r => r.text()).then(result => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, result);
        });
    })
} 

// OnCLicked option
chrome.contextMenus.onClicked.addListener(searchWord)