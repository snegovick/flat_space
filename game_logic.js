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
    var y = self.y + 4*gamescreen.height/5;
    gamescreen.put_triangle(gamescreen, "white", 0, x, y, -10, 10, 0, -20, 10, 10);
  }
};

function Asteroid() {};

Asteroid.prototype = {
  points: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],

  init: function(self) {
    var r = 0;
    var angle_increment = Math.PI*2/self.points.length;
    var angle = 0;
    for (var i = 0; i < self.points.length; i++) {
      r = (Math.random()+0.3)*50;
      self.points[i][0] = r*Math.cos(angle);
      self.points[i][1] = r*Math.sin(angle);
      angle+=angle_increment;
    }
  },

  draw: function(self) {
    gamescreen.put_multi_line(gamescreen, "white", 100, 100, 0, self.points, 2);
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
  fastForward: false,

  asteroid: null,

  keydown: function(self, event) {
    //console.log("down");
    //console.log(event);
    if (event.keyCode == 16) { // shift
      self.fastForward = true;
      self.background.set_fast_speed(self.background);
    }
    if (event.keyCode == 65) { // a
      self.left = true;
    }
    if (event.keyCode == 68) { // d
      self.right = true;
    }

  },

  keyup: function(self, event) {
    //console.log("up");
    //console.log(event);
    if (event.keyCode == 16) { // shift
      self.fastForward = false;
      self.background.set_normal_speed(self.background);
    }
    if (event.keyCode == 65) { // a
      self.left = false;
    }
    if (event.keyCode == 68) { // d
      self.right = false;
    }

  },

  init: function(self) {
    self.default_velocity = gamescreen.height/20;
    self.player = new Player();
    self.player.init(self.player);
    self.background = new Background();
    self.background.init(self.background);
    self.asteroid = new Asteroid();
    self.asteroid.init(self.asteroid);

      //gamescreen.set_keydown_cb(gamescreen, self.keydown_cb);
  },

  draw: function(self) {
    self.background.draw(self.background);
    self.asteroid.draw(self.asteroid);
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
