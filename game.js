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
game.programs.intro.timeline = function(){
  if(this.count ==  10) game.tbScreen.insertText(this.data.x,this.data.y+0, "■□□□■■■□□■■□□■■");
  if(this.count ==  20) game.tbScreen.insertText(this.data.x,this.data.y+1, "■■■□  ■□□    ■■□□■");
  if(this.count ==  30) game.tbScreen.insertText(this.data.x,this.data.y+2, "□□□■              □■  ■");
  if(this.count ==  40) game.tbScreen.insertText(this.data.x,this.data.y+3, "■■□■■  □  ■  □□■□□");
  if(this.count ==  50) game.tbScreen.insertText(this.data.x,this.data.y+4, "■■  ■□□□■■■□■■□□");
  if(this.count ==  60) game.tbScreen.insertText(this.data.x,this.data.y+5, "           www.A-MEAN-Blog.com");
  if(this.count ==  70) game.tbScreen.insertText(this.data.x+10,this.data.y+2, "T E T R I S");
  if(this.count ==  70){
    this.addToObjects(new Star(500,{x:this.data.x+8,y:this.data.y+1}));
    this.addToObjects(new Star(700,{x:this.data.x+26,y:this.data.y+2}));
    game.tbScreen.insertText(this.data.x,this.data.y+7, "Please Enter Any Key to Start..");
    game.tbScreen.insertText(this.data.x,this.data.y+9, "  △   : Shift");
    game.tbScreen.insertText(this.data.x,this.data.y+10,"◁  ▷ : Left / Right");
    game.tbScreen.insertText(this.data.x,this.data.y+11,"  ▽   : Soft Drop");
    game.tbScreen.insertText(this.data.x,this.data.y+12," SPACE : Hard Drop");
    game.tbScreen.insertText(this.data.x,this.data.y+13,"   P   : Pause");
    game.tbScreen.insertText(this.data.x,this.data.y+14,"  ESC  : Quit");
    game.tbScreen.insertText(this.data.x,this.data.y+16,"BONUS FOR HARD DROPS / COMBOS");
  }
};
game.programs.intro.getInput = function(){
  if(!tbCanvas.inputs.keyboard.checkKeyPressed(gameSetting.keyset.QUIT) &&  tbCanvas.inputs.keyboard.checkKeyPressedAny()){
    game.changeProgram(game.programs.tetris);
  }
};
game.programs.intro._destroy = function(){
  game.tbScreen.clearScreen();
};

game.programs.tetris = new tbCanvas.Program(10,{isPaused:false});
game.programs.tetris.uniqueObjects = {
  status : undefined,
  player1Game : undefined
};
game.programs.tetris._init = function(){
  if(!this.uniqueObjects.status) this.uniqueObjects.status = new Status({x:28,y:3});
  this.uniqueObjects.player1Game = new Tetris({x:3,y:1,keyset:gameSetting.tetris1.keyset},this.uniqueObjects.status);
};
game.programs.tetris.getInput = function(){
  if(tbCanvas.inputs.keyboard.checkKeyPressed(gameSetting.keyset.QUIT)){
    game.changeProgram(game.programs.intro);
  }
  if(!this.data.isPaused && tbCanvas.inputs.keyboard.checkKeyPressed(gameSetting.keyset.PAUSE)){
    this.uniqueObjects.player1Game.interval.stop();
    this.data.isPaused = true;
    this.data.pausedScreen = game.tbScreen.copyScreen();
    game.tbScreen.fillScreen(" ", null, "rgba(255,255,255,0.4)");
  }
  if(this.data.isPaused && tbCanvas.inputs.keyboard.checkKeyPressed(gameSetting.keyset.PAUSE)){
    this.uniqueObjects.player1Game.interval.start();
    this.data.isPaused = false;
    game.tbScreen.pasteScreen(this.data.pausedScreen);
  }
};
game.programs.tetris._destroy = function(){
  game.tbScreen.clearScreen();
  tbCanvas.inputs.keyboard.clearKeyPressed();
};

game.init();
