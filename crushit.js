var $j = jQuery.noConflict();

main();

var observer = new MutationObserver(main);
var objConfig = {
  childList: true,
  subtree: false,
  attributes: false,
  characterData: false
};

observer.observe(findQueue("Verification Queue")[0], objConfig);
observer.observe(findQueue("Production Queue")[0], objConfig);

function main() {
    var queues = ["Verification Queue", "Production Queue"];
    var notificationItems = [];

    queues.forEach(function(queue) {
      domQueue = findQueue(queue);
      deployItems = domQueue.find(" > div");

      deployItems.each(function( i, item ) {
        if (isWorkable(item) === true) {
          markItem(item);
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
}

function markItem(item) {
  $j(item).css("background-color", "rgb(232, 96, 48)");
  $j(item).children().css("color", "white");
  $j(item).find("svg[type='edit']").css("fill", "white");
}

function buildNotification(item, queueName) {
  description = $j(item).find(" > div ").first().text().trim();

  return {
    title: description,
    message: queueName
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
  var opt = {
    type: "list",
    title: "A wild unpunched item has appeared!",
    message: "why",
    items: notificationItems,
    iconUrl: "assets/cat.jpg",
    buttons: [{
      title: 'View',
      iconUrl: "assets/open.png"
    }],
    requireInteraction: true
  }

  chrome.runtime.sendMessage({msg: opt}, function(response){});
}
