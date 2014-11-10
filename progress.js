function Progress() {};

Progress.prototype = {
  stage: 0,
  stage_name_display_counter: 0,
  const_stage_name_display_max: 120,
  progress_buffer: null,
  stage_lengths: [1000, 10000, 10000, 10000],
  stages: [tutorial_stage],
  increment: 0,
  cur_speed_step: 0,
  speed_steps: [1, 2, 3, 4, 5],
  stage_progress: 0,
  width: 30,
  height: 0,
  xoff: 0,
  yoff: 50,
  margin: 1,
  stage_complete: false,
  pause: false,
  count_progress: false,
  display: false,

  set_pause: function(self) {
    self.pause = true;
  },

  unset_pause: function(self) {
    self.pause = false;
  },

  init: function(self) {
    self.xoff = gamescreen.width-50;
    self.stage_name_display_counter = self.const_stage_name_display_max;
    self.width = 30;
    self.height = gamescreen.height-self.yoff*2;

    self.progress_buffer = render_to_canvas(self.width, self.height, function(w,h,ctx) {
      put_rect(ctx, "white", 0, w/2, h/2, w, h);
      self.margin = 2;
      for (var i = 0; i < self.stages.length; i++) {
        put_rect(ctx, "#082B3D", 0, w/2, h-(2*i+1)*h/(self.stages.length*2), w-self.margin, h/self.stages.length-self.margin*2);
      }
    });
    self.set_normal_speed(self);
    self.stages[self.stage].init(self.stages[self.stage]);
    return self.stages[self.stage];
  },

  get_stage_complete: function(self) {
    return self.stage_complete;
  },

  set_speed_step: function(self, step) {
    self.cur_speed_step = step;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.increment = self.speed_steps[self.cur_speed_step];    
  },

  set_normal_speed: function(self) {
    self.increment = self.speed_steps[0];
  },

  inc_speed: function(self) {
    self.cur_speed_step ++;
    if (self.cur_speed_step >= self.speed_steps.length) {
      self.cur_speed_step = self.speed_steps.length - 1;
    }
    self.increment = self.speed_steps[self.cur_speed_step];
  },


  next_stage: function(self) {
    self.stage_complete = false;
    self.stage++;
    self.stage_progress = 0;
    if (self.stage > self.stages.length) {
      return false;
    }
    self.stage_name_display_counter = self.const_stage_name_display_max;
  },

  is_stage_display_done: function(self) {
    if (self.stage_name_display_counter>0) {
      return false;
    }
    return true;
  },

  unset_count_progress: function(self) {
    self.count_progress = false;
  },

  set_count_progress: function(self) {
    self.count_progress = true;
  },
  
  set_display_progress: function(self) {
    self.display = true;
  },

  unset_display_progress: function(self) {
    self.display = false;
  },

  draw: function(self) {
    if (self.stage_name_display_counter > 0) {
      if (! self.pause) {
        self.stage_name_display_counter --;
        if (self.stage_progress > self.stage_lengths[self.stage]) {
          self.stage_complete = true;
          self.stage_progress = self.stage_lengths[self.stage];
        }
      }

      var char_sz = 10;
      var text = "Stage "+(self.stage+1)+". "+self.stages[self.stage].get_name(self.stages[self.stage]);
      var text_width = gamescreen.get_text_w(gamescreen, char_sz, text);

      gamescreen.put_text(gamescreen, "bold 20px Arial", "#aaaaaa", text, gamescreen.width/2-text_width/2, gamescreen.height/2-char_sz/2);
    }
    if (self.count_progress) {
      if (! self.pause) {
        self.stage_progress += self.increment;
      }
    }
    if (self.display) {
      gamescreen.put_image(gamescreen, self.progress_buffer, self.xoff, self.yoff);
      var single_stage_len_px = self.height/self.stages.length;
      var stage_progress_px = self.stage_progress/self.stage_lengths[self.stage];
      
      var current_pos = gamescreen.height-((self.stage+stage_progress_px)*single_stage_len_px+self.yoff);
      gamescreen.put_rect(gamescreen, "white", 0, self.xoff+self.width/2, current_pos-self.margin, 2, 2);
    }
  }
};

progress = new Progress();
