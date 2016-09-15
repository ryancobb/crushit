var opts = {};
var closedOpts = {};

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
      // Store opts to compare against the last closed notifications options.
      // If the new options are the same as the last closed options, don't
      // display the notification.
      opts = msg.msg;

      if ( !_.isEqual(opts, closedOpts) ) {
        chrome.notifications.getAll(function(notifications) {
          if (Object.getOwnPropertyNames(notifications).length === 0) {
            createNotification(msg.msg.description, opts);
          }
          else {
            notificationID = Object.keys(notifications)[0];
            updateNotification(notificationID, opts);
          }
        })
      }
    }
});

chrome.notifications.onButtonClicked.addListener(viewBtnClick);

chrome.notifications.onClosed.addListener(storeClosed);

function storeClosed() {
  closedOpts = $.extend( true, {}, opts);
}

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
