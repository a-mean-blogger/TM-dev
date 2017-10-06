console.log("text-canvas-5-debug-manager.js loaded");

// DebugManager
TC.DebugManager = function(debugSetting){
  this.debugSetting = TC.common.mergeObjects(TC.defaultSettings.debug, debugSetting);
  TC.Object.call(this);
  this.tasks = {};
};
TC.DebugManager.prototype = Object.create(TC.Object.prototype);
TC.DebugManager.prototype.constructor = TC.DebugManager;

TC.DebugManager.prototype.destroy = function(taskName, data, calculate){
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
  this.debugManager = debugManager;
  this.outputDom = document.querySelector("#"+this.debugManager.debugSetting.outputDomId);
  this.output = '';
  this.taskName = taskName;
  this.calculate = calculate;
  TC.LoopObject.call(this, 10, data, true);
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
    let dom = document.querySelector("#"+this.taskName);
    if(!dom){
      dom = document.createElement("div");
      dom.id = this.taskName;
      this.outputDom.appendChild(dom);
    }
    dom.innerText = this.output;
  }
  else {
    this.destroy();
  }
};
TC.DebugManager_Task.prototype.stop = function(){
  let dom = document.querySelector("#"+this.taskName);
  dom.remove();
  this.isActive = false;
};
TC.DebugManager_Task.prototype.restart = function(){
  this.isActive = true;
};
TC.DebugManager_Task.prototype.destroy = function(){
  let dom = document.querySelector("#"+this.taskName);
  if(dom) dom.remove();
  TC.LoopObject.prototype.destroy.call(this);
};
