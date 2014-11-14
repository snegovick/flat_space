function Background() {};

Background.prototype = {
  start_counter1: 0,
  start_counter2: 0,
  size1: 5,
  size2: 3,
  layer1: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  layer2: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  const_layer1_color: "#999999",
  const_layer2_color: "#777777",
  speed_steps: [1, 2, 3, 4, 5],
  cur_speed_step: 0,
  const_normal_inc1: 1,
  const_normal_inc2: 1,
  const_max_inc1: 5,
  const_max_inc2: 5,
  current_increment1: 1,
  current_increment2: 1,
  layer1_xoffset: 0,
  pause: false,

  jump: false,
  jump_anim_ctr: 0,
  const_jump_start_ctr: 240,
  const_b_max: 0.2,

  set_jump: function(self) {
    self.jump = true;
    self.jump_start_ctr = 0;
  },

  unset_jump: function(self) {
    self.jump = false;
    self.jump_anim_ctr = 0;
  },

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
    self.current_increment = self.speed_steps[self.cur_speed_step];
  },

  set_x_offset: function(self, offset){
    self.layer1_xoffset = offset;
  },
  
  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.current_increment = self.speed_steps[self.cur_speed_step];
  },

  set_normal_speed: function(self) {
    self.current_increment = self.speed_steps[0];
    self.cur_speed_step = 0;
  },

  draw_normal: function(self) {
    var y = gamescreen.height;
    for (var i = self.start_counter2; i < self.layer2.length; i++) {
      if (self.layer2[i] != 0) {
          gamescreen.put_rect(gamescreen, self.const_layer2_color, 0, self.layer2[i], y, self.size2, self.size2);
      }
      y-=gamescreen.height/self.layer2.length;
    }
    for (var i = 0; i < self.start_counter2; i++) {
      if (self.layer2[i] != 0) {
        gamescreen.put_rect(gamescreen, self.const_layer2_color, 0, self.layer2[i], y, self.size2, self.size2);
      }
      y-=gamescreen.height/self.layer2.length;
    }

    y = gamescreen.height;
    for (var i = self.start_counter1; i < self.layer1.length; i++) {
      if (self.layer1[i] != 0) {
        gamescreen.put_rect(gamescreen, self.const_layer1_color, 0, self.layer1[i]+self.layer1_xoffset, y, self.size1, self.size1);
      }
      y-=gamescreen.height/self.layer1.length;
    }
    for (var i = 0; i < self.start_counter1; i++) {
      if (self.layer1[i] != 0) {
        gamescreen.put_rect(gamescreen, self.const_layer1_color, 0, self.layer1[i]+self.layer1_xoffset, y, self.size1, self.size1);
      }
      y-=gamescreen.height/self.layer1.length;
    }
  },

  draw_jump: function(self) {
    var c = self.jump_anim_ctr/self.const_jump_start_ctr;
    self.current_increment1 = Math.floor(2*c*self.const_max_inc1+1);
    self.current_increment2 = Math.floor(2*c*self.const_max_inc2+1);
    var l2_xsz = self.size2;
    var l1_xsz = self.size1;
    var l2_ysz = self.size2*15*c;
    var l1_ysz = self.size1*10*c;
    var w_2 = gamescreen.width/2;
    var b = 2*w_2*self.const_b_max;
    var k = (w_2 - b)/w_2;

    if (self.jump_anim_ctr < self.const_jump_start_ctr) {
      
      b = b * c;
      k = (w_2 - b)/w_2;
      self.jump_anim_ctr ++;
      console.log("jump anim:"+self.jump_anim_ctr+" b:"+b, " k:"+k);
    }
   

    var y = gamescreen.height;
    for (var i = self.start_counter2; i < self.layer2.length; i++) {
      if (self.layer2[i] != 0) {
        var x = self.layer2[i];
        gamescreen.put_rect(gamescreen, self.const_layer2_color, 0, ( x > w_2 ? (k*(x-w_2)+b)+w_2 : (k*(x-w_2)-b)+w_2), y, l2_xsz, l2_ysz);
      }
      y-=gamescreen.height/self.layer2.length;
    }
    for (var i = 0; i < self.start_counter2; i++) {
      if (self.layer2[i] != 0) {
        var x = self.layer2[i];
        gamescreen.put_rect(gamescreen, self.const_layer2_color, 0, ( x > w_2 ? (k*(x-w_2)+b)+w_2 : (k*(x-w_2)-b)+w_2), y, l2_xsz, l2_ysz);
      }
      y-=gamescreen.height/self.layer2.length;
    }

    y = gamescreen.height;
    for (var i = self.start_counter1; i < self.layer1.length; i++) {
      if (self.layer1[i] != 0) {
        var x = self.layer1[i];
        gamescreen.put_rect(gamescreen, self.const_layer1_color, 0, ( x > w_2 ? (k*(x-w_2)+b)+w_2 : (k*(x-w_2)-b)+w_2), y, l1_xsz, l1_ysz);
      }
      y-=gamescreen.height/self.layer1.length;
    }
    for (var i = 0; i < self.start_counter1; i++) {
      if (self.layer1[i] != 0) {
        var x = self.layer1[i];
        gamescreen.put_rect(gamescreen, self.const_layer1_color, 0, ( x > w_2 ? (k*(x-w_2)+b)+w_2 : (k*(x-w_2)-b)+w_2), y, l1_xsz, l1_ysz);
      }
      y-=gamescreen.height/self.layer1.length;
    }
  },

  draw: function(self) {
    if (! self.pause) {
      self.start_counter1 += self.current_increment1;
      self.start_counter1 %= self.layer1.length;
      self.start_counter2 += self.current_increment2;
      self.start_counter2 %= self.layer2.length;
    }

    if (self.jump) {
      self.draw_jump(self);
    } else {
      self.draw_normal(self);
    }

  },
  init: function(self) {
    //randomly fill background
    for (var i = 0; i < self.layer1.length; i++) {
      var rand = Math.random()*3;
      if (rand/2 < 1) {
        var x = rand*gamescreen.width;
        self.layer1[i] = x;
      }
    }
    for (var i = 0; i < self.layer2.length; i++) {
      var rand = Math.random()*5;
      if (rand/2 < 1) {
        var x = Math.random()*gamescreen.width;
        self.layer2[i] = x;
      }
    }

    console.log(self.layer2);
  }
};

