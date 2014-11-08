function Player() {};

Player.prototype = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
  r: 10,

  init: function(self) {
  },

  move_x: function(self, delta) {
    if ((Math.abs(self.vx+delta)<gamescreen.width/2)) {
      self.vx+=delta;
    }
  },

  draw: function(self) {
    self.x = self.vx + gamescreen.width/2;
    self.y = self.vy + 4*gamescreen.height/5;
    gamescreen.put_triangle(gamescreen, "white", 0, 2, self.x, self.y, -10, 10, 0, -20, 10, 10);
  }
};

function Asteroid() {};

Asteroid.prototype = {
  points: null,
  orientation: 0,
  start_orientation: 0,
  angular_velocity: 0,
  speed: 0,
  const_max_speed: 5,
  const_min_speed: 3,
  const_max_ang_vel: 0.3,
  const_max_norm_ast_r: 50,
  const_max_ast_r: 0,
  const_max_r: [10, 30, 50, 70, 90],
  size: 1,
  co: 0, //cos of orientation
  so: 0, //sin of orientation
  ttl: 20,
  speed_addition: 0,
  const_fast_speed: 15,
  const_slow_speed: 5,
  x: 0,
  y: 0,
  highlight: false,

  check_ttl: function(self) {
    return self.ttl;
  },

  set_fast_speed: function(self) {
    self.speed_addition = self.const_fast_speed;    
  },

  set_normal_speed: function(self) {
    self.speed_addition = self.const_slow_speed;
  },
  
  calc_trig: function(self, orientation) {
    self.orientation = orientation;
    self.co = Math.cos(self.orientation);
    self.so = Math.sin(self.orientation);    
  },

  init: function(self, size) {
    self.points = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    var r = 0;
    var angle_increment = Math.PI*2/self.points.length;
    var angle = 0;
    if (size>=self.const_max_r.length) {
      size = self.const_max_r.length-1;
    }
    self.size = Math.floor(size);
    self.const_max_ast_r = self.const_max_r[self.size];
    for (var i = 0; i < self.points.length; i++) {
      r = (Math.random()*0.7+0.3)*self.const_max_ast_r;
      self.points[i][0] = r*Math.cos(angle);
      self.points[i][1] = r*Math.sin(angle);
      angle+=angle_increment;
    }
    self.orientation = (0.1+Math.random()*0.8)*Math.PI;
    self.start_orientation = self.orientation;
    self.calc_trig(self, self.orientation);
    self.speed = Math.random()*(self.const_max_speed-self.const_min_speed) + self.const_min_speed;
    self.speed_addition = self.const_slow_speed;
    self.x = Math.random()*gamescreen.width;
    self.y = -self.const_max_ast_r;
    self.angular_velocity = 2*self.const_max_ang_vel*(Math.random()-0.5);
    //console.log(self.speed);
  },

  draw: function(self) {
    self.ttl --;
    self.x+=self.speed*self.co;
    self.y+=self.speed_addition+self.speed*self.so;
    self.orientation+=self.angular_velocity;
    self.orientation%=Math.PI*2;
    var style = "white";
    if (self.highlight) {
      style = "red";
    }
    gamescreen.put_multi_line(gamescreen, style, self.x, self.y, self.orientation, self.points, 2);
  }
};

function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,

  next_ast_ctr: 60,
  const_ast_spawn_t: 20,
  player: null,
  background: null,
  left: false,
  right: false,
  fast_forward: false,

  asteroids: [null, null, null, null, null, null],

  keydown: function(self, event) {
    //console.log("down");
    //console.log(event);
    if (event.keyCode == 16) { // shift
      self.fast_forward = true;
      self.background.set_fast_speed(self.background);
      for (var i = 0; i < self.asteroids.length; i++) {
        if (self.asteroids[i] != null) {
          self.asteroids[i].set_fast_speed(self.asteroids[i]);
        }
      }
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
      self.fast_forward = false;
      self.background.set_normal_speed(self.background);
      for (var i = 0; i < self.asteroids.length; i++) {
        if (self.asteroids[i] != null) {
          self.asteroids[i].set_normal_speed(self.asteroids[i]);
        }
      }
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

  check_player_collision: function(self, player, asteroid) {
    if (pt_to_pt_dist([player.x, player.y], [asteroid.x, asteroid.y])<(asteroid.const_max_ast_r+player.r)*0.9) {
      console.log("collision");
    }
  },

  check_asteroid_collision: function(self, ast1_id, ast2_id) {
    var ast1 = self.asteroids[ast1_id];
    var ast2 = self.asteroids[ast2_id];
    if (pt_to_pt_dist([ast1.x, ast1.y], [ast2.x, ast2.y])<(ast1.const_max_ast_r+ast2.const_max_ast_r)*0.9) {
      //console.log("ast collision");
      ast1.highlight = true;
      ast2.highlight = true;
      var size;
      
      if ((ast1.size+ast2.size < (ast1.const_max_r.length-2)) && Math.random()>0.5) {
        size = ast1.size+ast2.size;
        var ast = new Asteroid();
        ast.init(ast, size);
        if (self.fast_forward) {
          ast.set_fast_speed(ast);
        }
        var x = (ast1.x+ast2.x)/2;
        var y = (ast1.y+ast2.y)/2;
        ast.x = x;
        ast.y = y;
        ast.angular_velocity = (ast1.angular_velocity+ast2.angular_velocity)/2;
        self.asteroids[ast1_id] = ast;
        self.asteroids[ast2_id] = null;
      } else {
        size = ast1.size+ast2.size/3;
        var nast1 = new Asteroid();
        nast1.init(nast1, size);
        var nast2 = new Asteroid();
        nast2.init(nast2, size);
        if (self.fast_forward) {
          nast1.set_fast_speed(nast1);
          nast2.set_fast_speed(nast2);
        }
        nast1.x=ast2.x+nast1.const_max_ast_r*ast2.co;
        nast1.y=ast2.y+nast1.const_max_ast_r*ast2.so;
        nast1.speed = ast2.speed*0.8;
        var angle = Math.atan2(ast2.y-ast1.y, ast2.x-ast1.x);
        nast1.calc_trig(nast1, angle);
        nast2.x=ast1.x+nast2.const_max_ast_r*ast1.co;
        nast2.y=ast1.y+nast2.const_max_ast_r*ast1.so;
        nast2.speed = ast1.speed*0.8;
        angle = Math.atan2(ast1.y-ast2.y, ast1.x-ast2.x);
        nast2.calc_trig(nast2, angle);
        self.asteroids[ast1_id] = nast1;
        self.asteroids[ast2_id] = nast2;        
      }
    }
  },

  draw: function(self) {
    self.background.draw(self.background);

    if (self.next_ast_ctr <= 0) {
      //console.log(self.asteroids);
      for (var i = 0; i < self.asteroids.length; i++) {
        if (self.asteroids[i] == null) {
          self.asteroids[i] = new Asteroid();
          self.asteroids[i].init(self.asteroids[i], 2);
          if (self.fast_forward) {
            self.asteroids[i].set_fast_speed(self.asteroids[i]);
          }
          break;
        }
      }
      self.next_ast_ctr = Math.random()*self.const_ast_spawn_t;
    }
    //console.log(self.asteroids);
    self.next_ast_ctr --;
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] != null) {
        for (var j = i+1; j < self.asteroids.length; j++) {
          if (self.asteroids[j] != null) {
            if (self.check_asteroid_collision(self, i, j)) {
              break;
            }
          }
        }
      }
    }
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] != null) {
        if (self.asteroids[i].check_ttl(self.asteroids[i])<0) {
          if (! gamescreen.circle_in_screen(gamescreen, self.asteroids[i].x, self.asteroids[i].y, self.asteroids[i].const_max_ast_r)) {
            self.asteroids[i] = null;
          } else {
            self.asteroids[i].draw(self.asteroids[i]);
            self.check_player_collision(self, self.player, self.asteroids[i]);
          }
        } else {
          self.asteroids[i].draw(self.asteroids[i]);
          self.check_player_collision(self, self.player, self.asteroids[i]);
        }
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
