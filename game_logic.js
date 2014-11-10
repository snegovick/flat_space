function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,

  next_ast_ctr: 60,
  const_ast_spawn_t: 10,
  player: null,
  background: null,
  left: false,
  right: false,
  speed_step: 0,

  asteroids: [null, null, null, null, null, null, null, null, null, null, null, null,null, null, null, null, null, null, null, null, null, null, null, null],
  active_asteroids: 0,
  natural_asteroids: 12,

  keydown: function(self, event) {
    // console.log("down");
    // console.log(event);
    if (event.keyCode == 16) { // shift
      self.speed_step ++;
      progress.inc_speed(progress);
      self.background.inc_speed(self.background);
      self.player.inc_speed(self.player);
      for (var i = 0; i < self.natural_asteroids; i++) {
        if (self.asteroids[i] != null) {
          self.asteroids[i].inc_speed(self.asteroids[i]);
        }
      }
    }
    if (event.keyCode == 32) { // space
      self.player.launch_torpedo(self.player, self.asteroids);
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
      // progress.set_normal_speed(progress);
      // self.background.set_normal_speed(self.background);
      // for (var i = 0; i < self.asteroids.length; i++) {
      //   if (self.asteroids[i] != null) {
      //     self.asteroids[i].set_normal_speed(self.asteroids[i]);
      //   }
      // }
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
    hud.init(hud);
    //gamescreen.set_keydown_cb(gamescreen, self.keydown_cb);
  },

  set_normal_speed: function(self) {
    self.speed_step = 0;
    progress.set_normal_speed(progress);
    self.player.set_normal_speed(self.player);
    self.background.set_normal_speed(self.background);
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] != null) {
        self.asteroids[i].set_normal_speed(self.asteroids[i]);
      }
    }
  },

  create_new_asteroid: function(self, set_random, x, y, size, orientation, speed) {
    var idx = null;
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] == null) {
        idx = i;
        break;
      }
    }
    if (idx != null) {
      var nast = new Asteroid();
      if (set_random) {
        size = 2;
        nast.init(nast, size);
      } else {
        nast.init(nast, size);
        nast.speed = speed;
        nast.orientation = orientation;
        nast.x = x;
        nast.y = y;
        nast.calc_trig(nast, orientation); 
        nast.set_speed_step(nast, self.speed_step);
        console.log(set_random);
        console.log(x);
        console.log(y);
        console.log(orientation);
        console.log(size);
        console.log(nast);
      }
      self.asteroids[idx] = nast;
      return true;
    } else {
      return false;
    }
  },

  check_player_collision: function(self, player, asteroid) {
    if (pt_to_pt_dist([player.x, player.y], [asteroid.x, asteroid.y])<(asteroid.const_max_ast_r+player.r)*0.9) {
      return true;
    }
    return false;
  },

  check_torpedo_collision: function(self, torpedo, asteroid) {
    if (pt_to_pt_dist([torpedo.x, torpedo.y], [asteroid.x, asteroid.y])<(asteroid.const_max_ast_r+torpedo.r)*0.8) {
      console.log("torpedo collision");
      return true;
    }
    return false;
  },

  check_asteroid_collision: function(self, ast1_id, ast2_id) {
    var ast1 = self.asteroids[ast1_id];
    var ast2 = self.asteroids[ast2_id];
    if (pt_to_pt_dist([ast1.x, ast1.y], [ast2.x, ast2.y])<(ast1.const_max_ast_r+ast2.const_max_ast_r)*0.9) {
      //console.log("ast collision");
      ast1.highlight = true;
      ast2.highlight = true;
      var size;
      
      if (((ast1.size+ast2.size)/2 < (ast1.const_max_r.length-1)) && Math.random()>0.5) {
        size = ast1.size+ast2.size;
        var ast = new Asteroid();
        ast.init(ast, size);
        ast.set_speed_step(ast, self.speed_step);
        var x = (ast1.x+ast2.x)/2;
        var y = (ast1.y+ast2.y)/2;
        ast.x = x;
        ast.y = y;
        ast.angular_velocity = (ast1.angular_velocity+ast2.angular_velocity)/2;
        self.asteroids[ast1_id] = ast;
        self.asteroids[ast2_id] = null;
        self.active_asteroids --;
      } else {
        size = (ast1.size+ast2.size)/3;
        var nast1 = new Asteroid();
        nast1.init(nast1, size);
        var nast2 = new Asteroid();
        nast2.init(nast2, size);
        nast1.set_speed_step(nast1, self.speed_step);
        nast2.set_speed_step(nast2, self.speed_step);
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
      if (self.active_asteroids < self.natural_asteroids) {
        for (var i = 0; i < self.asteroids.length; i++) {
          if (self.asteroids[i] == null) {
            self.active_asteroids ++;
            self.asteroids[i] = new Asteroid();
            self.asteroids[i].init(self.asteroids[i], 2);
            self.asteroids[i].set_speed_step(self.asteroids[i], self.speed_step);
            break;
          }
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
    var torpedo = self.player.get_torpedo(self.player);
    if (torpedo != null) {
      for (var i = 0; i < self.asteroids.length; i++) {
        if (self.asteroids[i] != null) {     
          if (self.check_torpedo_collision(self, torpedo, self.asteroids[i])) {
            torpedo.draw(torpedo);
            torpedo.explode(torpedo);
            var sz = self.asteroids[i].get_size(self.asteroids[i]);
            if (sz > 3) {
              hud.inc_fuel(hud);
              var x = self.asteroids[i].x;
              var y = self.asteroids[i].y;
              var r = self.asteroids[i].const_max_ast_r;
              var speed = self.asteroids[i].speed;
              if (self.create_new_asteroid(self, false, x-r, y, 2, Math.PI/2, speed)) {
                self.active_asteroids ++;
              }
              if (self.create_new_asteroid(self, false, x+r, y, 2, -Math.PI/2, speed)) {
                self.active_asteroids ++;                
              }

            }
            self.active_asteroids --;
            self.asteroids[i] = null;
            break;
          }
        }
      }
    }

    hud.inc_luck(hud);
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] != null) {
        if (self.asteroids[i].check_ttl(self.asteroids[i])<0) {
          if (! gamescreen.circle_in_screen(gamescreen, self.asteroids[i].x, self.asteroids[i].y, self.asteroids[i].const_max_ast_r)) {
            self.asteroids[i] = null;
            self.active_asteroids --;
          } else {
            self.asteroids[i].draw(self.asteroids[i]);
            if (self.check_player_collision(self, self.player, self.asteroids[i])) {
              
              hud.dec_luck(hud);
              self.set_normal_speed(self);
            }
          }
        } else {
          self.asteroids[i].draw(self.asteroids[i]);
          self.check_player_collision(self, self.player, self.asteroids[i]);
        }
      }
    }

    if (self.left) {
      self.player.move_x(self.player, -self.default_velocity);
      //self.background.set_x_offset(self.background, 200*(self.player.x/(gamescreen.width/2)-1));
    }
    if (self.right) {
      self.player.move_x(self.player, self.default_velocity);
      //self.background.set_x_offset(self.background, 200*(self.player.x/(gamescreen.width/2)-1));
    }

    gamescreen.put_text(gamescreen, "bold 20px Arial", "black", "Score: "+self.score, 100, 100);
    self.player.draw(self.player);
    progress.draw(progress);
    if (progress.get_stage_complete(progress)) {
      progress.next_stage(progress);
    }
    hud.draw(hud);
  }
};

var gamelogic = new GameLogic();
