let pageStateInitiated = false;

// Logic to handle checkbox state change
document.getElementById('for-you-checkbox').addEventListener('click', function () {
    if (pageStateInitiated) {
        const isChecked = this.checked;
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