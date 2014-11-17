function Remainder() {};

Remainder.prototype = {
  x: 0,
  y: 0,
  orientation: 0,
  speed: 0,
  r: 6,
  luck: 0.05,
  fuel: 5,

  rtype: 0,
  rtype_colors: ["#00E1FA", "#7DFA00"], //fuel, luck

  so: 0,
  co: 0,

  speed_steps: [5, 10, 15, 20, 25],
  speed_addition: 5,

  pause: false,
  
  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.speed_addition = self.speed_steps[self.cur_speed_step];
  },

  set_normal_speed: function(self) {
    self.cur_speed_step = 0;
    self.speed_addition = self.speed_steps[0];
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.speed_addition = self.speed_steps[self.cur_speed_step];
  },
  
  init: function(self, x, y, orientation, rtype, speed, so, co) {
    self.x = x;
    self.y = y;
    if (rtype == 0) {
      self.luck = 0;
      self.fuel = Math.floor(Math.random()*self.fuel);
    } else {
      self.luck = Math.random()*self.luck;
      self.fuel = 0;
    }
    self.orientation = orientation;
    self.rtype = rtype;
    self.speed = speed;
    self.so = so || Math.sin(self.orientation);
    self.co = co || Math.cos(self.orientation);
  },

  draw: function(self) {
    if (! self.pause) {
      self.x+=self.speed*self.co;
      self.y+=self.speed_addition+self.speed*self.so;
    }
    gamescreen.put_rect(gamescreen, self.rtype_colors[self.rtype], 0, self.x, self.y, self.r, self.r);
  }
};

function GameLogic() {};

GameLogic.prototype = {
  default_velocity: 0,
  const_ticks_in_s: gamescreen.const_fps,
  const_ms_in_s: 1000,

  next_ast_ctr: 30,
  const_ast_spawn_t: 5,
  player: null,
  background: null,
  left: false,
  right: false,
  speed_step: 0,
  speed_step_max: 4,

  generate_asteroids: false,
  asteroids: [null, null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null, null, null,
              null, null, null, null, null, null, null, null],
  active_asteroids: 0,
  natural_asteroids: 18,
  const_natural_asteroids: 18,
  
  remainders: [null, null, null, null, null, null, null, null, null, null, null, null,null, null, null, null, null, null, null, null, null, null, null, null],
  const_remainder_prob: 0.5,
  luck_prob: 0.1,
  fuel_prob: 0.5,
  remainder_prob: 0.5,
  luck_prob: 0.1,
  fuel_prob: 0.5,

  objects: [null, null, null, null, null, null, null, null, null, null, null, null,null, null, null, null, null, null, null, null, null, null, null, null],
  active_objects: 0,
  
  pause: false,
  stage: null,
  jump: false,
  const_jump_asteroids: 10,

  set_jump: function(self) {
    self.jump = true;
    self.speed_step = self.speed_step_max;
    self.player.set_jump(self.player);
    self.background.set_jump(self.background);
    self.natural_asteroids = self.const_jump_asteroids;
  },

  unset_jump: function(self) {
    self.jump = false;
    self.speed_step = 0;
    self.player.unset_jump(self.player);
    self.background.unset_jump(self.background);
    self.natural_asteroids = self.const_natural_asteroids;
    self.unset_generate_asteroids(self);
    self.set_normal_speed(self);
  },

  add_object: function(self, object) {
    for (var i = 0; i < self.objects.length; i++) {
      if (self.objects[i] == null) {
        object.set_speed_step(object, self.speed_step);
        self.objects[i] = object;
        self.active_objects++;
        return i;
      }
    }
    return -1;
  },

  del_object: function(self, handle) {
    if (self.objects[handle] != null) {
      self.objects[handle] = null;
      self.active_objects--;
    }
  },

  set_remainder_prob: function(self, prob) {
    self.remainder_prob = prob;
  },

  set_fuel_prob: function(self, prob) {
    self.fuel_prob = prob;
  },

  set_luck_prob: function(self, prob) {
    self.luck_prob = prob;
  },

  reset_prob: function(self) {
    self.luck_prob = self.const_luck_prob;
    self.fuel_prob = self.const_fuel_prob;
    self.remainder_prob = self.const_remainder_prob;
  },

  try_destroy_asteroid: function(self, asteroid) {
    if (Math.random() < self.remainder_prob) { // have to leave remainders
      //console.log("leaving remainders");
      var fuel_rem = Math.floor(Math.random()*10*self.fuel_prob*(asteroid.size/asteroid.const_max_r.length));
      var ang = 0;
      var dist = 0;
      var so = 0;
      var co = 0;
      var rem = null;
      var rem_lst = [];

      if (Math.random()<self.luck_prob) {
        ang = Math.random()*Math.PI*2+Math.PI;
        dist = Math.random()*20;
        so = Math.sin(ang);
        co = Math.cos(ang);
        rem = new Remainder();
        rem.init(rem, asteroid.x+co*dist, asteroid.y+so*dist, ang, 1, asteroid.speed/5, so, co);
        rem.set_speed_step(rem, self.speed_step);
        rem_lst.push(rem);        
      }

      for (var i = 0; i < fuel_rem; i++) {
        ang = Math.random()*Math.PI*2;
        dist = Math.random()*20;
        so = Math.sin(ang);
        co = Math.cos(ang);
        rem = new Remainder();
        rem.init(rem, asteroid.x+co*dist, asteroid.y+so*dist, ang, 0, asteroid.speed/5, so, co);
        rem.set_speed_step(rem, self.speed_step);
        rem_lst.push(rem);
      }
      //console.log("remainders list");
      //console.log(rem_lst);

      for (var i = 0; i < self.remainders.length; i++) {
        if (self.remainders[i] == null) {
          if (rem_lst.length > 0) {
            self.remainders[i] = rem_lst[0];
            rem_lst.shift();
          } else {
            break;
          }
        }
      }
      //console.log(self.remainders);
    }
  },

  set_generate_asteroids: function(self) {
    self.generate_asteroids = true;
  },

  unset_generate_asteroids: function(self) {
    self.generate_asteroids = false;
  },

  set_pause: function(self) {
    self.pause = true;
    progress.set_pause(progress);
    hud.set_pause(hud);
    self.background.set_pause(self.background);
    self.player.set_pause(self.player);
    for (var i = 0; i < self.natural_asteroids; i++) {
      if (self.asteroids[i] != null) {
        self.asteroids[i].set_pause(self.asteroids[i]);
      }
    }
  },

  unset_pause: function(self) {
    self.pause = false;
    progress.unset_pause(progress);
    hud.unset_pause(hud);
    self.background.unset_pause(self.background);
    self.player.unset_pause(self.player);
    for (var i = 0; i < self.natural_asteroids; i++) {
      if (self.asteroids[i] != null) {
        self.asteroids[i].unset_pause(self.asteroids[i]);
      }
    }
  },

  keydown: function(self, event) {
    console.log("down");
    console.log(event);
    if (event.keyCode == 16) { // shift
      // if (hud.dec_fuel(hud)) {
      //   self.speed_step ++;
      //   progress.inc_speed(progress);
      //   self.background.inc_speed(self.background);
      //   self.player.inc_speed(self.player);
      //   for (var i = 0; i < self.natural_asteroids; i++) {
      //     if (self.asteroids[i] != null) {
      //       self.asteroids[i].inc_speed(self.asteroids[i]);
      //     }
      //   }
      // }
    }
    if (event.keyCode == 32) { // space
      if (! self.jump) {
        self.player.launch_torpedo(self.player, self.asteroids);
      }
    }
    if (event.keyCode == 65) { // a
      self.left = true;
    }
    if (event.keyCode == 68) { // d
      self.right = true;
    }
    if (event.keyCode == 37) { // left
      self.left = true;
    }
    if (event.keyCode == 39) { // right
      self.right = true;
    }

    self.stage.inject_keydown(self.stage, event.keyCode);
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
    if (event.keyCode == 37) { // left
      self.left = false;
    }
    if (event.keyCode == 39) { // right
      self.right = false;
    }

  },

  init: function(self) {
    self.natural_asteroids = Math.floor(18*gamescreen.width*gamescreen.height/(800*800));
    self.const_natural_asteroids = self.natural_asteroids;
    console.log("natural asteroids: "+self.natural_asteroids);
    self.player = new Player();
    self.player.init(self.player);
    self.background = new Background();
    self.background.init(self.background);
    self.stage = progress.init(progress);
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

  set_fast_speed: function(self) {
    self.speed_step = self.speed_step_max;
    //progress.set_normal_speed(progress);
    self.player.set_speed_step(self.player, self.speed_step);
    //self.background.set_speed_step(self.background, self.speed_step);
    for (var i = 0; i < self.asteroids.length; i++) {
      if (self.asteroids[i] != null) {
        self.asteroids[i].set_speed_step(self.asteroids[i], self.speed_step);
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
      }
      self.asteroids[idx] = nast;
      self.active_asteroids ++;
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
    if (pt_to_pt_dist([torpedo.x, torpedo.y], [asteroid.x, asteroid.y])<(asteroid.const_max_ast_r)) {
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

  gen_asteroids: function(self) {
    if (!self.pause && self.generate_asteroids) {
      if (self.next_ast_ctr <= 0) {
        // var ast = 0;
        // for (var i = 0; i < self.asteroids.length; i++) {
        //   if (self.asteroids[i] != null) {
        //     ast ++;
        //   }
        // }
        // self.active_asteroids = ast;
        //console.log(self.asteroids);
        if (self.active_asteroids < self.natural_asteroids) {
          for (var i = 0; i < self.asteroids.length; i++) {
            if (self.asteroids[i] == null) {
              self.active_asteroids ++;
              self.asteroids[i] = new Asteroid();
              if (self.jump) {
                self.asteroids[i].init(self.asteroids[i], 2, (Math.random()*0.2-0.1)*gamescreen.width+gamescreen.width/2);
              } else {
                self.asteroids[i].init(self.asteroids[i], 2);
              }
              self.asteroids[i].set_speed_step(self.asteroids[i], self.speed_step);
              break;
            }
          }
        }
        self.next_ast_ctr = Math.random()*self.const_ast_spawn_t;
      }
      //console.log(self.asteroids);
      self.next_ast_ctr --;
    }
  },

  ast_ast_col: function(self) {
    if (self.active_asteroids>0) {
      var n_ast = 0;
      for (var i = 0; i < self.asteroids.length; i++) {
        if (self.asteroids[i] != null) {
          n_ast ++;
          for (var j = i+1; j < self.asteroids.length; j++) {
            if (self.asteroids[j] != null) {
              if (self.check_asteroid_collision(self, i, j)) {
                break;
              }
            }
          }
        }
        if (n_ast >= self.active_asteroids) {
          break;
        }
      }
    }
  },

  collect_torpedos: function(self) {
    var torpedos = [self.player.get_torpedo(self.player)];
    var obj_cnt = 0;
    if (self.active_objects>0) {
      for (var i = 0; i < self.objects.length; i++) {
        var obj = self.objects[i];
        if (obj != null) {
          obj.draw(obj);
          obj_cnt ++;

          var obj_torpedos = obj.get_torpedos(obj);
          for (var j = 0; j < obj_torpedos.length; j++) {
            if (obj_torpedos[j] != null) {
              torpedos.push(obj_torpedos[j]);
            }
          }

        }
        if (obj_cnt >= self.active_objects) {
          break;
        }
      }
    }
    return torpedos;
  },

  create_ast_couple: function(self, x1, y1, x2, y2, a1, a2, s1, s2, size) {
    if (self.create_new_asteroid(self, false, x1, y1, size, a1, s1)) {
      // if we cant create first one, no need to try to create second
      self.create_new_asteroid(self, false, x2, y2, size, a2, s2);
    }
  },

  ast_tor_col: function(self, torpedos) {
    for (var j = 0; j < torpedos.length; j++) {
      var torpedo = torpedos[j];
      if (torpedo != null) {
        torpedo.draw(torpedo);
        if (self.active_asteroids>0) {
          var n_ast = 0;
          for (var i = 0; i < self.asteroids.length; i++) {
            if (self.asteroids[i] != null) {
              n_ast ++;
              if (self.check_torpedo_collision(self, torpedo, self.asteroids[i])) {
                torpedo.explode(torpedo);
                var sz = self.asteroids[i].get_size(self.asteroids[i]);
                if (sz > 3) {
                  var x = self.asteroids[i].x;
                  var y = self.asteroids[i].y;
                  var r = self.asteroids[i].const_max_ast_r;
                  var speed = self.asteroids[i].speed;
                  self.create_ast_couple(self, x-r, y, x+r, y, Math.PI, 0, speed, speed, 2);
                }
                self.try_destroy_asteroid(self, self.asteroids[i]);
                self.active_asteroids --;
                self.asteroids[i] = null;
                n_ast --;
                break;
              }
            }
            if (n_ast >= self.active_asteroids) {
              break;
            }
          }
        }
      }
    }
  },

  ast_pla_col: function(self) {
    if (self.active_asteroids>0) {
      var n_ast = 0;
      for (var i = 0; i < self.asteroids.length; i++) {
        var ast = self.asteroids[i];
        if (ast != null) {
          n_ast++;
          if (! gamescreen.circle_in_screen(gamescreen, ast.x, ast.y, ast.const_max_ast_r)) {
            ast.draw(ast);
            if (ast.check_ttl(ast)<0) {
              self.asteroids[i] = null;
              self.active_asteroids --;
              n_ast --;
            }
          } else {
            ast.draw(ast);
            if (self.check_player_collision(self, self.player, ast)) {
              if (ast.size <= 1) {
                hud.dec_less_luck(hud);
                self.asteroids[i] = null;
                self.active_asteroids --;
                n_ast --;
              }
              else if (ast.size==2) {
                hud.dec_luck(hud);
                self.create_ast_couple(self, ast.x-ast.const_max_ast_r*2, ast.y, ast.x+ast.const_max_ast_r*2, ast.y, Math.PI, 0, ast.speed, ast.speed, 1);
                self.asteroids[i] = null;
                self.active_asteroids --;
                n_ast ++;
              }
              else if (ast.size >= 3) {
                var direction = ((ast.x-ast.px) > 0 ? 1 : -1);
                self.player.vx += direction*ast.speed*10;
                self.asteroids[i] = null;
                self.active_asteroids --;
                n_ast ++;
                self.create_ast_couple(self, ast.x-ast.const_max_ast_r*2, ast.y, ast.x+ast.const_max_ast_r*2, ast.y, Math.PI, 0, ast.speed, ast.speed, 2);
                hud.dec_more_luck(hud);
              }
              if (hud.get_luck(hud) <= 0) {
                var max_rem = 20;
                self.player.explode(self.player);
                for (var j = 0; j < max_rem; j++) {
                  self.create_new_asteroid(self, false, self.player.x, self.player.y, 0, Math.random()*Math.PI*2, Math.random()*ast.speed*3);
                }
              }
            }
          }
        }
        if (n_ast >= self.active_asteroids) {
          break;
        }
      }
    }

  },

  rem_draw: function(self) {
    for (var i = 0; i < self.remainders.length; i++) {
      var rem = self.remainders[i];
      if (rem != null) {
        if (! gamescreen.circle_in_screen(gamescreen, rem.x, rem.y, rem.r)) {
          self.remainders[i] = null;
        } else {
          rem.draw(rem);
          var dist = pt_to_pt_dist([self.player.x, self.player.y], [rem.x, rem.y]);
          if (dist<self.player.grip_reach_dist) {
            hud.add_luck(hud, rem.luck);
            hud.add_fuel(hud, rem.fuel);
            self.remainders[i] = null;
          }
        }
      }
    }
  },

  draw: function(self) {
    self.stage.draw(self.stage);
    self.background.draw(self.background);
    self.gen_asteroids(self);
    self.ast_ast_col(self);

    var torpedos = self.collect_torpedos(self);
    self.ast_tor_col(self, torpedos);

    self.ast_pla_col(self);
    self.rem_draw(self);

    if (self.left) {
      self.player.move_left(self.player);
    }
    if (self.right) {
      self.player.move_right(self.player);
    }

    if (self.jump) {
      self.set_fast_speed(self);
      if (self.background.get_jump_started(self.background)) {
        self.set_generate_asteroids(self);
      }
    }
    self.player.draw(self.player);
    progress.draw(progress);
    if (progress.get_stage_complete(progress)) {
      progress.next_stage(progress);
    }
    hud.draw(hud);
  }
};

var gamelogic = new GameLogic();
