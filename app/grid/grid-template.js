<div class="game-grid row" >
	<div class="grid-cell " ng-repeat="cell in gridSer.grid track by $index"></div>
	<div  ng-repeat='tile in gridSer.grid track by $index'>
	<div class="tile-cell pos-{{tile.x}}-{{tile.y}}" ng-if="tile">
			<div class="tile-inner">{{tile.value}}</div>
		</div>
	</div>

</div>
