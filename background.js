// Receives notification info from content script
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
      chrome.notifications.getAll(function(notifications) {
        if (Object.getOwnPropertyNames(notifications).length === 0) {
          createNotification(msg.msg.description, msg.msg);
        }
        else {
          notificationID = Object.keys(notifications)[0];
          updateNotification(notificationID, msg.msg);
        }
      })
    }
});

chrome.notifications.onButtonClicked.addListener(viewBtnClick);

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
