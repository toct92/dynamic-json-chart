function generateSchema(){	
	/*Global Configuration For Nodes and Canvas
	*	CANVAS_ID				:	Id of Canvas element
	*	RECTANGLE_STROKE_STYLE	:	Border colour for nodes
	*	RECTANGLE_LINE_WIDTH	:	Border width for nodes
	*	VALUE_FONT				:	Font Style of sub-text
	*	HEADING_FONT			:	Font Style for heading text
	*	MAX_LEVELS				:	Max Supported levels
	*	NODE_WIDTH				:	Width of the Node
	*	NODE_HEIGHT				:	Height of the Node
	*	FONT_HEIGHT				:	Font Height
	*	TEXT_SPACING			:	Spacing between text (when splitted)
	*/		
	var Config = {
		CANVAS_ID : 'canvas',
		RECTANGLE_STROKE_STYLE : 'black',
		RECTANGLE_LINE_WIDTH : 1,
		VALUE_FONT : '9px Arial',
		HEADING_FONT : 'bold 10.5px Arial',
		VALUE_FILL_STYLE : 'red',
		MAX_LEVELS : 6,
		NODE_WIDTH : 205,
		NODE_HEIGHT : 75,
		FONT_HEIGHT : 12,
		TEXT_SPACING : 2,
		NODE_Y_GAP	: 30,
		NODE_X_GAP	: 80,
		LINE_TEXT_FONT : '9px arial'
	};
		
	
	
	var ctx2d ;

		
	/*Global Initializations*/
	var nodes = [];
	var connectors = [];
	var entityDetailsObject;
	

	/* Drag Initialization */
	var dragTarget;
	var startX;
	var startY;
	var isDown=false;
	var offsetX ;
	var offsetY ;
	//Stores the canvas element
	var canvasElement; 





	/*
		* @param dimensionObject 	: 	ObjectContaining the x,y start coordinate for the node
		* @param text  				:  	Entity object contining the text to be populated in the node		
	*/
	draw_individual_node = function(dimensionObject,text) {
		var x = dimensionObject.x;
		var y = dimensionObject.y;
		var w = Config.NODE_WIDTH 
		var h = Config.NODE_HEIGHT 
		var fh = Config.FONT_HEIGHT
		var spl = Config.TEXT_SPACING 
		
		
		var writeHeading = {
		
		}
		
		/*
		 * @param ctx   : The 2d context 
		 * @param mw    : The max width of the text accepted
		 * @param font  : The font used to draw the text
		 * @param text  : The text to be splitted   into 
		 */
		var split_lines = function(ctx, mw, font, text) {
			// We give a little "padding"
			// This should probably be an input param
			// but for the sake of simplicity we will keep it
			// this way
			mw = mw - 10;
			// We setup the text font to the context (if not already)
			ctx2d.font = font;
			// We split the text by words 
			var words = text.split(' ');
			var new_line = words[0];
			var lines = [];
			for(var i = 1; i < words.length; ++i) {
			   if (ctx.measureText(new_line + " " + words[i]).width < mw) {
				   new_line += " " + words[i];
			   } else {
				   lines.push(new_line);
				   new_line = words[i];
			   }
			}
			lines.push(new_line);       
			return lines;
		}
		
			
		if (ctx2d) {        
			ctx2d.globalCompositeOperation = 'source-over';
			ctx2d.strokeStyle=Config.RECTANGLE_STROKE_STYLE;
			ctx2d.lineWidth = Config.RECTANGLE_LINE_WIDTH;
			ctx2d.fillStyle = "#1b9bb1";
			ctx2d.fill();
			ctx2d.globalAlpha=0.3;
			ctx2d.fillRect(x, y, w, h);
			ctx2d.strokeRect(x, y, w, h);
			
			
			
			ctx2d.strokeStyle=Config.RECTANGLE_STROKE_STYLE;
			ctx2d.lineWidth = Config.RECTANGLE_LINE_WIDTH;
			ctx2d.fillStyle = "#000";
			ctx2d.globalAlpha=1;
			ctx2d.fill();
			
			
			// Paint text
			var content = split_lines(ctx2d, w, Config.VALUE_FONT, text.entity);
			var p = 0;
			while(p<text.key.length){
				var sub_content = split_lines(ctx2d, w, Config.VALUE_FONT, text.key[p]); 
				content.push(sub_content);
				p=p+1;
				}
			
			
			// Block of text height
			var both = content.length * (fh + spl);
			if (both >= h) {
				// We won't be able to wrap the text inside the area
				// the area is too small. We should inform the user 
				// about this in a meaningful way
			} else {
				// We determine the y of the first line
				var ly = (h - both)/2 + y + spl*content.length;
				var lx = 0;
				for (var j = 0, ly; j < content.length; ++j, ly+=fh+spl) {
				   
					if(j==0){
						ctx2d.font = Config.HEADING_FONT;
						lx = x+w/2-ctx2d.measureText(content[j]).width/2;
						ctx2d.fillText( content[j], lx, ly);
						ly+=20;
					}                 
					
					else{
					ctx2d.font = Config.VALUE_FONT
					lx = x+w/2-ctx2d.measureText(content[j]).width/2;
					ctx2d.fillText(content[j], lx, ly);
					}
					
					
				}
			}
			
			
		} else {
		// Handle Expection
		}
	}


		
	function drawConnectors(){
	debugger;
		ctx2d.clearRect(0,0,canvas.width,canvas.height);
		ctx2d.fillStyle = "#eef5f6";
		ctx2d.fill();
		ctx2d.fillRect(0,0,canvas.width,canvas.height);	
		ctx2d.fillStyle = "#000000";
		ctx2d.fill();		
		for(var i=0;i<connectors.length;i++){
			
			var connector=connectors[i];
			var nodeFrom=nodes[connector.from];
			var nodeTo=nodes[connector.to];
			var fk = connector.link
			ctx2d.beginPath();
				
			if(nodeFrom.z==nodeTo.z){
				if(nodeFrom.x + (Config.NODE_WIDTH/2) < nodeTo.x){
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH),nodeFrom.y+(Config.NODE_HEIGHT/2));
					ctx2d.lineTo(nodeTo.x,nodeTo.y+(Config.NODE_HEIGHT/2));
					}
				else if(nodeFrom.x + (Config.NODE_WIDTH/2) > nodeTo.x ){
					ctx2d.moveTo(nodeFrom.x,nodeFrom.y+(Config.NODE_HEIGHT/2));
					ctx2d.lineTo(nodeTo.x+(Config.NODE_WIDTH),nodeTo.y+(Config.NODE_HEIGHT/2));
					}
			}
			
			if(nodeFrom.z!=nodeTo.z){	
				if(nodeFrom.x   == nodeTo.x && nodeFrom.y > nodeTo.y){
					ctx2d.font = Config.LINE_TEXT_FONT;
					ctx2d.fillText(fk, nodeTo.x+(Config.NODE_WIDTH/2)+3, nodeFrom.y-3);
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeFrom.y);
					ctx2d.lineTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeTo.y + Config.NODE_HEIGHT);
				}
				
				else if(nodeFrom.x   == nodeTo.x && nodeFrom.y < nodeTo.y){
					ctx2d.font = Config.LINE_TEXT_FONT;
					ctx2d.fillText(fk, nodeFrom.x+(Config.NODE_WIDTH/2)+3, nodeTo.y-3);
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeTo.y);
					ctx2d.lineTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeFrom.y + Config.NODE_HEIGHT);
				}
			
				else if((nodeFrom.x   > nodeTo.x + (Config.NODE_WIDTH/2) - (Config.NODE_Y_GAP/2)) && nodeFrom.y>nodeTo.y + 0.9*Config.NODE_HEIGHT){	
				console.log("1");			
					ctx2d.font = Config.LINE_TEXT_FONT;
					ctx2d.fillText(fk, nodeFrom.x+(Config.NODE_WIDTH/2)+3, nodeFrom.y-3);ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeFrom.y);
					ctx2d.lineTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeTo.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeTo.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.lineTo(nodeTo.x+(Config.NODE_WIDTH/2) + 10,nodeTo.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.moveTo(nodeTo.x+(Config.NODE_WIDTH/2) + 10,nodeTo.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.lineTo(nodeTo.x+(Config.NODE_WIDTH/2) + 10,nodeTo.y+(Config.NODE_HEIGHT));				
				}
				
				else if((nodeFrom.x - (Config.NODE_WIDTH/2)   < nodeTo.x ) && nodeFrom.y + 0.9*Config.NODE_HEIGHT < nodeTo.y ){
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2)+10,nodeFrom.y + Config.NODE_HEIGHT);
					ctx2d.lineTo(nodeFrom.x+(Config.NODE_WIDTH/2)+10,nodeFrom.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2)+10,nodeFrom.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.lineTo(nodeTo.x+(Config.NODE_WIDTH/2),nodeFrom.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.moveTo(nodeTo.x+(Config.NODE_WIDTH/2),nodeFrom.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.lineTo(nodeTo.x+(Config.NODE_WIDTH/2),nodeTo.y);
					ctx2d.font = Config.LINE_TEXT_FONT;
					ctx2d.fillText(fk, nodeTo.x+(Config.NODE_WIDTH/2)+3, nodeTo.y-3);				
				}

				else if((nodeFrom.x  - (Config.NODE_WIDTH/2)  ) < nodeTo.x ){
					ctx2d.font = Config.LINE_TEXT_FONT;
					ctx2d.fillText(fk, nodeFrom.x+(Config.NODE_WIDTH/2)+3, nodeFrom.y-3);
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeFrom.y);
					ctx2d.lineTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeTo.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2),nodeTo.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.lineTo(nodeTo.x+(Config.NODE_WIDTH/2)-10,nodeTo.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.moveTo(nodeTo.x+(Config.NODE_WIDTH/2)-10,nodeTo.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.lineTo(nodeTo.x+(Config.NODE_WIDTH/2)-10,nodeTo.y+(Config.NODE_HEIGHT));
				}
				
				else if((nodeTo.x  - (Config.NODE_Y_GAP)) < nodeFrom.x + Config.NODE_WIDTH/2){
					ctx2d.font = Config.LINE_TEXT_FONT;
					ctx2d.fillText(fk, nodeTo.x+(Config.NODE_WIDTH/2)+3, nodeTo.y-3);
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2)-10,nodeFrom.y+Config.NODE_HEIGHT);
					ctx2d.lineTo(nodeFrom.x+(Config.NODE_WIDTH/2)-10,nodeFrom.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.moveTo(nodeFrom.x+(Config.NODE_WIDTH/2)-10,nodeFrom.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.lineTo(nodeTo.x+(Config.NODE_WIDTH/2),nodeFrom.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.moveTo(nodeTo.x+(Config.NODE_WIDTH/2),nodeFrom.y+(3*Config.NODE_HEIGHT/2)-20);
					ctx2d.lineTo(nodeTo.x+(Config.NODE_WIDTH/2),nodeTo.y);
				}		
				
			}
			ctx2d.stroke();
		}
			 
	}
	
	this.canvasResize = function(x){		
		offsetX = x.offsetLeft;
		offsetY = x.offsetTop;
	}
		
	function draw(object){
		//alert(canvas.width);
		//alert(canvas.height);			
		drawConnectors();
		drawNodes(object);
			
	}
		
	function drawNodes(object){
		var i = 0;
		while(i < object.length){
			draw_individual_node(nodes[i], object[i]);				
			i++;
		}	
	}
		
	this.generate = function(nodeObject, conObject, canvas){
		/* Canvas initializtions*/
		debugger;
		connectors = [];
		nodes = [];
		var levelElements = [];
		for(var i=0; i < Config.MAX_LEVELS; i++){
			levelElements.push(0);		
		} 	
		canvasElement = canvas;
		canvasElement.width  = 1800; 
		canvasElement.height = (Config.NODE_HEIGHT + 50) * Config.MAX_LEVELS +30;
		ctx2d = canvasElement.getContext('2d');
		offsetX = canvasElement.offsetLeft;
		offsetY = canvasElement.offsetTop;
		ctx2d.clearRect(0,0,canvas.width,canvas.height);
		
		/*Generator*/
		var i = 0;
		var j = 0;
		entityDetailsObject = nodeObject;
		while(i < nodeObject.length){
				dimensionOject = {}			
				dimensionOject['x'] = 50+(levelElements[nodeObject[i].level]*(Config.NODE_WIDTH+Config.NODE_Y_GAP));
				levelElements[nodeObject[i].level]++;
				dimensionOject['y'] = 50 + (nodeObject[i].level*(Config.NODE_HEIGHT+Config.NODE_X_GAP));			
				dimensionOject['z'] = nodeObject[i].level;				
				nodes.push(dimensionOject);
				i++;
			}
		i = 0;	
		while(i < conObject.length){
				connectorDimensionObject = {};
				j = 0;
				while(j<nodeObject.length){
					if(conObject[i].from == nodeObject[j].entity){
						connectorDimensionObject['from'] = j;						
					} 
					if(conObject[i].to == nodeObject[j].entity){
						connectorDimensionObject['to'] = j;						
					} 
					j++;
				}
				connectorDimensionObject['link'] = conObject[i].link;
				
				
				connectors.push(connectorDimensionObject);
				i++;
		}	
		draw(nodeObject);
	}
	function hit(x,y){
			for(var i=0;i<nodes.length;i++){
				var node=nodes[i];
				if(x>=node.x && x<=node.x+Config.NODE_WIDTH && y>=node.y && y<=node.y+Config.NODE_HEIGHT){
					dragTarget=node;
					return(true);
				}
			}
			return(false);
		}

		this.handleMouseDown = function(e){
		  startX=parseInt(e.pageX-offsetX);
		  startY=parseInt(e.pageY-offsetY);

		  
		  isDown=hit(startX,startY);
		}

		this.handleMouseUp = function(e){
		  
		  dragTarget=null;
		  isDown=false;
		}

		this.handleMouseOut = function(e){
			this.handleMouseUp(e);
		}

		this.handleMouseMove = function(e){
		  if(!isDown){return;}

		  mouseX=parseInt(e.pageX-offsetX);
		  mouseY=parseInt(e.pageY-offsetY);

		  
		  var dx=mouseX-startX;
		  var dy=mouseY-startY;
		  startX=mouseX;
		  startY=mouseY;
		  dragTarget.x+=dx;
		  dragTarget.y+=dy;
		  draw(entityDetailsObject);
		 }		
		
}

var SCHEMA_GEN = new generateSchema();