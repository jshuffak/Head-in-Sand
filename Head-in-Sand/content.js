const defaultBlockedKeywords = ["politics", "election", "trump", "biden", "elon", "musk", "cybertruck", "democrat", "republican", "congress", "conservative", "murderedbywords", "aoc", "politician", "luigi mangione", "nazi", "gop", "antiwork", "cyberstuck", "govfire"];
let blockedKeywords = [];
let extensionEnabled = true;

function printStatus() {
	if (extensionEnabled) {
		console.log("Enabled!");
		console.log("Using block words: ", blockedKeywords);
	} else {
		console.log("Extension disabled");
	}
}

chrome.storage.sync.get(["blockedKeywords", "extensionEnabled"], (data) => {
	console.log(data);
    blockedKeywords = data.blockedKeywords && data.blockedKeywords.length ? data.blockedKeywords : defaultBlockedKeywords;
    extensionEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
    printStatus();
    hidePosts();
});

function hidePosts() {
    document.querySelectorAll("article").forEach(post => {
        let text = post.innerText.toLowerCase();
        if (extensionEnabled && blockedKeywords.some(keyword => text.includes(keyword))) {
            if (!post.dataset.hidden) {
                let placeholder = document.createElement("div");
                placeholder.innerText = "Post hidden (head-in-sand)";
                placeholder.style.color = "gray";
                placeholder.style.fontStyle = "italic";
                placeholder.style.margin = "10px 0";
                placeholder.classList.add("hidden-post-placeholder");
                post.parentNode.insertBefore(placeholder, post);
                post.dataset.hidden = "true";
            }
            post.style.display = "none";
        } else {
            if (post.dataset.hidden) {
                let placeholder = post.previousSibling;
                if (placeholder && placeholder.classList.contains("hidden-post-placeholder")) {
                    placeholder.remove();
                }
                delete post.dataset.hidden;
            }
            post.style.display = "";
        }
    });
}

const observer = new MutationObserver(hidePosts);
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("scroll", hidePosts);
document.addEventListener("DOMContentLoaded", hidePosts);

// Listen for storage changes to update settings dynamically
chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockedKeywords) {
        blockedKeywords = changes.blockedKeywords.newValue;
    }
    if (changes.extensionEnabled) {
        extensionEnabled = changes.extensionEnabled.newValue;
    }
	printStatus();
    hidePosts();
});