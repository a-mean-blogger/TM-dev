//debug object

var Timer = function(data){
  this.data = {
    x:undefined,
    y:undefined,
    text:undefined,
    time1: Date.now(),
    time2: null,
    aveTime: null,
    count: 0,
    countMax: 20,
  };
  TM.IObject.call(this, data);
}
Timer.prototype = Object.create(TM.IObject.prototype);
Timer.prototype.constructor = TM.Timer;

Timer.prototype.process = function(){
  if(++this.data.count>this.data.countMax){
    if(TMS){
      TMS.deleteTextAt(this.data.x,this.data.y,this.data.text+": "+this.data.aveTime);
    }
    this.data.count = 0;

    this.data.time2 = Date.now();
    this.data.aveTime = (this.data.time2 - this.data.time1)/(this.data.countMax+1);
    this.data.time1 = this.data.time2;

    if(TMS){
      TMS.insertTextAt(this.data.x,this.data.y,this.data.text+": "+this.data.aveTime);
    }
  }
};


tmsT = new Timer({x:0,y:0,text:"tmsT",countMax:20});
