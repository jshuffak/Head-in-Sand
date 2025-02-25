document.addEventListener("DOMContentLoaded", () => {
    const toggleExtension = document.getElementById("toggleExtension");
    const keywordList = document.getElementById("keywordList");
    const saveButton = document.getElementById("save");
    const defaultBlockedKeywords = ["politics", "election", "trump", "biden", "elon", "musk", "cybertruck", "democrat", "republican", "congress", "conservative", "murderedbywords", "aoc", "politician", "luigi mangione", "nazi", "gop", "antiwork", "cyberstuck", "govfire", "maga", "fednews"];

    chrome.storage.sync.get(["blockedKeywords", "extensionEnabled"], (data) => {
        keywordList.value = (data.blockedKeywords && data.blockedKeywords.length ? data.blockedKeywords : defaultBlockedKeywords).join("\n");
        toggleExtension.checked = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
    });

    saveButton.addEventListener("click", () => {
        const keywords = keywordList.value.split("\n").map(k => k.trim()).filter(k => k);
        chrome.storage.sync.set({ "blockedKeywords": keywords, "extensionEnabled": toggleExtension.checked });
		console.log("Saving with: ", keywords, toggleExtension.checked);
    });
});