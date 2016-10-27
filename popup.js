$(function() {

  get_preferences();

  function get_preferences() {
    chrome.storage.sync.get(["notifications_on", "highlight_on"], function(items){
      $("#notifications").prop("checked", string_to_bool(items["notifications_on"]));
      $("#highlight").prop("checked", string_to_bool(items["highlight_on"]));
    })
  }

  function string_to_bool(string) {
    return string === "true";
  }

  $("#notifications").click(function() {
    status = this.checked
    chrome.storage.sync.set({ "notifications_on": status }, function() {
    })
  })

  $("#highlight").click(function() {
    status = this.checked
    chrome.storage.sync.set({ "highlight_on": status }, function() {
    })
  })
})
