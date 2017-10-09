console.log('text-canvas-4-input-manager.js loaded');

/******************************/
/* TC.InputManager            */
/******************************/
// Object Type: TC.Object
// Description: manages input methods
TC.InputManager = function(customTargetDomId){
  var targetDomId = customTargetDomId?customTargetDomId:TC.defaultSettings.screen.canvasId;
  try{
    this.targetDom = document.querySelector('#'+targetDomId);
    if(!this.targetDom){
      throw('[#'+domId+'] does not exist! ');
    }
  }
  catch(errorMessage){
    this.isActive = false;
    console.error('new TC.InputManager ERROR: '+errorMessage+' TC.InputManager is not created.');
    return;
  }

  this.isAllowed = true;
  this.keyboard = new TC.InputManager_Keyboard(this);
  TC.Object.call(this);
};
TC.InputManager.prototype = Object.create(TC.Object.prototype);
TC.InputManager.prototype.constructor = TC.InputManager;

// TC.InputManager functions - allow/disallow
TC.InputManager.prototype.isAllowed = function(keyCode){
  return this.isAllowed;
};
TC.InputManager.prototype.disAllow = function(keyCode){
  this.isAllowed = false;
};
TC.InputManager.prototype.allow = function(keyCode){
  this.isAllowed = true;
};

/******************************/
/* TC.InputManager_Keyboard   */
/******************************/
// Object Type: TC.Object
// Description: manages Keyboard inputs
// functions:
// - checkKeyState: check if key is pressed at the moment of checking
// - checkKeyPressed: check if key is ever pressed since last check
// - checkKeyState: checkKeyState+checkKeyPressed
//                 (check if key is pressed at the moment of checking or if key is ever pressed since last check)
TC.InputManager_Keyboard = function(inputManager){
  this.isAllowed = true;
  this.inputManager = inputManager;
  this.keyState = {};
  this.keyPressed = {};

  var _self = this;
  this.eventHandlers = {
    keydown: function(e){
      e.preventDefault();
      if(_self.inputManager.isAllowed && _self.isAllowed){
        _self.keyState[e.keyCode] = true;
        _self.keyPressed[e.keyCode] = true;
        // console.log('e.keyCode: ', e.keyCode);
      }
    },
    keyup: function(e){
      e.preventDefault();
      delete _self.keyState[e.keyCode];
    },
  };
  TC.Object.call(this);
};
TC.InputManager_Keyboard.prototype = Object.create(TC.Object.prototype);
TC.InputManager_Keyboard.prototype.constructor = TC.InputManager_Keyboard;

// TC.Object functions implementation
TC.InputManager_Keyboard.prototype.init = function(){
  this.inputManager.targetDom.addEventListener('keydown', this.eventHandlers.keydown);
  this.inputManager.targetDom.addEventListener('keyup', this.eventHandlers.keyup);
};

// TC.InputManager_Keyboard functions - keyState
TC.InputManager_Keyboard.prototype.checkKeyState = function(keyCode){
  // console.log('keyCode: ', keyCode);
  // console.log('this.keyState: ', this.keyState);
  if(this.keyState[keyCode]) {
    return true;
  }
  else return false;
};
TC.InputManager_Keyboard.prototype.checkKeyStateAny = function(){
  if(Object.keys(this.keyState).length){
    // console.log('this.keyState: ', this.keyState);
    return true;
  }
  else return false;
};
TC.InputManager_Keyboard.prototype.removeKeyState = function(keyCode){
  delete this.keyState[keyCode];
};
TC.InputManager_Keyboard.prototype.clearKeyState = function(){
  this.keyState = {};
};

// TC.InputManager_Keyboard functions - allow/disallow
TC.InputManager_Keyboard.prototype.isAllowed = function(keyCode){
  return this.isAllowed;
};
TC.InputManager_Keyboard.prototype.disAllow = function(keyCode){
  this.isAllowed = false;
};
TC.InputManager_Keyboard.prototype.allow = function(keyCode){
  this.isAllowed = true;
};

// TC.InputManager_Keyboard functions - keyPressed
TC.InputManager_Keyboard.prototype.checkKeyPressed = function(keyCode){
  // console.log('keyCode: ', keyCode);
  // console.log('this.keyPressed: ', this.keyPressed);
  if(this.keyPressed[keyCode]) {
    delete this.keyPressed[keyCode];
    return true;
  }
  else return false;
};
TC.InputManager_Keyboard.prototype.checkKeyPressedAny = function(){
  if(Object.keys(this.keyPressed).length){
    this.keyPressed = {};
    return true;
  }
  else return false;
};
TC.InputManager_Keyboard.prototype.removeKeyPressed = function(keyCode){
  delete this.keyPressed[keyCode];
};
TC.InputManager_Keyboard.prototype.clearKeyPressed = function(){
  this.keyPressed = {};
};

// TC.InputManager_Keyboard functions - key
TC.InputManager_Keyboard.prototype.checkKey = function(keyCode){
  return this.checkKeyPressed(keyCode) || this.checkKeyState(keyCode);
};
TC.InputManager_Keyboard.prototype.checkKeyAny = function(){
  return this.checkKeyPressedAny() || this.checkKeyStateAny();
};
TC.InputManager_Keyboard.prototype.removeKey = function(keyCode){
  this.removeKeyPressed(keyCode);
  this.removeKeyState(keyCode);
};
TC.InputManager_Keyboard.prototype.clearKey = function(){
  this.clearKeyPressed();
  this.clearKeyState();
};
