function Progress() {};

Progress.prototype = {
  stage: 0,
  stages: ["Tutorial", "Asteroids", "Rogue colonies", "Pulsars"],
  stage_name_display_counter: 0,
  const_stage_name_display_max: 120,
  progress_buffer: null,

  init: function(self) {
    self.stage_name_display_counter = self.const_stage_name_display_max;
    var width = 30;
    var height = gamescreen.height-100;

    self.progress_buffer = render_to_canvas(width, height, function(w,h,ctx) {
      put_rect(ctx, "black", 0, w/2, h/2, w, h);
      var margin = 2;
      for (var i = 0; i < self.stages.length; i++) {
        put_rect(ctx, "#082B3D", 0, w/2, h-(2*i+1)*h/(self.stages.length*2), w-margin*2, h/self.stages.length-margin*2);
      }
    });

  },

  next_stage: function(self) {
    self.stage++;
    if (self.stage > self.stages.length) {
      return false;
    }
    self.stage_name_display_counter = self.const_stage_name_display_max;
  },

  draw: function(self) {
    if (self.stage_name_display_counter > 0) {
      self.stage_name_display_counter --;
      var char_sz = 10;
      var text = "Stage "+(self.stage+1)+". "+self.stages[self.stage];
      var text_width = gamescreen.get_text_w(gamescreen, char_sz, text);

      gamescreen.put_text(gamescreen, "bold 20px Arial", "#aaaaaa", text, gamescreen.width/2-text_width/2, gamescreen.height/2-char_sz/2);
    } else {
      gamescreen.put_image(gamescreen, self.progress_buffer, gamescreen.width-30, 50);
    }
  }
};

progress = new Progress();
