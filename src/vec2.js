class Vec2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    add(b) {
      return new Vec2(this.x + b.x, this.y + b.y);
    }
  
    static add(a, b) {
      return new Vec2(a.x + b.x, a.y + b.y);
    }
  
    static negate(v) {
      return new Vec2(-v.x, -v.y);
    }
  
    static ZERO = { x: 0, y: 0 };
  }
  