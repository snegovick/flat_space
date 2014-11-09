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
  current_increment: 1,
  layer1_xoffset: 0,
  
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

  draw: function(self) {
    self.start_counter1 += self.current_increment;
    self.start_counter1 %= self.layer1.length;
    self.frame_counter1 = 0;
    self.start_counter2 += self.current_increment;
    self.start_counter2 %= self.layer2.length;
    self.frame_counter2 = 0;

    self.frame_counter1++;
    self.frame_counter2++;

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

