function Torpedo() {};

Torpedo.prototype = {
  x: 0, // own coords
  y: 0,
  px: 0,
  py: 0,
  sx: 0,
  sy: 0,
  velocity: 10,
  orientation: 0,
  ttl: 10,
  dead: false,
  exploded: false,
  r: 10,
  name: "Anti-asteroid torpedo",
  const_max_ang_vel: 0.03,
  tx: 0, //target coords
  ty: 0,
  trail: null,
  trail_ctr: 0,
  const_trail_period: 2,
  const_trail_max_len: 10,
  asteroid_id: null,
  asteroids: null,
  speed_steps: [5, 10, 15, 20, 25],
  cur_speed_step: 0,
  y_addition: 0,

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
  },

  set_normal_speed: function(self) {
    self.speed_step = 0;
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
  },
  
  init: function(self, x, y, asteroids, orientation, max_ang_vel) {
    self.trail = [];
    self.const_max_ang_vel = self.const_max_ang_vel || max_ang_vel;
    self.orientation = orientation || -Math.PI/2;
    self.x = x;
    self.y = y;
    self.sx = x;
    self.sy = y;
    var min_dy = gamescreen.height*2;
    var idx = -1;
    for (var i = 0; i < asteroids.length; i++) {
      if (asteroids[i]!=null) {
        if (Math.abs(self.x - asteroids[i].x) < gamescreen.width/5) {
          var dy = self.y - asteroids[i].y;
          //console.log("dy:"+dy+" min_dy:"+min_dy);
          if (dy > gamescreen.height/10) {
            if (dy < min_dy) {
              min_dy = dy;
              idx = i;
            }
          }
        }
      }
    }
    if (idx == -1) {
      self.tx = self.x;
      self.ty = self.y-10000;
      return false;
    }
    self.asteroid_id = idx;
    self.tx = asteroids[idx].x;
    self.ty = asteroids[idx].y;
    return true;
  },

  is_dead: function(self) {
    return self.dead;
  },

  explode: function(self) {
    self.dead = true;
  },

  draw: function(self) {
    var asteroids = gamelogic.asteroids;
    //console.log(asteroids);
    //console.log("id:"+self.asteroid_id);
    self.y_addition+=self.speed_steps[self.cur_speed_step];
    var ast = asteroids[self.asteroid_id];
    if (ast!=null) {
      self.tx = ast.x;
      self.ty = ast.y;
    } else {
      self.tx = self.x;
      self.ty = self.y-10000;
      //console.log("missing target");
    }

    var target_dir = Math.atan2(self.ty-self.y, self.tx-self.x);
    var diff = target_dir-self.orientation;
    //console.log("delta:"+diff+", "+target_dir+", "+self.orientation);
    var abs_diff = Math.abs(diff);
    if (abs_diff>0.01) {
      var dec_direction = diff/abs_diff;
      var correction = diff;
      if (abs_diff > self.const_max_ang_vel) {
        correction = dec_direction*self.const_max_ang_vel;
      }
      //console.log("correcting");
      //console.log("orientation: "+self.orientation);
      //console.log("correction: "+correction);
      
      self.orientation += correction;
    }
    self.ttl--;
    if (self.ttl<0) {
      if (! gamescreen.circle_in_screen(gamescreen, self.x, self.y, 5)) {
        self.dead = true;
      }
    }
    self.px = self.x;
    self.py = self.y;
    self.y += Math.sin(self.orientation)*self.velocity;
    self.x += Math.cos(self.orientation)*self.velocity;
    gamescreen.put_triangle(gamescreen, "white", self.orientation+Math.PI/2, 1, self.x, self.y+self.y_addition, -3, 3, 0, -6, 3, 3);
    
    if (self.trail_ctr > self.const_trail_period) {
      self.trail.push([self.x, self.y]);
    }
    self.trail_ctr++;
    //console.log(self.trail);
    if (self.trail.length > 0) {
      if (self.trail.length > self.const_trail_max_len) {
        self.trail.shift();
      }
      gamescreen.put_multi_line(gamescreen, "white", 0, self.y_addition, 0, self.trail, 1);
    }
  }
};
