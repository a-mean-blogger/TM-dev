console.log("game.js loaded");

var game = {};

game = {
  programs:{},
  init: function(){
    this.destroy();
    this.programs.intro.init();
  },
  destroy: function(){
    for(let i in this.programs){
      var program = this.programs[i];
      program.destroy();
    }
  }
}

function Program(properties){
  this.x = properties.x;
  this.y = properties.y;
  this.speed = properties.speed;
  this.objects = [];
  this.count = 0;
  this.interval = new common.Interval();
}
Program.prototype.timeline = function(){};
Program.prototype.calculate = function(){};
Program.prototype.loop = function(){
  this.calculate();
  this.timeline();
  this.count++;
  this.objects.forEach(object => object.loop());
};
Program.prototype.init = function(){
  this.objects = [];
  this.count = 0;
  base.canvas.clear();
  this.interval.init(this.speed, _=>this.loop());
};
Program.prototype.destroy = function(){
  this.interval.stop();
  this.objects = [];
}

game.programs.intro = new Program({x:5,y:3,speed:10});
game.programs.intro.timeline = function(){
  if(this.count ==  1) base.canvas.insertText(this.x,this.y+0, "■□□□■■■□□■■□□■■");
  if(this.count ==  2) base.canvas.insertText(this.x,this.y+1, "■■■□  ■□□    ■■□□■");
  if(this.count ==  3) base.canvas.insertText(this.x,this.y+2, "□□□■              □■  ■");
  if(this.count ==  4) base.canvas.insertText(this.x,this.y+3, "■■□■■  □  ■  □□■□□");
  if(this.count ==  5) base.canvas.insertText(this.x,this.y+4, "■■  ■□□□■■■□■■□□");
  if(this.count ==  6) base.canvas.insertText(this.x,this.y+5, "           www.A-MEAN-Blog.com");
  if(this.count ==  7) base.canvas.insertText(this.x+10,this.y+2, "T E T R I S");
  if(this.count ==  7){
    new Star(this,{x:this.x+8,y:this.y+1,speed:60});
    new Star(this,{x:this.x+26,y:this.y+2,speed:90});
    base.canvas.insertText(this.x,this.y+7, "Please Enter Any Key to Start..");
    base.canvas.insertText(this.x,this.y+9, "  △   : Shift");
    base.canvas.insertText(this.x,this.y+10,"◁  ▷ : Left / Right");
    base.canvas.insertText(this.x,this.y+11,"  ▽   : Soft Drop");
    base.canvas.insertText(this.x,this.y+12," SPACE : Hard Drop");
    base.canvas.insertText(this.x,this.y+13,"   P   : Pause");
    base.canvas.insertText(this.x,this.y+14,"  ESC  : Quit");
    base.canvas.insertText(this.x,this.y+16,"BONUS FOR HARD DROPS / COMBOS");
  }
};
game.programs.intro.calculate = function(){
  if(this.count>10 && base.inputs.keyboard.checkAny()){
    this.destroy();
    game.programs.tetris.init();
  }
},

game.programs.tetris = new Program({x:5,y:3,speed:10});

game.programs.tetris.timeline = function(){
  if(this.count ==  1){
    this.status.drawFrame();
    new Tetris(this,{x:3,y:1,keyset:setting.game.tetris1.keyset});
  }
};
game.programs.tetris.calculate = function(){
  if(base.inputs.keyboard.check(KEY_ESC)){
    this.destroy();
    game.intro.init();
  }
},

game.programs.tetris.status = {
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
    },
    drawNextBlock: function(blockType){
      for(var i=1;i<3;i++){
        for(var j=0;j<4;j++){
          if(BLOCKS[blockType][0][i][j]==1) {
            base.canvas.insertText(this.x+4+j*2,this.y+3+i,"■");
          }
          else {
            base.canvas.insertText(this.x+4+j*2,this.y+3+i," ");
          }
        }
      }
    },
    convertScore: function(score){
      var string = score.toString();
      var formatted = string.replace(/(\d)(?=(\d{3})+$)/g,'$1,');
      var offset = 10 - formatted.length;
      var padding = "";
      for(let i=offset;i>0;i--) padding+=" ";
      return padding+ formatted;
    },
    drawScore: function(score){
      base.canvas.insertText(this.x+7, this.y+9, this.convertScore(score));
    },
    drawLastScore: function(score){
      base.canvas.insertText(this.x+7, this.y+11, this.convertScore(score));
    },
    drawBestScore: function(score){
      base.canvas.insertText(this.x+7, this.y+13, this.convertScore(score));
    },
  };

game.init();
