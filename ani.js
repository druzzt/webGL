/* SHADER PROGRAM */
/* vertex shader source code */
var vertexShaderSrc= ""+
    "attribute vec4 aVertexPosition; \n"+
    "uniform vec3 uMove; \n"+
    "void main( void ) { \n"+
    "  gl_PointSize=16.0; \n"+
    "  gl_Position= aVertexPosition+ vec4( uMove, 0); \n"+
    "} \n";

/* fragment shader source code */
var fragmentShaderSrc= ""+
    "precision mediump float; \n"+ 
    "uniform vec3 uColorRGB; \n"+ 
    "void main( void ) { \n"+
    "  gl_FragColor = vec4( uColorRGB, 1.0 ); \n"+
    "} \n";



var gl; // GL context
var glObjects; // references to various GL objects
var html; // HTML objects
var data; // user data

var dataInit= function(){
    data={};
    data.background=[0,0,0,1];

    /* animated object */
    data.object1={};
    data.object1.speed=0.001; // ?
    var xr = Math.random()*0.5 + 0.7;
    var yr =-( Math.random()*0.5 + 0.7);
    data.object1.direction= [xr,yr,0];
    // parameters for drawObject
    data.object1.position=[0,0,0];
    data.object1.radius=0.095;
    data.object1.colorRGB=[0.01, 0.9, 0.11];
    data.object1.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object1.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0]) , gl.STATIC_DRAW ); // load object's shape
    data.object1.floatsPerVertex=2;
    data.object1.NumberOfVertices=1;
    data.object1.drawMode=gl.POINTS;

    /* Static background object */
    data.object2={};
    // parameters for drawObject
    data.object2.position=[0,0, 0.7];
    data.object2.colorRGB=[0.0, 0.5, 0.5];
    data.object2.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object2.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ -0.95,  -0.95,
				      -0.95,  0.95,
				      0.95,  0.95,
				      0.95,   -0.95] ) , gl.STATIC_DRAW ); // load object's shape
    data.object2.floatsPerVertex=2;
    data.object2.NumberOfVertices=4;
    data.object2.drawMode=gl.LINE_LOOP;

    /* Static foreground object */
    data.object3={};
    // parameters for drawObject
    data.object3.position=[0,0, -0.7];
    data.object3.colorRGB=[0.5, 0.2, 0.0];
    data.object3.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object3.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, 
		  new Float32Array([ ,  -1,
				      -1,  1,
				      1,  -1,
				      1,   1,
                      0,   -1,
				      0,    1 ] ) , gl.STATIC_DRAW ); // load object's shape
    data.object3.floatsPerVertex=2;
    data.object3.NumberOfVertices=6;
    data.object3.drawMode=gl.TRIANGLE_FAN;
    
    //paletka1
    data.object4={};
    data.object4.punkt= 0;
    data.object4.speed=0.0005; // ?
    data.object4.direction= [0,0,0];
    // parameters for drawObject
    data.object4.position=[0,0,0.1];
    data.object4.colorRGB=[0.1, 1, 0.1];
    data.object4.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object4.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.95, 0.3,
                                                     -0.95, -0.3,
                                                     -0.9 , 0.3,
                                                     -0.9 , -0.3
                                                     ]) , gl.STATIC_DRAW ); // load object's shape
    data.object4.floatsPerVertex=2;
    data.object4.NumberOfVertices=4;
    data.object4.drawMode=gl.LINE_LOOP;
    
    //paletka2
    data.object5={};
    data.object5.punkt=0;
    data.object5.speed=0.0005; // ?
    data.object5.direction= [0,0,0];
    // parameters for drawObject
    data.object5.position=[0,0,0.1];
    data.object5.colorRGB=[0.1, 1, 0.1];
    data.object5.bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, data.object5.bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0.95, 0.3,
                                                      0.95, -0.3,
                                                      0.9 , 0.3,
                                                      0.9 , -0.3
                                                     ]) , gl.STATIC_DRAW ); // load object's shape
    data.object5.floatsPerVertex=2;
    data.object5.NumberOfVertices=4;
    data.object5.drawMode=gl.LINE_LOOP;


    
    /* animation */
    data.animation={};
    data.animation.requestId=0;

}

var drawObject=function( obj ) {
    /* draw object obj */
    gl.useProgram( glObjects.shaderProgram );
    gl.lineWidth(3);
    gl.enableVertexAttribArray(glObjects.aVertexPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.bufferId ); /* refer to the buffer */
    gl.vertexAttribPointer(glObjects.aVertexPositionLocation, obj.floatsPerVertex, gl.FLOAT, false, 0 /* stride */, 0 /*offset */);
    gl.uniform3fv( glObjects.uMoveLocation, obj.position );
    gl.uniform3fv( glObjects.uColorRGBLocation, obj.colorRGB );
    gl.drawArrays(obj.drawMode, 0 /* offset */, obj.NumberOfVertices);
}

var redraw = function() {
    var bg = data.background;
    /* prepare clean screen */
    gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    /* draw objects */
    drawObject(data.object1);
    drawObject(data.object2);
    drawObject(data.object3);
    drawObject(data.object4);
    drawObject(data.object5);

}
var checkboundaries = function(){
    //odbicia
    /*[-0.95, 0.3,
     -0.95, -0.3,
     -0.9 , 0.3,
     -0.9 , -0.3
     ]*/
    if(data.object1.position[1] <= data.object4.position[5] || data.object1.position[1]>=data.object4.position[7]){
        data.object1.direction[1]= -data.object1.direction[1];
        console.log("paletka4");
    }
    
    // punkty
    if(data.object1.position[0]-data.object1.radius+0.015 <= -1){
        data.object1.direction[0]= -data.object1.direction[0];
        console.log("left @ "+data.object1.direction+" @ "+data.object1.position); // || =| left
        data.object5.punkt+=1;
        console.log("G2:"+data.object5.punkt)
    }
    else if(data.object1.position[0]+data.object1.radius-0.015 >= 1){
        data.object1.direction[0]= -data.object1.direction[0];
        console.log("right @ "+data.object1.direction+" @ "+data.object1.position); // |= || right
        data.object4.punkt+=1;
        console.log("G1:"+data.object4.punkt)
    }
    //sufit podloga
    if(data.object1.position[1]-data.object1.radius <= -1){
        data.object1.direction[1]= -data.object1.direction[1];
        console.log("down @ "+data.object1.direction+" @ "+data.object1.position); // |_| down
    }
    else if(data.object1.position[1]+data.object1.radius >= 1){
        data.object1.direction[1]= -data.object1.direction[1];
        console.log("up @ "+data.object1.direction+" @ "+data.object1.position); // |``| up
    }
   
    
   

    
}

var animate=function( time ) {
    var timeDelta= time-data.animation.lastTime;
    data.animation.lastTime= time ;
    
        
    checkboundaries();
    var x=  data.object1.position[0]+data.object1.direction[0]* data.object1.speed*timeDelta;
    var y=  data.object1.position[1]+data.object1.direction[1]* data.object1.speed*timeDelta;
    
    data.object1.position[0]= (x+3)%2 -1;
    data.object1.position[1]= (y+3)%2 -1;

    // paletka1
    var x=  data.object4.position[0]+data.object4.direction[0]* data.object4.speed*timeDelta;
    var y=  data.object4.position[1]+data.object4.direction[1]* data.object4.speed*timeDelta;
    
    data.object4.position[0]= (x+3)%2 -1;
    data.object4.position[1]= (y+3)%2 -1;
    
    // paletka2
    var x=  data.object5.position[0]+data.object5.direction[0]* data.object5.speed*timeDelta;
    var y=  data.object5.position[1]+data.object5.direction[1]* data.object5.speed*timeDelta;
    
    data.object5.position[0]= (x+3)%2 -1;
    data.object5.position[1]= (y+3)%2 -1;
    
    redraw();
    gl.finish();
    data.animation.requestId = window.requestAnimationFrame(animate);
}

var animationStart= function(){
    data.animation.lastTime = window.performance.now();
    data.animation.requestId = window.requestAnimationFrame(animate);
}

var animationStop= function(){
    if (data.animation.requestId)
	window.cancelAnimationFrame(data.animation.requestId);
    data.animation.requestId = 0;
    redraw();
}





var htmlInit= function() {
    html={};
    html.html=document.querySelector('#htmlId');
    html.canvas= document.querySelector('#canvasId');
};

var glInit= function(canvas) {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    glObjects={}; 

    /* create executable shader program */
    glObjects.shaderProgram=compileAndLinkShaderProgram( gl, vertexShaderSrc, fragmentShaderSrc );
    /* attributes */
    glObjects.aVertexPositionLocation = gl.getAttribLocation(glObjects.shaderProgram, "aVertexPosition");
    /* uniform variables */
    glObjects.uMoveLocation = gl.getUniformLocation(glObjects.shaderProgram, "uMove");
    glObjects.uColorRGBLocation = gl.getUniformLocation(glObjects.shaderProgram, "uColorRGB");

};

var compileAndLinkShaderProgram=function ( gl, vertexShaderSource, fragmentShaderSource ){
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(vertexShader));
	console.log(gl);
	return null;
    }

    var fragmentShader =gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(fragmentShader));
	console.log(gl);
	return null;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	console.log("Could not initialise shaders");
	console.log(gl);
	return null;
    }
    // SUCCESS 
    return shaderProgram;
};


var callbackOnKeyDown =function (e){
    var code= e.which || e.keyCode;
    switch(code)
    {
    case 38: // up
            data.object5.direction=[0,1];
            if( data.animation.requestId == 0) animationStart();
            break;
    case 73: // I
            data.object4.direction=[0,1];
            data.object1.direction[1]=1;
            if( data.animation.requestId == 0) animationStart();
            break;
    case 40: // down
            data.object5.direction=[0,-1];
            if( data.animation.requestId == 0) animationStart();
            break;
    case 75: // K
            data.object4.direction=[0,-1];
            data.object1.direction[1]=-1;
            if( data.animation.requestId == 0) animationStart();
            break;
    case 37: // left
    case 74:// J
            data.object1.direction[0]=-1;
            if( data.animation.requestId == 0) animationStart();
            break;
    case 39:// right
    case 76: // L
            data.object1.direction[0]=1;
            if( data.animation.requestId == 0) animationStart();
            break;
    case 32: // space
            if( data.animation.requestId == 0) {
                animationStart();
            } else {
                animationStop();
            }
            break;
    }
}

window.onload= function(){
    htmlInit();
    glInit( html.canvas );
    dataInit();


    redraw(); 
    window.onkeydown=callbackOnKeyDown;
};


