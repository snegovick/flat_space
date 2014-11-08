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
  orientation: 0,
  angular_velocity: 0,
  speed: 0,
  const_max_speed: 1,
  const_max_ang_vel: 0.3,
  co: 0, //cos of orientation
  so: 0, //sin of orientation

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
    self.orientation = Math.random()*Math.PI;
    self.speed = 1+Math.random()*self.const_max_speed;
    self.x = Math.random()*gamescreen.width;
    self.y = 100;
    self.co = Math.cos(self.orientation);
    self.so = Math.sin(self.orientation);
    self.angular_velocity = self.const_max_ang_vel*Math.random();
    console.log(self.speed);
  },

  draw: function(self) {
    self.x+=self.speed*self.co;
    self.y+=self.speed*self.so;
    self.orientation+=self.angular_velocity;
    self.orientation%=Math.PI*2;
    gamescreen.put_multi_line(gamescreen, "white", self.x, self.y, self.orientation, self.points, 2);
  }
};

function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,

  next_ast_ctr: 60,
  const_ast_spawn_t: 60,
  player: null,
  background: null,
  left: false,
  right: false,
  fastForward: false,

  asteroids: [null, null, null, null, null],

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
      //gamescreen.set_keydown_cb(gamescreen, self.keydown_cb);
  },

  draw: function(self) {
    self.background.draw(self.background);

    if (self.next_ast_ctr <= 0) {
      for (var i = 0; i < self.asteroids.length; i++) {
        if (self.asteroids[i] == null) {
          self.asteroids[i] = new Asteroid();
          self.asteroids[i].init(self.asteroids[i]);
          break;
        }
      }
      self.next_ast_ctr = Math.random()*self.const_ast_spawn_t;
    }
    self.next_ast_ctr --;
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] != null) {
        self.asteroids[i].draw(self.asteroids[i]);
      }
    }

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
