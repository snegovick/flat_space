function Tutorial_Stage() {};

Tutorial_Stage.prototype = {
  name: "Tutorial",
  stop_after_st_dis: 0,
  show_greet_msg: 1,
  show_left_controls: 2,
  show_controls_ok: 3,
  show_right_controls: 4,
  show_controls_ok2: 5,
  show_accel_controls: 6,
  check_accel: 7,
  check_accel_ok: 8,
  show_mining_intro: 9,
  wait_mining_intro: 10,
  show_torpedo_controls: 11,
  check_torpedo_launch: 12,
  wait_grip: 13,
  state: 0,
  
  delay_ctr: 0,
  const_delay: 60,

  wait_keycode: 0,
  key_pressed: false,
  
  text_disp_ctr: 0,
  const_text_delay: 30,
  text_line: 0,

  msg_greet: ["Repair bot: Ok, captain, this is your refurbished vessel.",
             "    It is upgraded to be controlled with keyboard.",
             "    Try maneuvering left and right.",
             "    This may help you avoid asteroids in the future."],

  msg_accel: ["Repair bot: Also, the vessel now has 5-step acceleration engine",
             "    Every step takes 100 units of fuel to accelerate.",
             "    You have some fuel to try."],

  msg_mining: ["Repair bot: As a part of refurbishment and update program,",
               "    the mining gun was replaced with mining torpedo.",
               "    It is a little bit smarter than a usual gun,",
               "    but dont count too much on that"],

  msg_torpedo: ["Repair bot: I will put an average asteroid on your course.",
               "    Use your torpedo to destroy it."],

  get_name: function(self) {
    return self.name;
  },

  init: function(self) {
  },

  display_message_delay: function(self, message) {
    var tx = gamescreen.width/10;
    var ty = gamescreen.height/10;
    
    for (var i = 0; i < self.text_line; i++) {
      gamescreen.put_text(gamescreen, "bold 20px Arial", "white", message[i], tx, ty+i*20);
    }
    if (self.text_disp_ctr > self.const_text_delay) {
      self.text_line++;
      self.text_disp_ctr = 0;
    }
    self.text_disp_ctr ++;
    if (self.text_line>message.length) {
      self.text_line = 0;
      return true;
    }
    return false;
  },

  display_message: function(self, message) {
    var tx = gamescreen.width/10;
    var ty = gamescreen.height/10;
    
    for (var i = 0; i < message.length; i++) {
      gamescreen.put_text(gamescreen, "bold 20px Arial", "white", message[i], tx, ty+i*20);
    }
    return true;
  },

  set_wait_keycode: function(self, keycode) {
    self.key_pressed = false;
    self.wait_keycode = keycode;
  },

  inject_keydown: function(self, keycode) {
    if (keycode == self.wait_keycode) {
      self.key_pressed = true;
    }
  },

  get_wait_keycode_state: function(self) {
    if (self.key_pressed) {
      self.wait_keycode = 0;
      self.key_pressed = false;
      return true;
    }
    return false;
  },

  set_delay: function(self, t) {
    self.delay_ctr = t;
  },

  get_delay: function(self) {
    self.delay_ctr --;
    if (self.delay_ctr <= 0) {
      return true;
    }
    return false;
  },

  draw: function(self) {
    switch (self.state) {
      case self.stop_after_st_dis:
      if (progress.is_stage_display_done(progress)) {
        //gamelogic.set_pause(gamelogic);
        self.state = self.show_greet_msg;
      }
      break;

      case self.show_greet_msg:
      if (self.display_message_delay(self, self.msg_greet)) {
        self.state = self.show_left_controls;
        self.msg_greet.push("Press A");
        self.set_wait_keycode(self, 65); // a
        gamelogic.unset_pause(gamelogic);
      }
      break;

      case self.show_left_controls:
      var player = gamelogic.player;
      var off = player.r*2;
      var l = 50;
      self.display_message(self, self.msg_greet);
      gamescreen.put_arrow(gamescreen, "white", player.x-off, player.y, Math.PI, l, 1);
      gamescreen.put_text(gamescreen, "bold 20px Arial", "white", "A", player.x-off-l/2, player.y+30);
      if (self.get_wait_keycode_state(self)) {
        self.state = self.show_controls_ok;
        self.msg_greet.pop();
        self.msg_greet.push("OK, thats it");
        self.set_delay(self, self.const_delay);
      }
      break;

      case self.show_controls_ok:
      self.display_message(self, self.msg_greet);
      if (self.get_delay(self)) {
        self.msg_greet.pop();
        self.msg_greet.push("Press D");
        self.state = self.show_right_controls;
        self.set_wait_keycode(self, 68); // d
      }
      break;

      case self.show_right_controls:
      var player = gamelogic.player;
      var off = player.r*2;
      var l = 50;
      self.display_message(self, self.msg_greet);
      gamescreen.put_arrow(gamescreen, "white", player.x+off, player.y, 0, l, 1);
      gamescreen.put_text(gamescreen, "bold 20px Arial", "white", "D", player.x+off+l/2-10, player.y+30);
      if (self.get_wait_keycode_state(self)) {
        self.msg_greet.pop();
        self.msg_greet.push("OK, thats it");
        self.state = self.show_controls_ok2;
        self.set_delay(self, self.const_delay);
      }
      break;

      case self.show_controls_ok2:
      self.display_message(self, self.msg_greet);
      if (self.get_delay(self)) {
        self.msg_greet.pop();
        self.state = self.show_accel_controls;
        hud.set_display(hud);
      }
      break;

      case self.show_accel_controls:
      if (self.display_message_delay(self, self.msg_accel)) {
        hud.set_fuel_level(hud, 100);
        self.state = self.check_accel;
        self.set_wait_keycode(self, 16); // shift
        self.msg_accel.push("Press SHIFT");
      }
      break;

      case self.check_accel:
      var player = gamelogic.player;
      var off = player.r*2;
      var l = 50;
      self.display_message(self, self.msg_accel);
      gamescreen.put_arrow(gamescreen, "white", player.x, player.y-off, -Math.PI/2, l, 1);
      gamescreen.put_text(gamescreen, "bold 20px Arial", "white", "SHIFT", player.x+30, player.y-off-l/2);

      if (self.get_wait_keycode_state(self)) {
        self.msg_accel.pop();
        self.msg_accel.push("OK, proceed to asteroid smashing program.");
        self.state = self.check_accel_ok;
        self.set_delay(self, self.const_delay);
      }
      break;

      case self.check_accel_ok:
      self.display_message(self, self.msg_accel);
      if (self.get_delay(self)) {
        gamelogic.set_normal_speed(gamelogic);
        self.msg_accel.pop();
        self.state = self.show_mining_intro;
      }
      break;

      case self.show_mining_intro:
      if (self.display_message_delay(self, self.msg_mining)) {
        self.state = self.wait_mining_intro;
        self.set_delay(self, self.const_delay);
      }
      break;

      case self.wait_mining_intro:
      self.display_message(self, self.msg_mining);
      if (self.get_delay(self)) {
        self.state = self.show_torpedo_controls;
      }
      break;
      
      case self.show_torpedo_controls:
      if (self.display_message_delay(self, self.msg_torpedo)) {
        var player = gamelogic.player;
        var off = player.r*2;
        self.state = self.check_torpedo_launch;
        gamelogic.set_remainder_prob(gamelogic, 1);
        gamelogic.set_luck_prob(gamelogic, 1);
        gamelogic.create_new_asteroid(gamelogic, false, player.x, player.y-gamescreen.height/5, 2, Math.PI/2, -5);
        self.msg_torpedo.push("Press SPACE");
        self.set_wait_keycode(self, 32); // space
      }
      break;

      case self.check_torpedo_launch:
      self.display_message(self, self.msg_torpedo);
      if (self.get_wait_keycode_state(self)) {
        self.msg_torpedo.pop();
        self.msg_torpedo.push("OK, now collect remainders.");
        self.state = self.wait_grip;
        self.set_delay(self, self.const_delay);
      }
      break;

      case self.wait_grip:
      self.display_message(self, self.msg_torpedo);
      if (self.get_delay(self)) {
        self.msg_torpedo.pop();
        self.state ++;
      }
      break;


      default: 
      break;
    }
  }
};

var tutorial_stage = new Tutorial_Stage();
