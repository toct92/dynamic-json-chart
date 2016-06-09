# dynamic-json-chart   
Lightweight dynamic flow chart generator from json objects

The dynamic JSON chart creates rich flow chart wherein the user can give inputs for the the data in nodes, the links data between the nodes and also linking text. It is also interactive, i.e you can drag the nodes at your will and the links will be re-rendered to make the chart readable at all times.

Click to view a <a href="https://rawgit.com/toct92/dynamic-json-chart/master/canvas.html">DEMO</a><br>

To create a chart, use the generate function:
```
SCHEMA_GEN.generate(<Node Data JSON Object>, <Link Data JSON Object>, <HTML5 Canvas Element Object>);
```


To enable drag functionality, add these three lines of code: (requires JQuery)
```
$("#<canvas_element_id\>").mousedown(function(e){SCHEMA_GEN.handleMouseDown(e);});
$("#<canvas_element_id\>").mousemove(function(e){SCHEMA_GEN.handleMouseMove(e);});
$("#<canvas_element_id\>").mouseup(function(e){SCHEMA_GEN.handleMouseUp(e);});
```

# node-data
JSON Format for NODE DATA: The node data is an array of dictionary. Example:
```
[{"key": ["desc_line_1", "desc_line_2"], "level": "0", "entity": "Node_1_Title"}, 
{"key": ["desc_line_1", "desc_line_2"], "level": "1", "entity": "Node_2_Title"}, 
{"key": ["desc_line_1"], "level": "1", "entity": "Node_3_Title"}]
```

<b>entity</b>: Title of the node<br>
<b>level</b>: Rownum of the node (top == 0)<br>
<b>key</b>: An array of string which contains the description of the node<br>

# link-data
JSON Format for LINK DATA: The link data is an array of dictionary. Example:
```
[{"link": "ACCOUNT_PK", "from": "Node_1_Title", "to": "Node_2_Title"}, 
{"link": "ACCOUNT_PK", "from": "Node_1_Title", "to": "Node_3_Title"}]
```

<b>from</b>: \<a_node_data_entity_field_data><br>
<b>to</b>: \<a_node_data_entity_field_data><br>
<b>link</b>: Text to be displayed on the linking line<br>

# Config changes
There are several global configurations that can be done before rendering a chart. All this global configuration can be set in the SCHEMA_GEN config variable. The following are the list of global configurations:
```
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
```
