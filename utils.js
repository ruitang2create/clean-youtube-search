let pageStateInitiated = false;

// Logic to handle checkbox state change
document.getElementById('for-you-checkbox').addEventListener('click', function () {
    if (pageStateInitiated) {
        const isChecked = this.checked;
        // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //     const activeTab = tabs[0];
        //     // Send a message to the content script to trigger the removal logic
        //     chrome.tabs.sendMessage(activeTab.id, { removeForYou: isChecked });
        // });
        chrome.storage.sync.set({ "hideForYou": isChecked ? "true" : "false" });
    }
});

const getInitialState = async () => {
    if (!pageStateInitiated) {
        const hideForYou = await chrome.storage.sync.get("hideForYou");
        console.log(`HideForYou from chrome storage: ${JSON.stringify(hideForYou)}`);
        const forYouCheckbox = document.getElementById('for-you-checkbox');
        forYouCheckbox.checked = forYouCheckbox === 'true';
        pageStateInitiated = true;
    }
}

getInitialState();
// // Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     if (message && message.removeForYouByDefault !== undefined) {
//         // Use the value of 'sayYes' received from the content script
//         //   console.log("The value of 'sayYes' is:", message.sayYesValue);
//         const forYouCheckbox = document.getElementById('for-you-checkbox');
//         forYouCheckbox.checked = removeForYouByDefault === 'true';
//         // You can use the value here as needed
//     }
// });