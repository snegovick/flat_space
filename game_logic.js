function Player() {};

Player.prototype = {
  x: 0,
  y: 0,

  init: function(self) {
  },

  move_x: function(self, delta) {
    if ((Math.abs(self.x+delta)<gamescreen.width/2)) {
      self.x+=delta;
    }
  },

  draw: function(self) {
    var x = self.x + gamescreen.width/2;
    var y = self.y + 2*gamescreen.height/3;
    gamescreen.put_triangle(gamescreen, "white", 0, x, y, -10, 10, 0, -20, 10, 10);
  }
};

function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,
  player: null,
  background: null,
  left: false,
  right: false,

  keydown: function(self, event) {
    //console.log("down");
    //console.log(event);
    if (event.keyCode == 65) { //a
      self.left = true;
    }
    if (event.keyCode == 68) { //d
      self.right = true;
    }

  },

  keyup: function(self, event) {
    //console.log("up");
    //console.log(event);
    if (event.keyCode == 65) { //a
      self.left = false;
    }
    if (event.keyCode == 68) { //d
      self.right = false;
    }

  },

  init: function(self) {
    self.default_velocity = gamescreen.height/20;
    self.player = new Player();
    self.player.init(self.player);
    self.background = new Background();
    self.background.init(self.background);

    gamescreen.set_keydown_cb(gamescreen, self.keydown_cb);
  },

  draw: function(self) {
    self.background.draw(self.background);
    if (self.left) {
      self.player.move_x(self.player, -self.default_velocity);
    }
    if (self.right) {
      self.player.move_x(self.player, self.default_velocity);
    }

    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Score: "+self.score, 100, 100);
    self.player.draw(self.player);
    
  }
};

var gamelogic = new GameLogic();
