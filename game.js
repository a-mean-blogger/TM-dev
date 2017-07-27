console.log("game.js loaded");

var gameSetting={
  keyset:{
    QUIT:27, // esc key
    PAUSE:80, // "p";
  },
  tetris1:{
    keyset:{
      RIGHT:39,
      LEFT:37,
      ROTATE:38,
      DOWN:40,
      DROP:32, //space key
    }
  }
};

var game = {
  tbScreen: new tbCanvas.Screen(),
  programs: {},
  init: function(){
    this.destroy();
    this.programs.intro.init();
  },
  destroy: function(){
    for(let i in this.programs){
      let program = this.programs[i];
      program.destroy();
    }
  },
  changeProgram: function(program){
    this.destroy();
    program.init();
  }
};

game.programs.intro = new tbCanvas.Program(10,{x:5,y:3});
game.programs.intro.init = function(){
  this.initProgram();
};
game.programs.intro.timeline = function(){
  if(this.count ==  10) game.tbScreen.insertText(this.x,this.y+0, "■□□□■■■□□■■□□■■");
  if(this.count ==  20) game.tbScreen.insertText(this.x,this.y+1, "■■■□  ■□□    ■■□□■");
  if(this.count ==  30) game.tbScreen.insertText(this.x,this.y+2, "□□□■              □■  ■");
  if(this.count ==  40) game.tbScreen.insertText(this.x,this.y+3, "■■□■■  □  ■  □□■□□");
  if(this.count ==  50) game.tbScreen.insertText(this.x,this.y+4, "■■  ■□□□■■■□■■□□");
  if(this.count ==  60) game.tbScreen.insertText(this.x,this.y+5, "           www.A-MEAN-Blog.com");
  if(this.count ==  70) game.tbScreen.insertText(this.x+10,this.y+2, "T E T R I S");
  if(this.count ==  70){
    this.addToObjects(new Star(500,{x:this.x+8,y:this.y+1}));
    this.addToObjects(new Star(700,{x:this.x+26,y:this.y+2}));
    game.tbScreen.insertText(this.x,this.y+7, "Please Enter Any Key to Start..");
    game.tbScreen.insertText(this.x,this.y+9, "  △   : Shift");
    game.tbScreen.insertText(this.x,this.y+10,"◁  ▷ : Left / Right");
    game.tbScreen.insertText(this.x,this.y+11,"  ▽   : Soft Drop");
    game.tbScreen.insertText(this.x,this.y+12," SPACE : Hard Drop");
    game.tbScreen.insertText(this.x,this.y+13,"   P   : Pause");
    game.tbScreen.insertText(this.x,this.y+14,"  ESC  : Quit");
    game.tbScreen.insertText(this.x,this.y+16,"BONUS FOR HARD DROPS / COMBOS");
  }
};
game.programs.intro.getInput = function(){
  if(!tbCanvas.inputs.keyboard.check(gameSetting.keyset.QUIT) &&  tbCanvas.inputs.keyboard.checkAny()){
    game.changeProgram(game.programs.tetris);
  }
};
game.programs.intro.erase = function(){
  game.tbScreen.clearScreen();
};

game.programs.tetris = new tbCanvas.Program(10,{x:0,y:0});
game.programs.tetris.uniqueObjects = {
  status : undefined,
  player1Game : undefined
};
game.programs.tetris.init = function(){
  this.uniqueObjects.status = new Status({x:28,y:3});
  this.uniqueObjects.player1Game = new Tetris({x:3,y:1,keyset:gameSetting.tetris1.keyset},this.uniqueObjects.status);
  this.initProgram();
};
game.programs.tetris.getInput = function(){
  if(tbCanvas.inputs.keyboard.check(gameSetting.keyset.QUIT)){
    game.changeProgram(game.programs.intro);
  }
};
game.programs.tetris.erase = function(){
  game.tbScreen.clearScreen();
};

game.init();
