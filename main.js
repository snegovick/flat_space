var logic = function() {
  console.log("loaded");
  map.init(map);
  gamescreen.init(gamescreen);
  gamelogic.init(gamelogic);

  gamescreen.set_keydown_cb(gamescreen, function(kc) {
    gamelogic.keydown(gamelogic, kc);
  });

  gamescreen.set_keyup_cb(gamescreen, function(kc) {
    gamelogic.keyup(gamelogic, kc);
  });

  gamescreen.set_touchstart_cb(gamescreen, function(kc) {
    gamelogic.touchstart(gamelogic, kc);
  });

  gamescreen.set_touchmove_cb(gamescreen, function(kc) {
    gamelogic.touchmove(gamelogic, kc);
  });

  gamescreen.set_touchend_cb(gamescreen, function(kc) {
    gamelogic.touchend(gamelogic, kc);
  });

  var drawAll = function() {
    map.draw(map);
    gamelogic.draw(gamelogic);
  };

  window.setInterval(function() {
    gamescreen.draw(gamescreen, drawAll);
  }, gamescreen.frame_timeout);
};

document.addEventListener("DOMContentLoaded", logic, false);
