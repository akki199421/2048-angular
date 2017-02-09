angular.module('gameController',['Keyboard','Grid'])
.controller('GameCntrl',function(game,KeyService){
	this.games = game;
	var self = this;
	var newGame = function(){
			game.newGame();
			self.startGame();
		}
		self.startGame = function(){
			KeyService.listen(function(key){
				self.games.nextMove(key);
			});
		}
	newGame();
})
.factory('game',function(GridService){
	this.newGame = function(){
		GridService.initGrid();
		//add two new tile
		GridService.addNewTile();
		GridService.addNewTile();
	}

	//var grid_tiles = GridService.grid;
	//The Game Loop
	this.nextMove = function(key){
		var trav_array =  GridService.calculateTraverseArray(key);
		GridService.resetAll();	
		console.log(GridService.grid);
		trav_array.x.forEach(function(x){
			trav_array.y.forEach(function(y){
				//console.log('x,y',x,y);
				var tile = GridService.findTile(x,y);
				if(tile){
					var hasMoved = GridService.hasTileMoved(tile);
					if(!hasMoved){
						// var old_pos = GridService.
						var next_pos = GridService.calculateNextPos(key,tile);
						console.log("next",next_pos);
						var next_cell = next_pos.next;
						if(!next_cell.merged && next_cell && next_cell.value === tile.value)
							{
								//GET THE new tile
								GridService.updateVal(next_cell,(next_cell.value*2));
								GridService.removeTile(tile);
						}
						else{
							GridService.moveTile(tile,next_pos.pos);
							//console.log('new tiles',GridService.grid);
						}
					}
				}

			})
		})
	}
	this.score = 0;
	return this;
});
