
var xWidth = 0.0;
var yHeight = 0.0;
var maxYLeft = 0.0;
var maxYRight = 0.0;


// Set up ParticleNetwork appropriately for the environment.
(function (factory) {

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = (typeof self === 'object' && self.self === self && self) || (typeof global === 'object' && global.global === global && global);

  // AMD.
  if (typeof define === 'function' && define.amd) {
    define(['exports'], function (exports) {
      root.ParticleNetwork = factory(root, exports);
    });
  }

  // Node.js or CommonJS.
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root, {});
  }

  // Browser global.
  else {
    root.ParticleNetwork = factory(root, {});
  }

}(function (root, ParticleNetwork) {

  // Create Particle class
  var Particle = function (parent) {
    this.parent = parent;
    this.canvas = parent.canvas;
    this.ctx = this.parent.ctx;
    this.particleColor = this.parent.options.particleColor;

    // xWidth = canvas width, yHeight = canvas height
    xWidth = this.canvas.width;
    yHeight = this.canvas.height;



    var particlePosition = false;
    var n = 0;
    //console.log(this.parent.particles.length);

    while (particlePosition == false && n < 10) {

      this.x = Math.floor((Math.random() * xWidth) + 1);
      this.y = Math.floor((Math.random() * yHeight) + 1);

      var xx = this.x / xWidth;
      var yy = this.y / yHeight;

      if (this.parent.options.position == "left") {
        if (1 - yy > 1 - xx) {
          this.x = yy * xWidth;
          this.y = xx * yHeight;
        }
      } else if (this.parent.options.position == "right") {
          if (1 - xx > yy) {
            this.x = (1 - yy) * xWidth;
            this.y = (1 - xx) * yHeight;
          }
      }

      particlePosition = true;
      for (var i = 0; i < this.parent.particles.length - 1; i++) {
        var distance = Math.sqrt(
          Math.pow(this.x - this.parent.particles[i].x, 2)
          + Math.pow(this.y - this.parent.particles[i].y, 2)
        );

        if (distance < 30 || distance > 200) {
          particlePosition = false;
          break;
        }

      }
      n++;
    }
    

    this.velocity = {
      x: (Math.random() - 0.5) * this.parent.options.velocity,
      y: (Math.random() - 0.5) * this.parent.options.velocity
    };

  };


  // Update function. Sees if the position is left or right and moves the particles on every frame.
  Particle.prototype.update = function () {
    // return;
    var xx = this.x / xWidth;
    var yy = this.y / yHeight;



    /*for (var i = 0; i < this.parent.particles.length; i++) {
      if (this.parent.particles[i].x != this.x) {
        var distance = Math.sqrt(
          Math.pow(this.x - this.parent.particles[i].x, 2)
          + Math.pow(this.y - this.parent.particles[i].y, 2)
        );

        if (distance < 30) {
          this.x = -this.x;
          this.y = -this.y;
        }

        if (distance > 120) {
          this.x = -this.x;
          this.y = -this.y;
        }
      }
    }*/

    //var particlePosition = false
    for (var i = 0; i < this.parent.particles.length - 1; i++) {
      var distance = Math.sqrt(
        Math.pow(this.x - this.parent.particles[i].x, 2)
        + Math.pow(this.y - this.parent.particles[i].y, 2)
      );

      if (distance < 30) {
        this.velocity.x = -this.velocity.x;// + (-this.velocity.x  * (30 - distance)/30);
        this.velocity.y = -this.velocity.y;// + (-this.velocity.y * (30 - distance)/30);

        this.parent.particles[i].velocity.x = -this.parent.particles[i].velocity.x;
        this.parent.particles[i].velocity.y = -this.parent.particles[i].velocity.y;
      }

    }

    if (this.parent.options.position == "left") {
        if (1 - yy > 1 - xx) {
          this.velocity.y += 5*(Math.PI/180);
          this.velocity.x -= 5*(Math.PI/180);
        }
    }

    if (this.parent.options.position == "right") {

      if (1 - yy > xx) {
        this.velocity.y += 5*(Math.PI/180);
        this.velocity.x += 5*(Math.PI/180);
      }
    }
    
    if (this.x > xWidth) {
      this.velocity.x -= (this.x) / 30000;
      this.velocity.x = Math.min(-0.1, this.velocity.x);
    }

    if (this.y > yHeight) {
      this.velocity.y -= (this.y) / 30000;
      this.velocity.y = Math.max(-0.1, this.velocity.y);
    }

    if (this.x < 0) {
      this.velocity.x += (this.x) / 30000;
      this.velocity.x = Math.max(0.1, this.velocity.x);
    }

    if (this.y < 0) {
      this.velocity.y += (this.y) / 30000;
      this.velocity.y = Math.max(0.1, this.velocity.y);
    }


    if (this.velocity.x > 0.2) {
        this.velocity.x = 0.1;
    }

    if (this.velocity.y > 0.2) {
        this.velocity.y = 0.1;
    }

    if (this.velocity.x == 0) {
        this.velocity.x = 0.1;
    }

    if (this.velocity.y == 0) {
        this.velocity.y = 0.1;
    }


    // Update position
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };



  Particle.prototype.draw = function () {

    // Draw particle
    this.ctx.beginPath();
    this.ctx.fillStyle = this.particleColor;
    this.ctx.globalAlpha = 0.7;
    this.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);        // 3 = size of particle
    this.ctx.fill();
  };

  // Create ParticleNetwork class
  ParticleNetwork = function (canvas, options) {

    this.canvasDiv = canvas;
    this.canvasDiv.size = {
      'width': this.canvasDiv.offsetWidth,
      'height': this.canvasDiv.offsetHeight
    };

    // Set options
    options = options !== undefined ? options : {};
    this.options = {
      particleColor: (options.particleColor !== undefined) ? options.particleColor : '#fff',
      position: options.position,
      interactive: (options.interactive !== undefined) ? options.interactive : true,
      velocity: this.setVelocity(options.speed),
      density: this.setDensity(options.density)
    };

    this.init();
  };
  ParticleNetwork.prototype.init = function () {

    // Create background div
    this.bgDiv = document.createElement('div');
    this.canvasDiv.appendChild(this.bgDiv);
    this.setStyles(this.bgDiv, {
      'position': 'absolute',
      'top': 0,
      'left': 0,
      'bottom': 0,
      'right': 0,
      'z-index': 1
    });

    // Check if valid particleColor
    if (!(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i).test(this.options.particleColor)) {
      console.error('Please specify a valid particleColor hexadecimal color');
      return false;
    }

    // Check if valid density
    if (!(/[0-9]/).test(this.options.density)) {
      console.error('Please specify a valid number');
      return false;
    }


    // Create canvas & context
    this.canvas = document.createElement('canvas');
    this.canvasDiv.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.canvasDiv.size.width;
    this.canvas.height = this.canvasDiv.size.height;
    this.setStyles(this.canvasDiv, { 'position': 'relative' });
    this.setStyles(this.canvas, {
      'z-index': '20',
      'position': 'relative'
    });

    // Add resize listener to canvas
    window.addEventListener('resize', function () {

      // Check if div has changed size
      if (this.canvasDiv.offsetWidth === this.canvasDiv.size.width && this.canvasDiv.offsetHeight === this.canvasDiv.size.height) {
        return false;
      }

      // Scale canvas
      this.canvas.width = this.canvasDiv.size.width = this.canvasDiv.offsetWidth;
      this.canvas.height = this.canvasDiv.size.height = this.canvasDiv.offsetHeight;

      // Set timeout to wait until end of resize event
      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(function () {

        // Reset particles
        this.particles = [];
        for (var i = 0; i < this.options.density; i++) {
          this.particles.push(new Particle(this));
        }
        if (this.options.interactive) {
          this.particles.push(this.mouseParticle);
        }

        // Update canvas
        requestAnimationFrame(this.update.bind(this));

      }.bind(this), 500);

    }.bind(this));

    // Initialise particles
    this.particles = [];
    for (var i = 0; i < this.options.density; i++) {
      this.particles.push(new Particle(this));
    }

    if (this.options.interactive) {

      // Add mouse particle if interactive
      this.mouseParticle = new Particle(this);
      this.mouseParticle.velocity = {
        x: 0,
        y: 0
      };
      this.particles.push(this.mouseParticle);

      // Mouse event listeners
      this.canvas.addEventListener('mousemove', function (e) {
        this.mouseParticle.x = this.getPosition(e).x;
        this.mouseParticle.y = this.getPosition(e).y;
      }.bind(this));

      this.canvas.addEventListener('mouseup', function (e) {
        this.mouseParticle.velocity = {
          x: (Math.random() - 0.5) * this.options.velocity,
          y: (Math.random() - 0.5) * this.options.velocity
        };
        this.mouseParticle = new Particle(this);
        this.mouseParticle.velocity = {
          x: 0,
          y: 0
        };
        this.particles.push(this.mouseParticle);
      }.bind(this));
    }

    // Update canvas
    requestAnimationFrame(this.update.bind(this));
  }

  ParticleNetwork.prototype.update = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;

    this.mouseParticle.velocity = 0;

    // Draw particles
    for (var i = 0; i < this.particles.length - 1; i++) {
      this.particles[i].update();
      this.particles[i].draw();

      // Draw connections
      for (var j = this.particles.length - 1; j > i; j--) {
        var distance = Math.sqrt(
          Math.pow(this.particles[i].x - this.particles[j].x, 2)
          + Math.pow(this.particles[i].y - this.particles[j].y, 2)
        );
        if (distance > 120) {
          continue;
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = this.options.particleColor;
        this.ctx.globalAlpha = (120 - distance) / 120;
        this.ctx.lineWidth = 0.7;
        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      // Mouse interaction
      for (var j =  this.particles.length - 1 ; j > i; j--) {
        var distanceMouse = Math.sqrt(
          Math.pow(this.particles[i].x - this.mouseParticle.x, 2)
          + Math.pow(this.particles[i].y - this.mouseParticle.y, 2)
        );
        if (distanceMouse > 80) {
          continue;
        }

        if (this.particles[i].x < this.mouseParticle.x) {
          this.particles[i].x = this.particles[i].x - 0.025
        }
        if (this.particles[i].x > this.mouseParticle.x) {
          this.particles[i].x = this.particles[i].x + 0.025
        }
        if (this.particles[i].y < this.mouseParticle.y) {
          this.particles[i].y = this.particles[i].y - 0.025
        }
        if (this.particles[i].y > this.mouseParticle.y) {
          this.particles[i].y = this.particles[i].y + 0.025
        }
      }
    }

    if (this.options.velocity !== 0) {
      requestAnimationFrame(this.update.bind(this));
    }
  };

  ParticleNetwork.prototype.setVelocity = function (speed) {
    var number = speed;
    return number;
}

  // Helper method to set density multiplier
  ParticleNetwork.prototype.setDensity = function (density) {
    var number = density;
    return number;
  }

  // Helper method to set multiple styles
  ParticleNetwork.prototype.setStyles = function (div, styles) {
    for (var property in styles) {
      div.style[property] = styles[property];
    }
  }

  ParticleNetwork.prototype.getPosition = function(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;

    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft
        + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop
        + document.documentElement.scrollTop;
    }

    var rect = this.canvas.getBoundingClientRect();

    return {
      x: posx - rect.left - window.scrollX,
      y: posy - rect.top - window.scrollY
    }
  }

  return ParticleNetwork;

}));
