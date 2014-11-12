function Tutorial_Stage() {};

Tutorial_Stage.prototype = {
  name: "Tutorial",
  stop_after_st_dis: 0,
  show_greet_msg: 1,
  wait_greet_msg: 2,
  show_controls_msg: 3,
  show_left_controls: 4,
  show_controls_ok: 5,
  show_right_controls: 6,
  show_controls_ok2: 7,
  show_accel_controls: 8,
  check_accel: 9,
  check_accel_ok: 10,
  show_mining_intro: 11,
  wait_mining_intro: 12,
  show_torpedo_controls: 13,
  check_torpedo_launch: 14,
  wait_grip: 15,
  show_grip_msg: 16,
  wait_grip_msg: 17,
  show_outro: 18,
  wait_outro: 19,
  wait_checkpoint: 20,
  show_jumpgate_msg: 21,

  checkpoint_progress: 900,

  state: 0,
  
  delay_ctr: 0,
  const_delay: 60,

  wait_keycode: 0,
  key_pressed: false,
  
  text_disp_ctr: 0,
  const_text_delay: 30,
  text_line: 0,
  
  msg_greet: ["Repair bot: Loading random greeting message ...",
              "    Mining industries corp. greets you!",
              "    Captain, this is your refurbished vessel.",
              "    It was upgraded to comply with latest industry standard.",
              "    You have to take this training program in order to get mining license."],

  msg_control: ["Repair bot: Loading basic control course ...",
                "    Your vessel is upgraded to be controlled with keyboard.",
                "    Try maneuvering left and right.",
                "    This may help you avoid asteroids in the future."],

  msg_accel: ["Repair bot: Also, the vessel now has 5-step acceleration engine",
              "    Every step takes 100 units of fuel to accelerate.",
              "    You have some fuel to try."],
  
  msg_mining: ["Repair bot: Loading basic mining course ...",
               "    As a part of refurbishment and update program,",
               "    the mining gun was replaced with mining torpedo.",
               "    It is a little bit smarter than a usual gun,",
               "    but dont count too much on that"],

  msg_torpedo: ["Repair bot: I will put an average asteroid on your course.",
                "    Use your torpedo to destroy it."],

  msg_grip: ["Repair bot: Loading grip training course ...",
             "    Error: grip is automatic, no training needed",
             "    Proceed"],

  msg_luck: ["Repair bot: Loading jump engine training course ...",
             "    Human brain is not well suited for space jumps.",
             "    Thats why industry standard assumes automating every task.",
             "    As a part of automation task, this vessel was equiped",
             "    with luck-driven jump engine.",
             "    So, captain, before jumping, make sure your luck supply is 100% full."],

  msg_outro: ["Repair bot: Loading final message ...",
              "    To end this training, get to the jump sight.",
              "    Mining industries corp. reminds you that your guarantee is over,",
              "    and you will have to pay for repair next time.",
              "    Updated license transfer ...",
              "    Updated license transefer complete",
              "Communication over."],

  msg_jumpgate: ["Jumpgate anti-asteroid protection system: Mining vessel identified", 
                 "    Anti-asteroid weapons disabled.",
                 "    Proceed to jumpgate"],

  torpedo_launchers: [null, null, null],
  tl_handlers: [0,0,0],

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
        self.set_wait_keycode(self, ch_s);
        //gamelogic.set_pause(gamelogic);
        self.state = self.show_greet_msg;
      }
      break;

    case self.show_greet_msg:
      if (self.get_wait_keycode_state(self)) {
        self.state = self.show_outro;
        break;
      }
      if (self.display_message_delay(self, self.msg_greet)) {
        self.state = self.wait_greet_msg;
        self.set_delay(self, self.const_delay);
      }
      break;

    case self.wait_greet_msg:
      self.display_message(self, self.msg_greet);
      if (self.get_delay(self)) {
        self.state = self.show_controls_msg;
      }
      break;

    case self.show_controls_msg:
      if (self.display_message_delay(self, self.msg_control)) {
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
      self.display_message(self, self.msg_control);
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
      self.display_message(self, self.msg_control);
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
      self.display_message(self, self.msg_control);
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
      self.display_message(self, self.msg_control);
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
        self.msg_accel.push("OK, proceed to asteroid smashing course.");
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
        self.state = self.show_grip_msg;
      }
      break;

    case self.show_grip_msg:
      if (self.display_message_delay(self, self.msg_grip)) {
        self.state = self.wait_grip_msg;
        self.set_delay(self, self.const_delay);
      }
      break;

    case self.wait_grip_msg:
      self.display_message(self, self.msg_grip);
      if (self.get_delay(self)) {
        self.state = self.show_outro;
      }
      break;

    case self.show_outro:
      if (self.display_message_delay(self, self.msg_outro)) {
        self.state = self.wait_outro;
        self.set_delay(self, self.const_delay);
      }
      break;
      
    case self.wait_outro:
      self.display_message(self, self.msg_outro);
      if (self.get_delay(self)) {
        self.state = self.wait_checkpoint;
        progress.set_count_progress(progress);
        progress.set_display_progress(progress);
        gamelogic.set_generate_asteroids(gamelogic);
      }
      break;

    case self.wait_checkpoint:
      if (progress.get_progress(progress)>self.checkpoint_progress) {
        self.state = self.show_jumpgate_msg;
        for (var i = 0; i < self.torpedo_launchers.length; i++) {
          console.log("creating turret");
          var t = new AATurret();
          t.init(t, gamescreen.width/2, 100, 0);
          self.torpedo_launchers[i] = t;
          self.tl_handlers[i] = gamelogic.add_object(gamelogic, t);
        }
      }
      break;

    case self.show_jumpgate_msg:
      if (self.display_message_delay(self, self.msg_jumpgate)) {
        self.state ++;
      }
      break;
      
    default: 
      break;
    }
  }
};

var tutorial_stage = new Tutorial_Stage();
