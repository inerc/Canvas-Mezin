var Context = {
    canvas : null,
    context : null,
    create: function(canvas_tag_id) {
        this.canvas = document.getElementById(canvas_tag_id);
        this.context = this.canvas.getContext('2d');
        return this.context;
    }
};

var Sprite = function(filename, is_pattern) {

    // Construct
    this.image = null;
    this.pattern = null;
    this.TO_RADIANS = Math.PI/180;

    if (filename != undefined && filename != "" && filename != null)
    {
        this.image = new Image();
        this.image.src = filename;
        this.image.onload = function(e) {
            console.log("img loaded");
        }

        if (is_pattern)
            this.pattern = Context.context.createPattern(this.image, 'repeat');
    }
    else
        console.log("Unable to load sprite.");

    this.draw = function(x, y, w, h)
    {



        // Pattern?
        if (this.pattern)
        {
            console.log("pattern!");
            Context.context.fillStyle = this.pattern;
            Context.context.fillRect(x, y, w, h);

        } else {

            // Image
            if (!w)
            {
               Context.context.drawImage(this.image, x, y,
                                         this.image.width,
                                         this.image.height);
            } else {

                // Stretched
                Context.context.drawImage(this.image, x, y, w, h);

            }
        }
    };

    this.rotate = function(x, y, angle)
    {
        Context.context.save();

        Context.context.translate(x, y);
        Context.context.rotate(angle * this.TO_RADIANS);

        Context.context.drawImage(this.image,
                                -(this.image.width/2),
                                -(this.image.height/2));

        Context.context.restore();
    };


};

$(document).ready(function() {

    // Initialize Canvas
    Context.create("canvas");

    var WALL = "http://www.tigrisgames.com/wall.png";
    var CRATE = "http://www.tigrisgames.com/crate.png";
    var image = new Sprite(WALL, false);
    var image2 = new Sprite(CRATE, false);
    var pattern = new Sprite(CRATE, true);
    var angle = 0;

    setInterval(function() {

        Context.context.fillStyle = "#000000";
        Context.context.fillRect(0,0,800,800);

        image.draw(0,0,64,64);
        image.draw(0,74,256,32);
        pattern.draw(160,160,256,180);

        image.rotate(115,160,angle += 4.0);
        image2.rotate(115,260,-angle/2);

    },50);

});