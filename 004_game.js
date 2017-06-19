console.log("game.js loaded");

var game = {};

game = {
  init: function(){
    this.intro.init();
  },
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
    base.screen.init();
    this.interval.init(setting.env.fts, _=>this.loop());
  },
  calculate: function(){
    if(base.inputs.keyboard.checkAny()){
      this.destroy();
      // game.tetris.init();
    }
  },
  destroy: function(){
    this.interval.stop();
    this.objects = [];
  },
  timeline: function(){
    if(this.count ==  1) base.screen.insertText(this.x,this.y+0, "■□□□■■■□□■■□□■■");
    if(this.count ==  2) base.screen.insertText(this.x,this.y+1, "■■■□  ■□□    ■■□□■");
    if(this.count ==  3) base.screen.insertText(this.x,this.y+2, "□□□■              □■  ■");
    if(this.count ==  4) base.screen.insertText(this.x,this.y+3, "■■□■■  □  ■  □□■□□");
    if(this.count ==  5) base.screen.insertText(this.x,this.y+4, "■■  ■□□□■■■□■■□□");
    if(this.count ==  6) base.screen.insertText(this.x,this.y+5, "           www.A-MEAN-Blog.com");
    if(this.count ==  7) base.screen.insertText(this.x+10,this.y+2, "T E T R I S");
    if(this.count ==  7){
      new Star(game.intro.objects,{x:this.x+8,y:this.y+1,speed:10});
      new Star(game.intro.objects,{x:this.x+26,y:this.y+2,speed:35});
      base.screen.insertText(this.x,this.y+7,"Please Enter Any Key to Start..");
      base.screen.insertText(this.x,this.y+9,"  △   : Shift");
      base.screen.insertText(this.x,this.y+10,"◁  ▷ : Left / Right");
      base.screen.insertText(this.x,this.y+11,"  ▽   : Soft Drop");
      base.screen.insertText(this.x,this.y+12," SPACE : Hard Drop");
      base.screen.insertText(this.x,this.y+13,"   P   : Pause");
      base.screen.insertText(this.x,this.y+14,"  ESC  : Quit");
      base.screen.insertText(this.x,this.y+16,"BONUS FOR HARD DROPS / COMBOS");
    }
  }
};

game.init();
