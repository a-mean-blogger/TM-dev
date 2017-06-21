console.log("game.js loaded");

var game = {};

game = {
  init: function(){
    this.destroy();
    this.intro.init();
  },
  destroy: function(){
    this.intro.destroy();
    this.tetris.destroy();
  }
}

game.intro= {
  x:5,
  y:3,
  objects:[],
  count:0,
  interval: new common.Interval(),
  loop: function(){
    this.timeline();
    this.count++;
    this.objects.forEach(object=> {
      object.loop();
    });
    this.calculate();
  },
  init: function(){
    // console.log("intro init");
    this.count = 0;
    base.canvas.init();
    this.interval.init(setting.env.fps, _=>this.loop());
  },
  calculate: function(){
    if(this.count>10 && base.inputs.keyboard.checkAny()){
      this.destroy();
      game.tetris.init();
    }
  },
  destroy: function(){
    this.interval.stop();
    this.objects = [];
  },
  timeline: function(){
    if(this.count ==  1) base.canvas.insertText(this.x,this.y+0, "■□□□■■■□□■■□□■■");
    if(this.count ==  2) base.canvas.insertText(this.x,this.y+1, "■■■□  ■□□    ■■□□■");
    if(this.count ==  3) base.canvas.insertText(this.x,this.y+2, "□□□■              □■  ■");
    if(this.count ==  4) base.canvas.insertText(this.x,this.y+3, "■■□■■  □  ■  □□■□□");
    if(this.count ==  5) base.canvas.insertText(this.x,this.y+4, "■■  ■□□□■■■□■■□□");
    if(this.count ==  6) base.canvas.insertText(this.x,this.y+5, "           www.A-MEAN-Blog.com");
    if(this.count ==  7) base.canvas.insertText(this.x+10,this.y+2, "T E T R I S");
    if(this.count ==  7){
      new Star(game.intro.objects,{x:this.x+8,y:this.y+1,speed:10});
      new Star(game.intro.objects,{x:this.x+26,y:this.y+2,speed:35});
      base.canvas.insertText(this.x,this.y+7, "Please Enter Any Key to Start..");
      base.canvas.insertText(this.x,this.y+9, "  △   : Shift");
      base.canvas.insertText(this.x,this.y+10,"◁  ▷ : Left / Right");
      base.canvas.insertText(this.x,this.y+11,"  ▽   : Soft Drop");
      base.canvas.insertText(this.x,this.y+12," SPACE : Hard Drop");
      base.canvas.insertText(this.x,this.y+13,"   P   : Pause");
      base.canvas.insertText(this.x,this.y+14,"  ESC  : Quit");
      base.canvas.insertText(this.x,this.y+16,"BONUS FOR HARD DROPS / COMBOS");
    }
  }
};

game.tetris = {
  x:5,
  y:3,
  speed: 10,
  speedCount: 0,
  objects:[],
  interval: new common.Interval(),
  loop: function(){
    this.count++;
    this.objects.forEach(object=> {
      object.loop();
    });
    this.calculate();
  },
  init: function(){
    // console.log("tetris init");
    base.canvas.init();
    this.status.drawFrame();
    new Tetris(this.objects,{x:3,y:1,keyset:setting.game.tetris1.keyset});
    this.interval.init(this.speed, _=>this.loop());
  },
  calculate: function(){
    if(base.inputs.keyboard.check(KEY_ESC)){
      this.destroy();
      game.intro.init();
    }
  },
  destroy: function(){
    this.interval.stop();
    this.objects = [];
  },
  status: {
    x:28,
    y:3,
    drawFrame:function(){
      base.canvas.insertText(this.x, this.y+0," LEVEL :");
      base.canvas.insertText(this.x, this.y+1," GOAL  :");
      base.canvas.insertText(this.x, this.y+2,"+-  N E X T  -+ ");
      base.canvas.insertText(this.x, this.y+3,"|             | ");
      base.canvas.insertText(this.x, this.y+4,"|             | ");
      base.canvas.insertText(this.x, this.y+5,"|             | ");
      base.canvas.insertText(this.x, this.y+6,"|             | ");
      base.canvas.insertText(this.x, this.y+7,"+-- -  -  - --+ ");
      base.canvas.insertText(this.x, this.y+8," YOUR SCORE :");
      // base.canvas.insertText(this.x, this.y+9,"        %6d", score);
      base.canvas.insertText(this.x, this.y+10," LAST SCORE :");
      // base.canvas.insertText(this.x, this.y+11,"        %6d", last_score);
      base.canvas.insertText(this.x, this.y+12," BEST SCORE :");
      // base.canvas.insertText(this.x, this.y+13,"        %6d", best_score);
      base.canvas.insertText(this.x, this.y+15,"  △   : Shift        SPACE : Hard Drop");
      base.canvas.insertText(this.x, this.y+16,"◁  ▷ : Left / Right   P   : Pause");
      base.canvas.insertText(this.x, this.y+17,"  ▽   : Soft Drop     ESC  : Quit");
      base.canvas.insertText(this.x, this.y+20,"www.A-MEAN-Blog.com");
    }
  }
}

game.init();
