console.log('text-canvas-5-debug-manager.js loaded');

// DebugManager
TC.DebugManager = function(debugSetting){
  this.debugSetting = TC.common.mergeObjects(TC.defaultSettings.debug, debugSetting);

  try{
    this.outputDom = document.querySelector('#'+this.debugSetting.outputDomId);
    if(!this.outputDom){
      throw('[#'+this.debugSetting.outputDomId+'] does not exist! ');
    }
  }
  catch(errorMessage){
    this.isActive = false;
    console.error('new TC.DebugManager ERROR: '+errorMessage+' TC.DebugManager is not created.');
    return;
  }

  this.tasks = {};
  TC.Object.call(this);
};
TC.DebugManager.prototype = Object.create(TC.Object.prototype);
TC.DebugManager.prototype.constructor = TC.DebugManager;

TC.DebugManager.prototype.destroy = function(){
  this.removeTaskAll();
  TC.Object.prototype.destroy.call(this);
};
TC.DebugManager.prototype.addTask = function(taskName, data, calculate){
  this.removeTask(taskName);
  this.tasks[taskName] = new TC.DebugManager_Task(this, taskName, data, calculate);
};
TC.DebugManager.prototype.removeTask = function(taskName){
  if(this.tasks[taskName]){
    this.tasks[taskName].destroy();
  }
};
TC.DebugManager.prototype.removeTaskAll = function(){
  for(var task in this.tasks){
    this.tasks[task].destroy();
  }
};

// DebugManager_Task
TC.DebugManager_Task = function(debugManager, taskName, data, calculate){
  this.autoStart = true;
  this.speed = 100;
  this.debugManager = debugManager;
  this.output = '';
  this.domId = taskName;
  this.calculate = calculate;
  TC.LoopObject.call(this, data, this.speed, this.autoStart);
};
TC.DebugManager_Task.prototype = Object.create(TC.LoopObject.prototype);
TC.DebugManager_Task.prototype.constructor = TC.DebugManager_Task;

TC.DebugManager_Task.prototype.init = function(){
  this.initInterval();
};
TC.DebugManager_Task.prototype.calculate = function(){
  // get this from constructor
};
TC.DebugManager_Task.prototype.draw = function(){
  if(this.debugManager.debugSetting.isActive){
    let dom = document.querySelector('#'+this.domId);
    if(!dom){
      dom = document.createElement('div');
      dom.id = this.domId;
      this.debugManager.outputDom.appendChild(dom);
    }
    dom.innerText = this.output;
  }
  else {
    this.destroy();
  }
};
TC.DebugManager_Task.prototype.stop = function(){
  let dom = document.querySelector('#'+this.domId);
  dom.remove();
  this.isActive = false;
};
TC.DebugManager_Task.prototype.restart = function(){
  this.isActive = true;
};
TC.DebugManager_Task.prototype.destroy = function(){
  let dom = document.querySelector('#'+this.domId);
  if(dom) dom.remove();
  TC.LoopObject.prototype.destroy.call(this);
};
