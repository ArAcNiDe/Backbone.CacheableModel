/*
*   Backbone Cacheable Model - Version 1.0 - First public release
*   (c) Stéphane Bonnet - 2013-11-19 - https://github.com/ArAcNiDe
*   License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

/*
*	Backbone.CacheableModel
*
*	  # Extra options attributes (Any of these can be toggled class-wide (via .extend) or during object instantiation)
*		- cache: true					// Boolean - Enable/Disable cache. Default: true
*		- cachePrefix: "cache_<rand>"	// String - Class-related identifier (eg. class name). Default: cache_<random_uniqueid>
*		- cacheSuffix: undefined		// String - Object-related. Allows multiple instances of the same object (= same class & same id). Default: undefined
*
*	  # Static class methods
*		- withId(id, [prefix, suffix])	// Returns a matching Backbone.CacheableModel, or null.
*		- cacheSize([prefix])			// Returns the cache size (full or for a specific prefix)
*		- clearCache([prefix])			// Clears the entire cache (or just entries matching the prefix)
*
*/

(function(Backbone) {

	if(!Backbone || !Backbone.Model) throw new Error("Backbone.js must be loaded BEFORE this file.");

	// INTERNAL - Cache manager
	var _cache = new (function() {

		var _models = {};

		this.get = function(key) {
			if(!key) return null;
			return _models[key];
		};

		this.set = function(key, model) {
			if(!key || !model) return;
			_models[key] = model;
		};

		this.unset = function(key, prefix) {
			if(prefix) {
				_.each(_.keys(_models), function(key) {
					if(key.startsWith(prefix))
						_models[key] = null;
				});
			} else {
				_models[key] = null;
			}
		};

		this.reset = function() {
			_models = {};
		};

		this.length = function(prefix) {
			var len = 0;
			_.each(_.keys(_models), function(key) {
				if(!prefix || key.startsWith(prefix))
					++len;
			});
			return len;
		};

	})();

	Backbone.CacheableModel = Backbone.Model.extend({
		constructor: function(attributes, options) {
			attributes || (attributes = {});
			options || (options = {});
			delete options['url'];
			var instance;
			var doCache = _.isBoolean( options.cache ) ? options.cache : (this.cache || false);
			var cachePrefix = options.cachePrefix || this.cachePrefix || _.uniqueId("cache_");
			var cacheSuffix = options.cacheSuffix || this.cacheSuffix;
			var idAttribute = this.idAttribute || 'id';
			var id = attributes[idAttribute];

			if(cacheSuffix)
				this.cacheSuffix = cacheSuffix;
			this.cachePrefix = cachePrefix;
			this.cache = doCache;

			if(doCache && id){
				instance = _cache.get(cachePrefix + "/" + id + (cacheSuffix ? '/'+cacheSuffix : ''));
				if(instance){
					instance.set(attributes);
					return instance;
				}
			}

			Backbone.Model.apply(this, arguments);

			if(doCache && !instance) {
				_cache.set(cachePrefix + "/" + id + (cacheSuffix ? '/'+cacheSuffix : ''), this);
			}
			this.on('change:'+idAttribute, function(model, value) {
				var instance = _cache.get(cachePrefix + "/" + value + (cacheSuffix ? '/'+cacheSuffix : ''));
				_cache.unset(cachePrefix + "/" + id + (cacheSuffix ? '/'+cacheSuffix : ''));
				id = value;
				if(instance) instance.set(model.toJSON());
				else _cache.set(cachePrefix + "/" + id + (cacheSuffix ? '/'+cacheSuffix : ''), model);
			}, this);
		},
		cache: true
	}, {
		withId: function(id, prefix, suffix) {
			var attrs = {};
			attrs[this.prototype.idAttribute] = id;
			if(prefix) attrs['cachePrefix'] = prefix;
			if(suffix) attrs['cacheSuffix'] = suffix;
			return new this(attrs);
		},
		
		cacheSize: function(prefix) {
			return _cache.length(prefix);
		},
		clearCache: function(prefix) {
			if(prefix)
				_cache.unset(prefix, true);
			else
				_cache.reset();
		}
	});

}).call(this, Backbone);