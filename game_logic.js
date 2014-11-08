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
    // console.log("down");
    // console.log(event);
    if (event.keyCode == 16) { // shift
      self.fast_forward = true;
      progress.set_fast_speed(progress);
      self.background.set_fast_speed(self.background);
      for (var i = 0; i < self.asteroids.length; i++) {
        if (self.asteroids[i] != null) {
          self.asteroids[i].set_fast_speed(self.asteroids[i]);
        }
      }
    }
    if (event.keyCode == 32) { // space
      self.player.torpedo_launch(self.player);
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
      progress.set_normal_speed(progress);
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
    progress.init(progress);
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
    progress.draw(progress);
    if (progress.get_stage_complete(progress)) {
      progress.next_stage(progress);
    }
    
  }
};

var gamelogic = new GameLogic();
