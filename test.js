setNeighbors(board) {
    for (let neighbor of this.neighbors) {
      if (neighbor >= 0) {
        this.oneCaseNeighbors.add(neighbor);
      } else {
        continue;
      }
    }
    for (let oneCaseNeighbor of this.oneCaseNeighbors) {
      const neighbors = board[oneCaseNeighbor].neighbors;
      for (let neighbor of neighbors) {
        if (
          neighbor < 0 ||
          neighbor === this.index ||
          this.oneCaseNeighbors.has(neighbor)
        ) {
          continue;
        } else {
          this.twoCaseNeighbors.add(neighbor);
        }
      }
    }
    for (let twoCaseNeighbors of this.twoCaseNeighbors) {
      const neighbors = board[twoCaseNeighbors].neighbors;
      for (let neighbor of neighbors) {
        if (
          neighbor < 0 ||
          this.oneCaseNeighbors.has(neighbor) ||
          this.twoCaseNeighbors.has(neighbor)
        ) {
          continue;
        } else {
          this.threeCaseNeighbors.add(neighbor);
        }
      }
    }
  }