chrome.runtime.onMessage.addListener(
  function(msg, sender) {
    if (msg.msg == "clearNotifications") {
      chrome.notifications.getAll(function(notifications) {
        if (Object.getOwnPropertyNames(notifications).length != 0) {
          notificationID = Object.keys(notifications)[0];
          chrome.notifications.clear(notificationID);
        }
      })
    }
    else {
      var opts = msg.msg;

      chrome.notifications.getAll(function(notifications) {
        if (Object.getOwnPropertyNames(notifications).length === 0) {
          createNotification(opts.description, opts);
        }
        else {
          notificationID = Object.keys(notifications)[0];
          updateNotification(notificationID, opts);
        }
      })

    }
});

chrome.notifications.onButtonClicked.addListener(viewBtnClick);

// Have to inject script since sabotage doesn't reload when going "back"
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  chrome.tabs.query({url: "https://sabotage.internal.mx/"}, function(tab) {
    if (Object.keys(tab).length !== 0) {
      chrome.tabs.executeScript(null,{file:"crushit.js"});
    }
  })
});

function viewBtnClick() {
  gotoTab("https://sabotage.internal.mx/");
}

function gotoTab(url) {
  tabID = chrome.tabs.query({ url: url }, function(tabs) {
    chrome.tabs.update(tabs[0].id, { selected: true });
  })
}

function createNotification(id, opt) {
  chrome.notifications.create(id, opt);
}

function updateNotification(id, opt) {
  chrome.notifications.update(id, opt);
}
