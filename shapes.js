"use strict";

var gl;
var points = [];
var linePoints = [];
var radius = 0.7;
var divisions = 3;


function createShapes(divisions){
   points.push([0.0 , 0.0]);
   var steps = (2 * Math.PI) / divisions;

   for(var i = 0; i <= (2 * Math.PI) + 0.1; i = i + steps){
      var x = radius * Math.cos(i);
      var y = radius * Math.sin(i);
      points.push([x,y]);

      if(i > 0){
         linePoints.push([x , y]);
      }
      linePoints.push([0.0 , 0.0]);
      linePoints.push([x , y]);
      linePoints.push([x , y]);
   }
   linePoints.push([0.0, radius]);
}






window.onload = function init()
{
   var canvas = document.getElementById( "gl-canvas" );

   gl = WebGLUtils.setupWebGL( canvas );
   if ( !gl ) { alert( "WebGL isn't available" ); }


   //slider

   document.getElementById("sides").onchange = function(event) {
      divisions = this.value;
      showValue(this.value);
      points = [];
      linePoints = [];
      init();
   }
   
   //populate the points array with the vertices
   //
   createShapes(divisions);

   //  Configure WebGL

   gl.viewport( 0, 0, canvas.width, canvas.height );
   gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

   //  Load shaders and initialize attribute buffers

   var program = initShaders( gl, "vertex-shader", "fragment-shader" );
   gl.useProgram( program );

   // Load the data into the GPU

   var bufferId = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
   gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


   // Associate out shader variables with our data buffer

   var vPosition = gl.getAttribLocation( program, "vPosition" );

   gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
   gl.enableVertexAttribArray( vPosition );

   var fColor = gl.getUniformLocation( program, "fColor");

   render(fColor);

   var bufferId = gl.createBuffer();
   gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
   gl.bufferData( gl.ARRAY_BUFFER, flatten(linePoints), gl.STATIC_DRAW );

   var vPosition = gl.getAttribLocation( program, "vPosition" );

   gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
   gl.enableVertexAttribArray( vPosition );

   renderLines(fColor);

};


function render(fColor) {
   gl.clear( gl.COLOR_BUFFER_BIT );
   gl.uniform4fv(fColor, [1,0,0,1]);
   gl.drawArrays( gl.TRIANGLE_FAN, 0,points.length);
}

function renderLines(fColor) {
   // gl.clear( gl.COLOR_BUFFER_BIT );
   gl.uniform4fv(fColor, [0,0,0,1]);
   gl.lineWidth(2);
   gl.drawArrays(gl.LINES, 0,(divisions * 2)* 2);
}
