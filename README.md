Backbone.CacheableModel.js
=====
_Version: 1.0 - First release: 2013-11-19_  
(c) Stéphane Bonnet - [Github](https://github.com/ArAcNiDe)  (https://github.com/ArAcNiDe)  
License: [MIT](http://www.opensource.org/licenses/mit-license.php) (http://www.opensource.org/licenses/mit-license.php)  

  
Usage
-----

* __Extra options attributes__ _(Any of these can be toggled class-wide (via .extend) or during object instantiation)_
	* `cache: true` _boolean_ - Enable/Disable cache. Default: `true`
	* `cachePrefix: "cache_<rand>"` _string_ - Class-related identifier (eg. class name). Default: `cache_<random_uniqueid>`
	* `cacheSuffix: undefined` _string_ - Object-related. Allows multiple instances of the same object (= same class & same id). Default: `undefined`

* __Static class methods__
	* `withId(id, [prefix, suffix])` Returns a matching Backbone.CacheableModel, or null.
	* `cacheSize([prefix])` Returns the cache size (full or for a specific prefix)
	* `clearCache([prefix])` Clears the entire cache (or just entries matching the prefix)
