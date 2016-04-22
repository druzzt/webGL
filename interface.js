var commandField = document.getElementById("command");
var valueField = document.getElementById("value");
var warning = document.getElementById("warning");


var command, value;

/**
 * parameters for drawing field
 */

var xMin = -100;
var xMax = 100;
var yMin = -100;
var yMax = 100;



var turtle = new Pen("canvas");
//turtle.pendown();//draw
//turtle.goto(100, 150, 0);
//var points = [[100, 150], [200, 150],  [200, 250],  [100, 250], [100, 200]  ];
//var points = [[100, 150,-100], [200, 150,-100],  [200, 250,-100],  [100, 250,-100], [100, 200,-100]  ];
//var points = [[100, 150,0], [200, 150,0],  [200, 250,0],  [100, 250,0], [100, 200,0]  ];

var points =[[0, 0, 0]];
//var points =[[0, 0, 0],[50, 0, 0],[50, 50, 0],[50, 0, 0],[50, 0, 50]];
turtle.x = points[points.length][0];
turtle.y = points[points.length][1];
turtle.z = points[points.length][2];

var readCommand = function(){

    command = commandField.value;
    value   = valueField.value;
    warning.style.visibility = "hidden";

    switch(command){

        case("go"):
            turtle.go(value);
            //points[points.length] = [turtle.x, turtle.y, turtle.z];
            break;
        case("turn"):
            value = parseInt(value,10)
            while(value < 0)
			   value += 360;

            turtle.turn(value);
            break;
        case("turnZ"):
            value = parseInt(value,10)
            while(value < 0)
                value += 360;

            turtle.turnZ(value);
            break;
        default:
            console.log("default");
            warning.style.visibility = "visible";


    }

    //turtle.draw();


    clearInput();

}

var clearInput = function(){
    commandField.value = "";
    valueField.value = "";
    command = "";
    value = "";
}
/*
var keyDown = function(e){

    //e.preventDefault();

    var code = e.which || e.keyCode;

    switch(code){
        case 13 :
            readCommand();
            break;
    };


}



onkeydown = keyDown;

*/
