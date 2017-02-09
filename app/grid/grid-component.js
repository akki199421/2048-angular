(function(){
	
	angular.module('Grid')
	.controller('gridController',['$scope','GridService',function($scope,GridService){
		$scope.gridSer = GridService;
	}])
	.directive('gridComponent',function (){
		return{
			restrict: 'A',
			templateUrl: 'app/grid/grid-template.html',	
			
		};

	})
	
	.factory('TileService',function(){
		var Tile = function(value,position,id){
			this.value = value;
			this.x = position.x;
			this.y = position.y;
			this.merged = false;
			this.moved = false;
			this.ID = id;
		}
		Tile.prototype.returnPos = function(){
			return{
				x: position.x,
				y: position.y
			}
		}
		Tile.prototype.reset = function(){
			this.moved = false;
			this.merged = false;
		}
		Tile.prototype.updateMergerd = function() {
			this.merged = true;
		}
		Tile.prototype.updateVal = function(val){
			this.value = val;
		}
		Tile.prototype.updatePosition = function(pos){
			this.x = pos.x;
			this.y = pos.y;
		}
		Tile.prototype.getPosition = function(){
			return{
				x: this.x,
				y: this.y
			};
		}
		Tile.prototype.tileMoved = function(){
			this.moved = true;
		}
		return Tile;

	})
	.provider('GridService',function(){
		var gridSer = this;
		var iii = 0;
		gridSer.defaultTile = 2;
		gridSer.grid = [];
		gridSer.tiles = [];
		gridSer.gridsize = 4;
		gridSer.initGrid = function(){
			for(var i = 0;i<gridSer.gridsize*gridSer.gridsize;i++){
				this.grid[i] = null;
			}
		}

		var randomeNumber = function(num){
			return num[Math.floor((Math.random()*(num.length)))];

		}
		this.$get = function (TileService) {
			gridSer._findAvailableCells = function(){
				var cells = [];
				angular.forEach(gridSer.grid, function(value, key){
					if(value === null)
						cells.push(key);
				});
				return cells;
			};
			gridSer._calcXYPos = function(cell_num) {
				var x_p = Math.floor(cell_num%gridSer.gridsize);
				var y_p = Math.floor((cell_num/gridSer.gridsize));
				return position = {
					x: x_p,
					y: y_p
				}
			}
			gridSer.resetAll = function(){
				gridSer.tiles.forEach(function(tile){
					tile.reset();
				})
			}

			gridSer.calculateTraverseArray = function(key){
				var pos = {
					x: [],
					y: []
				};
				for(var i=0;i<gridSer.gridsize;i++){
					pos.x.push(i);
					pos.y.push(i);
				}
				switch(key){
					case "right":
					pos.x = pos.x.reverse();
					break;
					case "down":
					pos.y = pos.y.reverse();
					break;
				}
				return pos;
			}
			gridSer.calculateNextPos = function(key,tile){
			//tile.updateVal(100);
				var pos = angular.copy(tile.getPosition()),curr_x=0,curr_y=0,next;
				switch(key){
					case "left":
					curr_x=-1;
					break;
					case "right":
					curr_x=1;
					break;
					case "up":
					curr_y=-1;
					break;
					case "down":
					curr_y=1;
					break;
				};
				do
				{
					next = pos;
					pos = {
						x: next.x + curr_x,
						y: next.y + curr_y
					};

				//console.log("next",tile.ID,pos.x);
				}while(gridSer._isAvailableandValid(pos));

				//console.log("new_pos",pos,next);
				return{
					pos : next,
					next: gridSer.cellAt(pos)
				}

			}
			gridSer.findTile = function(x,y){
				return gridSer.grid[(y*gridSer.gridsize)+x];
			}
			gridSer.cellAt = function(cell){
				var size = gridSer.gridsize;
				if(cell.x > -1 && cell.y > -1 && cell.x <size && cell.y<size)
					if(gridSer.grid[cell.x+(cell.y*size)]!==null)
						return gridSer.grid[cell.x+(cell.y*size)];
					return false;
			}
			gridSer._isAvailableandValid = function(cell){
				console.log("cell = ",cell);

				var size = gridSer.gridsize;
				if(cell.x > -1 && cell.y > -1 && cell.x <size && cell.y < size && gridSer.grid[cell.x+(cell.y*size)]===null)
					return cell;
				return false;
			}
			gridSer.addNewTile = function(){
				//find all available cells
				var cells = gridSer._findAvailableCells(),next_cell;
				var pos = {};
				if(cells.length === 0)
					alert('Game Overs');
				else{
				//pick random cell
				next_cell = randomeNumber(cells);
				//find x y
				pos = gridSer._calcXYPos(next_cell);
				var tile = gridSer.newTile(gridSer.defaultTile,pos);
				//adding in new tiles
				gridSer.tiles.push(tile);
				//add it into the grid
				gridSer.grid[next_cell] = tile;
				console.log(next_cell);
				}
			}
			gridSer.newTile = function(value,pos){
				iii++;
				return new TileService(value,pos,iii);
			}

			gridSer.moveTile = function(tile,pos){
				var old_pos = tile.getPosition();
				gridSer.grid[old_pos.x+(old_pos.y*gridSer.gridsize)] = null;
				gridSer.grid[pos.x+(pos.y*gridSer.gridsize)] = tile;
				tile.tileMoved();
				tile.updatePosition(pos);
			}
			gridSer.hasTileMoved = function(tile){
				return tile.moved;
			}
			gridSer.updateVal = function(tile,val){
				tile.updateVal(val);
			}
			gridSer.removeTile = function(tile){
				gridSer.grid[tile.x+(tile.y*gridSer.gridsize)] = null;
				var index = gridSer.tiles.indexOf(tile);
				gridSer.tiles.splice(index,1);
				delete tile;
				console.log("tile_deleted",gridSer.tiles);
			}
			return this;
		};
	});
	// function gridController($scope,GridService){
	// 	$scope.gridSer = GridService;
	// };

})();
