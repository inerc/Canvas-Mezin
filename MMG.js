(function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var player = {};
  var ground = [];
  var platformWidth = 32;
  var platformHeight = canvas.height - platformWidth * 4;


  var assetLoader = (function() {

    this.img        = {
      'bg'            : 'img/bg.png',
      'sky'           : 'img/sky.png',
      'backdrop'      : 'img/backdrop.png',
      'backdrop2'     : 'img/backdrop_ground.png',
      'grass'         : 'img/grass.png',
      'avatar_normal' : 'img/normal_walk.png'
    };

    var assetsLoaded = 0;                                // how many assets have been loaded
    var numimg      = Object.keys(this.img).length;    // total number of image assets
    this.totalAssest = numimg;                          // total number of assets


    function assetLoaded(dic, name) {
      // don't count assets that have already loaded
      if (this[dic][name].status !== 'loading') {
        return;
      }

      this[dic][name].status = 'loaded';
      assetsLoaded++;


      if (assetsLoaded === this.totalAssest && typeof this.finished === 'function') {
        this.finished();
      }
    }

    this.downloadAll = function() {
      var _this = this;
      var src;


      for (var img in this.img) {
        if (this.img.hasOwnProperty(img)) {
          src = this.img[img];


          (function(_this, img) {
            _this.img[img] = new Image();
            _this.img[img].status = 'loading';
            _this.img[img].name = img;
            _this.img[img].onload = function() { assetLoaded.call(_this, 'img', img) };
            _this.img[img].src = src;
          })(_this, img);
        }
      }
    }

    return {
      img: this.img,
      totalAssest: this.totalAssest,
      downloadAll: this.downloadAll
    };
  })();

  assetLoader.finished = function() {
    startGame();
  }


  function SpriteSheet(path, frameWidth, frameHeight) {
    this.image = new Image();
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;


    var self = this;
    this.image.onload = function() {
      self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
    };

    this.image.src = path;
  }


  function Animation(spritesheet, frameSpeed, startFrame, endFrame) {

    var animationSequence = [];
    var currentFrame = 0;
    var counter = 0;


    for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
      animationSequence.push(frameNumber);


    this.update = function() {


      if (counter == (frameSpeed - 1))
        currentFrame = (currentFrame + 1) % animationSequence.length;


      counter = (counter + 1) % frameSpeed;
    };


    this.draw = function(x, y) {

      var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
      var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);

      ctx.drawImage(
        spritesheet.image,
        col * spritesheet.frameWidth, row * spritesheet.frameHeight,
        spritesheet.frameWidth, spritesheet.frameHeight,
        x, y,
        spritesheet.frameWidth, spritesheet.frameHeight);
    };
  }


  var background = (function() {
    var sky   = {};
    var backdrop = {};
    var backdrop2 = {};

    this.draw = function() {
      ctx.drawImage(assetLoader.img.bg, 0, 0);


      sky.x -= sky.speed;
      backdrop.x -= backdrop.speed;
      backdrop2.x -= backdrop2.speed;


      ctx.drawImage(assetLoader.img.sky, sky.x, sky.y);
      ctx.drawImage(assetLoader.img.sky, sky.x + canvas.width, sky.y);

      ctx.drawImage(assetLoader.img.backdrop, backdrop.x, backdrop.y);
      ctx.drawImage(assetLoader.img.backdrop, backdrop.x + canvas.width, backdrop.y);

      ctx.drawImage(assetLoader.img.backdrop2, backdrop2.x, backdrop2.y);
      ctx.drawImage(assetLoader.img.backdrop2, backdrop2.x + canvas.width, backdrop2.y);


      if (sky.x + assetLoader.img.sky.width <= 0)
        sky.x = 0;
      if (backdrop.x + assetLoader.img.backdrop.width <= 0)
        backdrop.x = 0;
      if (backdrop2.x + assetLoader.img.backdrop2.width <= 0)
        backdrop2.x = 0;
    };

    this.reset = function()  {
      sky.x = 0;
      sky.y = 0;
      sky.speed = 0.2;

      backdrop.x = 0;
      backdrop.y = 0;
      backdrop.speed = 0.4;

      backdrop2.x = 0;
      backdrop2.y = 0;
      backdrop2.speed = 0.6;
    }

    return {
      draw: this.draw,
      reset: this.reset
    };
  })();

  function animate() {
    requestAnimFrame( animate );

    background.draw();

    for (i = 0; i < ground.length; i++) {
      ground[i].x -= player.speed;
      ctx.drawImage(assetLoader.img.grass, ground[i].x, ground[i].y);
    }

    if (ground[0].x <= -platformWidth) {
      ground.shift();
      ground.push({'x': ground[ground.length-1].x + platformWidth, 'y': platformHeight});
    }

    player.anim.update();
    player.anim.draw(64, 300);
  }


  var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback, element){
              window.setTimeout(callback, 1000 / 64);
            };
  })();


  function startGame() {
    player.width  = 64;
    player.height = 60;
    player.speed  = 4;
    player.sheet  = new SpriteSheet('img/normal_walk.png', player.width, player.height);
    player.anim   = new Animation(player.sheet, 1, 0, 8);


    for (i = 0, length = Math.floor(canvas.width / platformWidth) + 2; i < length; i++) {
      ground[i] = {'x': i * platformWidth, 'y': platformHeight};
    }

    background.reset();

    animate();
  }

  assetLoader.downloadAll();
})();