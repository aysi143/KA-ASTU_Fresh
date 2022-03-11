chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.create({
        'url': 'newtab.html'
    }, function( tab ) {

    });
});

chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason == "install") {
        chrome.tabs.create({
            'url': 'welcome.html'
        });
    }
});
