// Generated by CoffeeScript 1.8.0
(function() {
  var Model, Query, createExec, createFind, createFindById, createFindOne, mongoose, setHooks;

  mongoose = require('mongoose');

  Model = mongoose.Model;

  Query = mongoose.Query;

  setHooks = function(hooks) {
    var modifyCallback;
    return modifyCallback = function() {
      var args;
      args = Array.prototype.slice.call(arguments);
      args.forEach(function(arg, index) {
        var oldCb;
        if (typeof arg === 'function') {
          oldCb = arg;
          return args[index] = function(err, results) {
            var addHook;
            if (err) {
              return oldCb(err);
            }
            addHook = function(index, err, data) {
              if (err) {
                return oldCb(err);
              }
              if (!hooks[index]) {
                return oldCb(err, data);
              }
              return hooks[index](data, addHook.bind(null, index + 1));
            };
            return addHook(0, err, results);
          };
        }
      });
      return args;
    };
  };

  createFind = function(hooks) {
    var modifiedFind;
    return modifiedFind = function() {
      var args, result;
      args = hooks.apply(null, arguments);
      result = Model.find.apply(this, args);
      result.exec = createExec(hooks);
      return result;
    };
  };

  createFindOne = function(hooks) {
    var modifiedFindOne;
    return modifiedFindOne = function() {
      var args, result;
      args = hooks.apply(null, arguments);
      result = Model.findOne.apply(this, args);
      result.exec = createExec(hooks);
      return result;
    };
  };

  createFindById = function(hooks) {
    var modifiedFindOne;
    return modifiedFindOne = function() {
      var args, result;
      args = hooks.apply(null, arguments);
      result = Model.findById.apply(this, args);
      result.exec = createExec(hooks);
      return result;
    };
  };

  createExec = function(hooks) {
    var modifiedExec;
    return modifiedExec = function() {
      var args;
      args = hooks.apply(null, arguments);
      return Query.prototype.exec.apply(this, args);
    };
  };

  module.exports = function(schema, options) {
    var keys, validOptions;
    if (!options) {
      return console.log("No options passed for postFind");
    }
    keys = Object.keys(options);
    validOptions = keys.every(function(key) {
      return key === 'find' || key === 'findOne' || key === 'findById';
    });
    if (!validOptions) {
      return console.log("Missing valid postFind options. (find, findOne, findById)");
    }
    return keys.forEach(function(key) {
      var hooks;
      hooks = options[key];
      if (!Array.isArray(hooks)) {
        hooks = [hooks];
      }
      hooks = setHooks(hooks);
      switch (key) {
        case 'find':
          return schema.statics.find = createFind(hooks);
        case 'findOne':
          return schema.statics.findOne = createFindOne(hooks);
        case 'findById':
          return schema.statics.findById = createFindById(hooks);
      }
    });
  };

}).call(this);
