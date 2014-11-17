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
  wait_turret_place: 20,
  wait_checkpoint: 21,
  show_jumpgate_msg: 22,
  wait_jumpgate_msg: 23,
  start_jump: 24,
  wait_jump: 25,
  game_win: 26,
  wait_input: 27,

  jump_ctr: 0,
  jump_ctr_max: 1000,

  turret_progress: 100,

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
              "    Now collect enough fuel and jump home!",
              "Communication over."],

  msg_jumpgate: ["Jumpgate anti-asteroid protection system: Mining vessel identified", 
                 "    Proceed to jumpgate"],

  msg_win: ["You are finally home!",
           "    Press SPACE to start again."],

  msg_fail: ["Oops looks like you will need new vessel!",
           "    Press SPACE to start again."],


  last_msg: 0,

  torpedo_launchers: [null, null, null],
  tl_handlers: [0,0,0],

  reset_all: function(self) {
    hud.reset_fuel(hud);
    hud.reset_luck(hud);
    gamelogic.unset_jump(gamelogic);
    progress.set_display_progress(progress);
    gamelogic.set_generate_asteroids(gamelogic);
    gamelogic.set_remainder_prob(gamelogic, 1);
    gamelogic.set_fuel_prob(gamelogic, 1);
    gamelogic.set_luck_prob(gamelogic, 1);
  },

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
    if (hud.get_luck(hud)<=0 && ((self.state != self.game_fail) && (self.state != self.wait_input))) {
      self.state = self.game_fail;
    }
    switch (self.state) {
    case self.stop_after_st_dis:
      if (progress.is_stage_display_done(progress)) {
        gamelogic.player.reset(gamelogic.player);
        self.set_wait_keycode(self, ch_j);
        //gamelogic.set_pause(gamelogic);
        self.state = self.show_greet_msg;
        self.set_delay(self, self.const_delay);
        gamelogic.unset_generate_asteroids(gamelogic);
      }
      break;

    case self.show_greet_msg:
      if (self.get_wait_keycode_state(self)) {
        self.state = self.start_jump;
        break;
      }
      if (self.get_delay(self)) {
        self.state = self.show_torpedo_controls;
      }
      break;

    case self.show_torpedo_controls:
      var player = gamelogic.player;
      var off = player.r*2;
      self.state = self.check_torpedo_launch;
      gamelogic.set_remainder_prob(gamelogic, 1);
      gamelogic.set_fuel_prob(gamelogic, 1);
      gamelogic.set_luck_prob(gamelogic, 1);
      gamelogic.create_new_asteroid(gamelogic, false, player.x, player.y-gamescreen.height/5, 2, Math.PI/2, -5);
      self.msg_torpedo.push("Press SPACE");
      self.set_wait_keycode(self, 32); // space
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
        self.state = self.wait_turret_place;
        progress.set_count_progress(progress);
        progress.set_display_progress(progress);
        hud.set_display(hud);
        gamelogic.set_generate_asteroids(gamelogic);
      }
      break;

    case self.wait_turret_place:
      if (hud.get_fuel(hud)>=self.turret_progress) {
        self.set_delay(self, self.const_delay);
        self.state = self.wait_checkpoint;
        var x_pos = gamescreen.width/4;
        for (var i = 0; i < self.torpedo_launchers.length; i++) {
          console.log("creating turret");
          var t = new AATurret();
          t.init(t, x_pos, -100, -Math.PI/2);
          x_pos+=gamescreen.width/4;
          self.torpedo_launchers[i] = t;
          self.tl_handlers[i] = gamelogic.add_object(gamelogic, t);
        }
      }
      break;

    case self.wait_checkpoint:
      if (self.get_delay(self)) {
        gamelogic.unset_generate_asteroids(gamelogic);
        self.state = self.show_jumpgate_msg;
      }
      break;

    case self.show_jumpgate_msg:
      if (self.display_message_delay(self, self.msg_jumpgate)) {
        self.set_delay(self, self.const_delay);
        self.state = self.wait_jumpgate_msg;
      }
      break;

    case self.wait_jumpgate_msg:
      self.display_message(self, self.msg_jumpgate);
      if (self.get_delay(self)) {
        self.state = self.start_jump;
      }
      break;

    case self.start_jump:
      gamelogic.set_jump(gamelogic);
      console.log("start jump");
      self.jump_ctr = self.jump_ctr_max;
      console.log("jump ctr:"+self.jump_ctr);
      self.state = self.wait_jump;
      progress.unset_count_progress(progress);
      progress.unset_display_progress(progress);
      hud.set_display(hud);
      break;

    case self.wait_jump:
      if (gamelogic.background.get_jump_started(gamelogic.background)) {
        if (Math.abs(gamelogic.player.vx)>gamescreen.width*gamelogic.background.const_b_max) {
          console.log("premature jump abort");
          self.state = self.wait_turret_place;
          self.reset_all(self);
        }

        self.jump_ctr --;
        if (self.jump_ctr < 0) {
          gamelogic.unset_jump(gamelogic);
          self.state = self.game_win;
          console.log("game over next there");
        }
      }
      break;
    case self.game_win:
      if (self.display_message_delay(self, self.msg_win)) {
        self.last_msg = self.msg_win;
        self.set_wait_keycode(self, 32); // space
        self.state = self.wait_input;
      }
      break;

    case self.game_fail:
      gamelogic.unset_generate_asteroids(gamelogic);
      if (self.display_message_delay(self, self.msg_fail)) {
        self.last_msg = self.msg_fail;
        self.set_wait_keycode(self, 32); // space
        self.state = self.wait_input;
      }
      break;

    case self.wait_input:
      self.display_message(self, self.last_msg);
      if (self.get_wait_keycode_state(self)) {
        self.state = self.stop_after_st_dis;
        self.reset_all(self);
      }
      break;
      
    default: 
      break;
    }
  }
};

var tutorial_stage = new Tutorial_Stage();
