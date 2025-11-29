/**
 * ShedAway Hero Animation
 * Canvas-based particle system with pet hair removal effect
 */

class HeroAnimation {
  constructor() {
    this.canvas = document.getElementById('hero-animation-canvas');
    this.overlay = document.getElementById('hero-animation-overlay');
    this.skipBtn = document.getElementById('hero-skip-btn');

    if (!this.canvas || !this.overlay) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.glove = {
      x: -200,
      y: 0,
      width: 150,
      height: 150,
      speed: 0
    };

    this.isMobile = window.innerWidth < 768;
    this.particleCount = this.isMobile ? 20 : 40;
    this.animationDuration = 2500; // milliseconds
    this.startTime = null;
    this.animationFrame = null;

    // Check if animation was already shown this session
    if (sessionStorage.getItem('heroAnimationShown')) {
      this.skip();
      return;
    }

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();

    // Event listeners
    window.addEventListener('resize', () => this.resizeCanvas());

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.skip());

      // Show skip button after 1 second
      setTimeout(() => {
        this.skipBtn.style.opacity = '1';
      }, 1000);
    }

    // Start animation
    this.startTime = Date.now();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.glove.y = this.canvas.height / 2 - this.glove.height / 2;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        length: 10 + Math.random() * 20,
        width: 1 + Math.random() * 2,
        rotation: Math.random() * 360,
        opacity: 0.6 + Math.random() * 0.4,
        color: this.getHairColor(),
        removed: false,
        targetX: 0,
        targetY: 0
      });
    }
  }

  getHairColor() {
    const colors = [
      '#8B7355', // Brown
      '#D4A574', // Light brown
      '#4A4A4A', // Dark gray
      '#A0826D', // Tan
      '#2B2B2B'  // Almost black
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  drawHair(particle) {
    if (particle.removed) return;

    this.ctx.save();
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate((particle.rotation * Math.PI) / 180);
    this.ctx.globalAlpha = particle.opacity;

    // Draw curved hair strand
    this.ctx.strokeStyle = particle.color;
    this.ctx.lineWidth = particle.width;
    this.ctx.lineCap = 'round';

    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.quadraticCurveTo(
      particle.length / 2,
      particle.length / 4,
      particle.length,
      0
    );
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawGlove() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.9;

    // Draw glove shape (simplified representation)
    this.ctx.fillStyle = '#2D5016'; // Forest green

    // Palm
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.glove.x + this.glove.width / 2,
      this.glove.y + this.glove.height / 2,
      this.glove.width / 2.5,
      this.glove.height / 2,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Fingers (simplified as rectangles with rounded ends)
    const fingerWidth = 20;
    const fingerHeight = 50;
    const fingerSpacing = 18;
    const startX = this.glove.x + this.glove.width / 2 - (fingerSpacing * 2);

    for (let i = 0; i < 4; i++) {
      this.ctx.beginPath();
      this.ctx.roundRect(
        startX + i * fingerSpacing,
        this.glove.y + 10,
        fingerWidth,
        fingerHeight,
        10
      );
      this.ctx.fill();
    }

    // Add texture dots (represent nubs)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 15; i++) {
      const dotX = this.glove.x + 30 + Math.random() * 90;
      const dotY = this.glove.y + 30 + Math.random() * 90;
      this.ctx.beginPath();
      this.ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  animate() {
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(elapsed / this.animationDuration, 1);

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Phase 1 (0-30%): Show particles floating
    if (progress < 0.3) {
      this.particles.forEach(particle => {
        // Gentle floating animation
        particle.y += Math.sin(elapsed / 500 + particle.x) * 0.5;
        particle.rotation += 0.3;
        this.drawHair(particle);
      });
    }
    // Phase 2 (30-80%): Glove sweeps and attracts particles
    else if (progress < 0.8) {
      const sweepProgress = (progress - 0.3) / 0.5;

      // Move glove across screen with easing
      this.glove.x = this.easeInOutCubic(sweepProgress) * (this.canvas.width + 200) - 200;

      // Check collision and attract particles
      this.particles.forEach(particle => {
        if (!particle.removed) {
          const distanceToGlove = Math.sqrt(
            Math.pow(particle.x - (this.glove.x + this.glove.width / 2), 2) +
            Math.pow(particle.y - (this.glove.y + this.glove.height / 2), 2)
          );

          // Magnetic attraction range
          if (distanceToGlove < 150) {
            particle.targetX = this.glove.x + this.glove.width / 2;
            particle.targetY = this.glove.y + this.glove.height / 2;

            // Move toward glove
            particle.x += (particle.targetX - particle.x) * 0.15;
            particle.y += (particle.targetY - particle.y) * 0.15;

            // Fade out as it gets closer
            if (distanceToGlove < 80) {
              particle.opacity *= 0.9;
              if (particle.opacity < 0.05) {
                particle.removed = true;
              }
            }
          }

          this.drawHair(particle);
        }
      });

      this.drawGlove();
    }
    // Phase 3 (80-100%): Fade out overlay
    else {
      const fadeProgress = (progress - 0.8) / 0.2;
      this.overlay.style.opacity = 1 - fadeProgress;

      if (progress >= 1) {
        this.complete();
        return;
      }
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  skip() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.complete();
  }

  complete() {
    sessionStorage.setItem('heroAnimationShown', 'true');

    if (this.overlay) {
      this.overlay.style.opacity = '0';
      setTimeout(() => {
        this.overlay.style.display = 'none';
      }, 300);
    }
  }
}

// Initialize animation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimation();
  });
} else {
  new HeroAnimation();
}
