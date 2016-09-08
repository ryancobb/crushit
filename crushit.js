var $j = jQuery.noConflict();

// Check list every 5 seconds
setInterval(function() {
  var queues = ["Verification Queue", "Production Queue"];

  var notificationItems = [];

  queues.forEach(function(queue) {
    domQueue = findQueue(queue);
    deployItems = domQueue.find(" > div");

    deployItems.each(function( i, item ) {
      if (isWorkable(item) === true) {
        notificationItems.push(buildNotification(item, queue));
      }
    })
  })
  if (notificationItems.length === 0) {
    chrome.runtime.sendMessage({msg: "clearNotifications"});
  }
  else {
    createNotification(notificationItems);
  }

}, 5000);

function buildNotification(item, queueName) {
  description = $j(item).find(" > div ").first().text();

  return {
    title: description,
    message: "In the " + queueName
  }
}

function findQueue(queue) {
  return $j( "h1:contains('" + queue + "')").closest("div");
}

function isWorkable(item) {
  var nonWorkableEmojis = [ "punch.png", "shipit.png", "interrobang.png", "bangbang.png", "hourglass.png", "muscle.png" ];
  var workable = true;

  nonWorkableEmojis.forEach(function(emoji) {
    if ($j(item).find(" > div > img[src$='" + emoji + "']").length === 1) {
      workable = false;
    }
  })
  return workable;
}

function createNotification(notificationItems) {
  console.log("Creating notification");
  var opt = {
    type: "list",
    title: "A wild unpunched item has appeared!",
    message: "why",
    items: notificationItems,
    iconUrl: "cat.jpg",
    buttons: [{
      title: 'View',
      iconUrl: "assets/open.png"
    }],
    requireInteraction: true
  }

  chrome.runtime.sendMessage({msg: opt}, function(response){});
}
