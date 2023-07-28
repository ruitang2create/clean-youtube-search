chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.removeForYouByDefault !== undefined) {
        // Send the value to the utils.js script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { sayYesValue: message.removeForYouByDefault });
        });
    }
});

console.log("Background is running!");