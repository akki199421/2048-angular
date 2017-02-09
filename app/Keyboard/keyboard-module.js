(function(){
	angular.module('Keyboard',[])
	.factory('KeyService',function($document){
		var keys = {
			ArrowUp: "up",
			ArrowDown : "down",
			ArrowLeft: "left",
			ArrowRight: "right"
		};
		var self = this;
		
		var init = function(){
			$document.bind('keydown',function(e){
				//prevent default
				var curr_key = keys[e.key];
				if(curr_key){
					e.preventDefault();
					self.cb(curr_key);
				}
			});
		}
		self.listen = function(callback){
			self.cb = callback;
		}
		init();
		return self;
	})
})()
