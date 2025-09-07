export class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;

        // Velocity with random sideways "projection"
        this.vx = (Math.random() - 0.5) * 4; // -2 to 2
        this.vy = -Math.random() * 5 - 2;    // upward force

        this.size = Math.floor(Math.random() * 2 + 1); // 1 or 2 px
        this.gravity = 0.4; //.15 deafult
        this.life = Math.random() * 10 + 10;
        // this.life = 20;

        this.color = this.randomColor();
      }

      randomColor() {
        const colors = [
          "#ff4500", // orange-red
          "#ff6347", // tomato
          "#ffcc00", // yellow
          "#ff0000", // red
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
      }

      draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }