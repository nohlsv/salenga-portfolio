class GameState {
    constructor(width = 10, height = 10) {
      this.map = Array.from({ length: height }, () => Array(width).fill(GAME.AIR));
      this.player = new Vec2(0, 0); // Starting position of the player
      this.map[0][0] = GAME.PLAYER; // Place the player on the map
      this.sideEffect = undefined;
    }
  
    // Load a map into the game state
    load(map) {
      this.map = structuredClone(map);
      this.getPlayer();
      return this;
    }
  
    // Set tile at a specific position
    setTile(i, j, val) {
      const newGame = new GameState();
      newGame.map = structuredClone(this.map);
      newGame.map[i][j] = val;
      return newGame;
    }
  
    // Get a tile at a specific position
    getTile(pos) {
      return this.map[pos.y]?.[pos.x] || GAME.AIR;
    }
  
    // Move the player or box
    move(dir) {
      const newGame = new GameState().load(this.map);
  
      if (!newGame.player) return [newGame, undefined];
  
      const moveResult = newGame._move(newGame.player, dir);
      if (moveResult) {
        newGame.getPlayer();
        return [newGame, newGame.sideEffect];
      }
      return [newGame, undefined];
    }
  
    // Perform the move action internally
    _move(pos, dir) {
      const newPos = pos.add(dir);
      const newTile = this.getTile(newPos);
  
      if (newTile === GAME.WALL) return false; // Cannot move into walls
  
      if (newTile === GAME.AIR || newTile === GAME.PLATE) {
        this.place(pos, newPos);
        this.sideEffect = newPos;
        return true;
      }
  
      if (newTile === GAME.BOX || newTile === GAME.PLAYER) {
        if (this._move(newPos, dir)) {
          this.place(pos, newPos);
          return true;
        }
      }
      return false;
    }
  
    // Place a tile at a new position
    place(pos, newPos) {
      const currentTile = this.getTile(pos);
      const newTile = this.getTile(newPos);
      this.setTile(pos.y, pos.x, newTile);
      this.setTile(newPos.y, newPos.x, currentTile);
    }
  
    // Get the current position of the player
    getPlayer() {
      this.player = undefined;
      for (let y = 0; y < this.map.length; y++) {
        for (let x = 0; x < this.map[y].length; x++) {
          if (this.map[y][x] === GAME.PLAYER) {
            this.player = new Vec2(x, y);
          }
        }
      }
    }
  
    // Check if the player has completed the level (all boxes on plates)
    checkWin() {
      if (!this.player) return false;
      const allPlatesOccupied = this.map.flat().some((tile) => tile === GAME.PLATE);
      if (allPlatesOccupied) return false;
      return true;
    }
  }
  