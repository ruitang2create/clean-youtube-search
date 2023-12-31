const removedElements = [];

function setRemoveForYou(isChecked) {
    if (isChecked) {
        // When checked, update 'hideForYou' to 'true' in localStorage
        chrome.storage.sync.set({ "hideForYou": "true" });
    } else {
        // When unchecked, update 'hideForYou' to 'false' in localStorage
        chrome.storage.sync.set({ "hideForYou": "false" });
    }
}

chrome.storage.onChanged.addListener(({ hideForYou }) => {
    if (typeof hideForYou === 'undefined') return;
    console.log(`hideForYou changed to -> ${JSON.stringify(hideForYou)}`);
    if (hideForYou.newValue === "true") {
        console.log("HideForYou becomes true, add scroll listener to hide forYou");
        window.addEventListener("scroll", removeForYouOnScroll);
    } else {
        console.log("HideForYou becomes false, remove scroll listener to hide forYou, and reload the page");
        window.removeEventListener("scroll", removeForYouOnScroll);
    }
})

// Function to remove div elements
function removeForYou() {
    console.log("Try removing for you...");
    // const dismissibleDivs = document.querySelectorAll('div:has(span#title[innerHTML="For you"])');
    const dismissibleDivs = document.querySelectorAll('div#dismissible > div > div > h2 > span');
    if (dismissibleDivs.length > 0) {
        console.log("Found the for you span's parent div");
    } else {
        console.log("Could not find the for you span's parent div");
    }
    dismissibleDivs.forEach((span) => {
        if (span.innerText.trim().toLowerCase() === 'for you') {
            const divElement = span.closest('div#dismissible');
            if (divElement) {
                divElement.remove();
                console.log("for you removed successfully");
                removedElements.push("for you");
            } else {
                console.log("closest div#dismissible not found, can't remove");
            }
        } else {
            console.log(`Span is found, but the inner html is ${span.innerText.trim().toLowerCase()}`);
        }
    });
}

async function removeForYouByLocalStorage() {
    const { hideForYou } = await chrome.storage.sync.get("hideForYou");
    console.log(`HideForYou from chrome storage: ${JSON.stringify(hideForYou)}`);
    // chrome.runtime.sendMessage({ removeForYouByDefault: hideForYou });
    if (hideForYou === 'true') {
        // Send a message to the content script to trigger the removal logic
        console.log("hideForYou is true, add the scroll listener");
        window.addEventListener("scroll", removeForYouOnScroll);
    } else {
        console.log("hideForYou is false, remove the scroll listener");
        window.removeEventListener("scroll", removeForYouOnScroll);
    }
}

const removeForYouOnScroll = () => {
    if (removedElements.includes("for you")) {
        console.log("For you has been removed. Do nothing more.");
        return;
    }
    removeForYou();
    window.removeEventListener("scroll", removeForYouOnScroll);
};

// Check if the page has completely loaded
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    console.log("Page loaded completely");
    removeForYouByLocalStorage();
} else {
    console.log("DOM content loaded.");
    document.addEventListener("DOMContentLoaded", removeForYouByLocalStorage);
}
console.log("content script running!");