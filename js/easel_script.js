// The minimum and maximum lengths of the genes. 
var min = 30, max = 100;
var num_genes = 100;

// Store the genes and total gene length.
var genes1 = [], genes2 = [], genes3 = [];
var lengths = [], total_gene_length = 0;
var gene_height = 15;

// Store the desired colors of the genes. 
var first_org_color = "#00802b", second_org_color = "#00cc44", third_org_color = "#1aff66";

// Instantiate the canvas stage and graphics.
var lower_canvas = document.getElementById("lower_canvas"), upper_canvas = document.getElementById("upper_canvas"), canvas_height = 220;
var lower_stage = new createjs.Stage(lower_canvas), upper_stage = new createjs.Stage(upper_canvas);

// Store the beginning x and y position of the first row of genes. 
var x_position = 20;
var y_position1 = 100, y_position2 = 135, y_position3 = 170;
var text_y1 = 90, text_y2 = 125, text_y3 = 160;

// Define the variables that will be used within the html table. 
var current_length = 0, current_color = "";

// Define the view.
var view = {
    width: 0,
    height: 30,
    color: "#00ff99"
}
var view_y1 = 20, view_y2 = 40, view_y3 = 60;
var view_rects1 = [], view_rects2 = [], view_rects3 = [];
var view_genes1 = [], view_genes2 = [], view_genes3 = [], view_lengths = [];

// Define the width of the canvas. 
var inner_width = window.innerWidth-15;

// Define the scrollbar.
var scrollbar = {
    // Define the scrollbar properties.
    track_thickness: 10,
    track_color: "#d9d9d9",
    track_start: x_position,
    track_end: inner_width-x_position,
    track_width: inner_width-(2*x_position),
    thumb_thickness: 14,
    thumb_width: 30,
    thumb_color: "#8c8c8c",
    thumb_radius: 3,

    // The factor by which to map a scroll movement to rectangle movement.
    factor: 0
}
// Move the mouse on the pressmove events.
scrollbar.setup_move = function (){
    this.thumb.on("pressmove", function handle(event){
        if (event.stageX+(scrollbar.thumb_width/2) <= scrollbar.track_end && event.stageX-(scrollbar.thumb_width/2) >= scrollbar.track_start){
            scrollbar.thumb.x = event.stageX-x_position-(scrollbar.thumb_width/2);
        }

        upper_stage.update();
    });
}
// Adjust the width of the thumb.
scrollbar.finalize_thumb_width = function (){
    var last_x = Math.ceil((total_gene_length-view.width)/scrollbar.factor);
    scrollbar.thumb_width = scrollbar.track_width-last_x;
}
// Add the viewport.
scrollbar.add_viewport = function (the_viewport, rep_rect){
    this.thumb.on("pressmove", function handle(event){
        the_viewport.view.x = -rep_rect.x/the_viewport.factor;
    });
}
// Add the rectangles to the scroll movement.
scrollbar.add_rects = function (rects_to_add){
    this.thumb.on("pressmove", function handle(event){
        for (var n = 0; n < rects_to_add.length; n += 1){
            rects_to_add[n].rect.x = -(scrollbar.factor*scrollbar.thumb.x);
        }
        console.log("finished");
        // upper_stage.update();
    });
}

// Gene constructor.
function gene(h, l, c, t){
    this.height = h;
    this.length = l;
    this.color = c;
    this.radius = 5;

    this.type = t;

    this.display_info = function (){
        var ang_controller = angular.element(document.getElementById("controller"));
        ang_controller.scope().gene_length = l;
        ang_controller.scope().gene_color = c;
        ang_controller.scope().$apply();
    }
}

// Define the viewport.
var viewport = {
    color: "#004d00",
    height: 55,
    width: 30,
    radius: 5,

    factor: 0
}
// Initialize the factor by which to move the view along with the scrollbar. 
viewport.initialize_factor = function (){
    viewport.factor = inner_width/(scrollbar.track_width-scrollbar.thumb_width);
}

// Generates a random number between the specified minimum and maximum.
function generate_gene_width(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Generate the random lengths and determine the total length.
var random_length;
for (var n = 0; n < num_genes; n += 1){
    random_length = generate_gene_width(min, max);
    total_gene_length += random_length;
    lengths[n] = random_length;
}

// Determine the factor that maps the thumb movement to the rectangles' movement. 
scrollbar.factor = Math.ceil(total_gene_length/inner_width);

// Determine the lengths of the view elements. 
var new_length;
viewport.factor = total_gene_length/(inner_width-(2*x_position));
for (var n = 0; n < num_genes; n += 1){
    new_length = lengths[n]/viewport.factor;
    view.width += new_length;
    view_lengths[n] = new_length;
}

// Generate the first set of random genes and determine the total gene length.
function initialize_genes(genes_arr, lengths_arr, gene_color, gene_type){
    var current_gene, random_length;
    for (var n = 0; n < num_genes; n += 1){
        random_length = lengths_arr[n];
        current_gene = new gene(gene_height, random_length, gene_color, gene_type);
        genes_arr[n] = current_gene;
    }
}

// Instantiate the angular app.
var app = angular.module("genomics_app", []);
app.controller("genomics_controller", function($scope) {
    // Retrieve the length of the window.
    $scope.window_width = function(){
        return inner_width;
    }
});

// Draw the genes and store the rectangles representing the genes.
function draw_row(genes_arr, x_pos, y_pos, stage){
    var current_gene;
    var rect;
    var graphics = new createjs.Graphics();
    for (var n = 0; n < genes_arr.length; n +=1){
        current_gene = genes_arr[n];
        rect = current_gene.rect = new createjs.Shape();
        rect.graphics.beginFill(current_gene.color).drawRoundRect(x_pos, y_pos, current_gene.length, current_gene.height, current_gene.radius);
        rect.cache(x_pos, y_pos, current_gene.length, current_gene.height);
       
        if (current_gene.type === "normal"){
            rect.on("click", current_gene.display_info);
        }

        stage.addChild(rect);
        
        x_pos += current_gene.length;
    }
 
    stage.update();
}

// Wait until the document is ready to draw the genes.
angular.element(document).ready(function(){
    // Initialize the three rows of genes. 
    initialize_genes(genes1, lengths, first_org_color, "normal");
    initialize_genes(genes2, lengths, second_org_color, "normal");
    initialize_genes(genes3, lengths, third_org_color, "normal");

    // Draw the three rows of genes. 
	draw_row(genes1, x_position, y_position1, upper_stage);
    draw_row(genes2, x_position, y_position2, upper_stage);
    draw_row(genes3, x_position, y_position3, upper_stage);

    // Draw the text corresponding with each row.
    var text1 = new createjs.Text("Sequence 1:");
    text1.x = x_position;
    text1.y = text_y1;
    upper_stage.addChild(text1);
    var text2 = new createjs.Text("Sequence 2:");
    text2.x = x_position;
    text2.y = text_y2;
    upper_stage.addChild(text2);
    var text3 = new createjs.Text("Sequence 3:");
    text3.x = x_position;
    text3.y = text_y3;
    upper_stage.addChild(text3);

    // Initialize the compact genes.
    // initialize_genes(view_genes1, view_lengths, first_org_color, "view");
    // initialize_genes(view_genes2, view_lengths, second_org_color, "view");
    // initialize_genes(view_genes3, view_lengths, third_org_color, "view");

    // // Draw the compact genes.
    // draw_row(view_genes1, x_position, view_y1, upper_stage);
    // draw_row(view_genes2, x_position, view_y2, upper_stage);
    // draw_row(view_genes3, x_position, view_y3, upper_stage);

    var view_rect1 = new createjs.Shape();
    view_rect1.graphics.beginFill(first_org_color).drawRoundRect(x_position, view_y1, inner_width-2*x_position, gene_height, 5);
    view_rect1.cache(x_position, view_y1, inner_width-2*x_position, gene_height, 5);
    upper_stage.addChild(view_rect1);
    var view_rect2 = new createjs.Shape();
    view_rect2.graphics.beginFill(second_org_color).drawRoundRect(x_position, view_y2, inner_width-2*x_position, gene_height, 5);
    view_rect2.cache(x_position, view_y2, inner_width-2*x_position, gene_height, 5);
    upper_stage.addChild(view_rect2);
    var view_rect3 = new createjs.Shape();
    view_rect3.graphics.beginFill(third_org_color).drawRoundRect(x_position, view_y3, inner_width-2*x_position, gene_height, 5);
    view_rect3.cache(x_position, view_y3, inner_width-2*x_position, gene_height, 5);
    upper_stage.addChild(view_rect3);

    // Draw the scrollbar track.
    scrollbar.track = new createjs.Shape();
    scrollbar.track.graphics.beginFill(scrollbar.track_color).drawRect(x_position, canvas_height-scrollbar.track_thickness-2, scrollbar.track_width, scrollbar.track_thickness);
    upper_stage.addChild(scrollbar.track);

    // Adjust the scrollbar to limit the scrolling.
    scrollbar.finalize_thumb_width();

    // Draw the scrollbar thumb.
    scrollbar.thumb = new createjs.Shape();
    scrollbar.thumb.graphics.beginFill(scrollbar.thumb_color).drawRoundRect(x_position, canvas_height-scrollbar.thumb_thickness, scrollbar.thumb_width, scrollbar.thumb_thickness, scrollbar.thumb_radius);
    upper_stage.addChild(scrollbar.thumb);
    
    // Setup the mouse move events. 
    scrollbar.setup_move();

    // Initialize the viewport width
    viewport.width = Math.ceil(inner_width/(total_gene_length/view.width));

    // Draw the viewport. 
    viewport.view = new createjs.Shape();
    viewport.view.graphics.setStrokeStyle(2).beginStroke(viewport.color).drawRoundRect(x_position, view_y1, viewport.width, viewport.height, viewport.radius);
    scrollbar.add_viewport(viewport, genes1[0].rect);
    upper_stage.addChild(viewport.view);

    // Add all the rectangles to the press movement of the scrollbar.
    scrollbar.add_rects(genes1);
    scrollbar.add_rects(genes2);
    scrollbar.add_rects(genes3);

    // Update the stage.
    upper_stage.update();
});