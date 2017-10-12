console.log('TM.InputManager_Keyboard loaded');

//=============================
// TM.InputManager_Keyboard
//=============================
// Object Type: TM.IObject
// Description: manages Keyboard inputs
// functions:
// - checkKeyState: check if key is pressed at the moment of checking
// - checkKeyPressed: check if key is ever pressed since last check
// - checkKeyState: checkKeyState+checkKeyPressed
//                 (check if key is pressed at the moment of checking or if key is ever pressed since last check)
TM.InputManager_Keyboard = function(inputManager){
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
  TM.IObject.call(this);
};
TM.InputManager_Keyboard.prototype = Object.create(TM.IObject.prototype);
TM.InputManager_Keyboard.prototype.constructor = TM.InputManager_Keyboard;

// TM.IObject functions implementation
TM.InputManager_Keyboard.prototype._init = function(){
  this.inputManager.targetDom.addEventListener('keydown', this.eventHandlers.keydown);
  this.inputManager.targetDom.addEventListener('keyup', this.eventHandlers.keyup);
};
TM.InputManager_Keyboard.prototype._destroy = function(){};

// TM.InputManager_Keyboard functions - keyState
TM.InputManager_Keyboard.prototype.checkKeyState = function(keyCode){
  // console.log('keyCode: ', keyCode);
  // console.log('this.keyState: ', this.keyState);
  if(this.keyState[keyCode]) {
    return true;
  }
  else return false;
};
TM.InputManager_Keyboard.prototype.checkKeyStateAny = function(){
  if(Object.keys(this.keyState).length){
    // console.log('this.keyState: ', this.keyState);
    return true;
  }
  else return false;
};
TM.InputManager_Keyboard.prototype.removeKeyState = function(keyCode){
  delete this.keyState[keyCode];
};
TM.InputManager_Keyboard.prototype.clearKeyState = function(){
  this.keyState = {};
};

// TM.InputManager_Keyboard functions - allow/disallow
TM.InputManager_Keyboard.prototype.isAllowed = function(keyCode){
  return this.isAllowed;
};
TM.InputManager_Keyboard.prototype.disAllow = function(keyCode){
  this.isAllowed = false;
};
TM.InputManager_Keyboard.prototype.allow = function(keyCode){
  this.isAllowed = true;
};

// TM.InputManager_Keyboard functions - keyPressed
TM.InputManager_Keyboard.prototype.checkKeyPressed = function(keyCode){
  // console.log('keyCode: ', keyCode);
  // console.log('this.keyPressed: ', this.keyPressed);
  if(this.keyPressed[keyCode]) {
    delete this.keyPressed[keyCode];
    return true;
  }
  else return false;
};
TM.InputManager_Keyboard.prototype.checkKeyPressedAny = function(){
  if(Object.keys(this.keyPressed).length){
    this.keyPressed = {};
    return true;
  }
  else return false;
};
TM.InputManager_Keyboard.prototype.removeKeyPressed = function(keyCode){
  delete this.keyPressed[keyCode];
};
TM.InputManager_Keyboard.prototype.clearKeyPressed = function(){
  this.keyPressed = {};
};

// TM.InputManager_Keyboard functions - key
TM.InputManager_Keyboard.prototype.checkKey = function(keyCode){
  return this.checkKeyPressed(keyCode) || this.checkKeyState(keyCode);
};
TM.InputManager_Keyboard.prototype.checkKeyAny = function(){
  return this.checkKeyPressedAny() || this.checkKeyStateAny();
};
TM.InputManager_Keyboard.prototype.removeKey = function(keyCode){
  this.removeKeyPressed(keyCode);
  this.removeKeyState(keyCode);
};
TM.InputManager_Keyboard.prototype.clearKey = function(){
  this.clearKeyPressed();
  this.clearKeyState();
};
