var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext("2d");


var sin=Math.sin;
var cos=Math.cos;
var log=Math.log;
var Pi=Math.PI;



function transpose(point, axis){

    if(axis == "x"){
        //point += (xMax - xMin)/2;
        return (point-xMin)/(xMax-xMin)*(ctx.canvas.width);
    }
    if(axis == "y"){
        //point += (yMax - yMin)/2;
        return ctx.canvas.height-(point-yMin)/(yMax-yMin)*(ctx.canvas.height);
    }

    return point;
}


// perspective with eyex shift for stereoscopy

var perspective= function(eyex, eyez, screen_z, x,z)
{
    return ( eyex+(screen_z-eyez)*(x-eyex)/(z-eyez) );

}

// (x,y) rotated by angle is ( xrotate(x,y, angle), yrotate(x,y, angle) )

var xrotate= function (x,y, angle)
{
    return(x*cos(angle)-y*sin(angle));
}

var yrotate= function (x,y, angle)
{
    return(y*cos(angle)+x*sin(angle));
}

// screen parameters: screen displays the rectangle [rminx,rmaxx] x [rminy,rmaxy] of R x R
var rpixel=0.005; // size of pixel
var rminx=-rpixel*ctx.canvas.width/2;
var rmaxx= rpixel*ctx.canvas.width/2;
var rminy=-rpixel*ctx.canvas.height/2;
var rmaxy= rpixel*ctx.canvas.height/2;

var Xd= 0, Yd= 1, Zd= 2; // dimmensions

// parameters for stereoscopy
var eyeDistance=7;
var leftEye=[-eyeDistance/2, 0, 40];
var rightEye=[eyeDistance/2, 0, 40];

var screen_z= 0.0;

var rightColor="rgb(0,0,255)";
var leftColor ="rgb(255,0,0)";


// we are drawing image of a function f: [xmin,xmax] x [ymin,ymax] -> R x R x R,
// where f(x,y)= ( fx(x,y), fy(x,y), fz(x,y) )

var xmin=-1;
var xmax= 1;
var ymin=-1;
var ymax= 1;


// the image of the function is rotated horizontaly by ALPHA and verticaly by BETA
/**/
var ALPHA = 0;
var BETA  = 0;

// precision of the graph

var stepX=0.04;
var stepY=0.04;


/**/
var draw=function(ctx, colorString, eye) {



    var x,y;
    var ffx, ffy, ffz, fffx, fffy, fffz;
    ctx.strokeStyle =colorString;

    //fffx=fx(x,y); fffy=fy(x,y); ffz= fz(x,y);
    fffx=points[0][0]; fffy=points[0][1]; ffz= points[0][2];


    // horizontal rotation by ALPHA
    ffx= xrotate(fffx, ffz, ALPHA);
    fffz= yrotate(fffx, ffz, ALPHA);

    // vertical  rotation by BETA
    ffz=  xrotate(fffz, fffy, BETA);
    ffy=  yrotate(fffz, fffy, BETA);
  
    /**/
    ctx.moveTo(transpose(ffx, "x"),transpose(ffy, "y"));
    console.log( "transp(x,y) = (" + transpose(ffx, "x")+"," + transpose(ffy, "y")+")" );



    for	(index = 1; index < points.length; index++) {

        fffx=points[index][0]; fffy=points[index][1]; ffz= points[index][2];

        // horizontal rotation by ALPHA
        ffx= xrotate(fffx, ffz, ALPHA);
        fffz= yrotate(fffx, ffz, ALPHA);

        // vertical  rotation by BETA
        ffz=  xrotate(fffz, fffy, BETA);
        ffy=  yrotate(fffz, fffy, BETA);


        console.log("\n");

        /**/
        ctx.lineTo(transpose(ffx, "x"),transpose(ffy, "y"));
        console.log( "transp(x,y) = (" + transpose(ffx, "x")+"," + transpose(ffy, "y")+")" );

        

    }

}
var clearScreen= function(ctx) {


    ctx.canvas.width = canvas.width;
}


var redraw= function() {

    clearScreen(ctx);
    draw(ctx, leftColor, rightEye);
      /**/
    clearScreen(ctx2);
    draw(ctx2, rightColor, rightEye );

    ctx.globalCompositeOperation="lighter";
    ctx2.stroke();
    ctx.drawImage(ctx2.canvas, 2,2); /**/
    ctx.stroke();
}


var keyDownCallback=function (e){
    //e.preventDefault(); // prevents browser from interpreting the keys for other tasks
    const rotStep = Math.PI / 36; // 5 degrees
    var code= e.which || e.keyCode;

    switch(code)
    {
        case 38: // up
        case 73: // I
            BETA+=rotStep;
            redraw();
            break;
        case 40: // down
        case 75: // K
            BETA-=rotStep;
            redraw();
            break;
        case 37: // left
        case 74:// J
            ALPHA+=rotStep;
            redraw();
            break;
        case 39:// right
        case 76: // L
            ALPHA-=rotStep;
            redraw();
            break;
        case 13: // Enter
            readCommand();
            redraw();
            break;
        case 32: // Space
            ALPHA=0;
            BETA=0;
            redraw();
            break;
        //case 9: // Tab
        case 69: // E
            var tmp=  rightColor;
            rightColor=leftColor;
            leftColor=tmp;
            redraw();
            break;

    };

};


onload= function(){


    redraw(); // initial redraw
    onkeydown=keyDownCallback; // set initial callback
}
