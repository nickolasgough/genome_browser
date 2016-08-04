// The minimum and maximum lengths of the genes. 
var min = 30, max = 100;

// The number of genes to display on the canvas.
var NUM_GENES = 5000;

// The height of the genes.
var GENE_HEIGHT = 25;

// The canvas height.
var canvas_height = 550;

// The initial x and y position at which to start drawing. 
function GENES(){
    this.genes = [];
    this.start = 0;
    this.end = 0;
}
var GENES_1 = new GENES(), GENES_2 = new GENES(), GENES_3 = new GENES(); 
var ghgap = 60;
var GENES_X = 50, GENE_Y1 = 325, GENE_Y2 = GENE_Y1+ghgap, GENE_Y3 = GENE_Y2+ghgap, GENE_THICKNESS = 3;

// The desired inner width.
var INNER_WIDTH = window.innerWidth-15;

// The miniature genes. 
var MINI_GENES_1 = [], MINI_GENES_2 = [], MINI_GENES_3 = [];
var mhgap = 30;
var MINIS_X = 50, MINIS_Y1 = 100, MINIS_Y2 = MINIS_Y1+mhgap, MINIS_Y3 = MINIS_Y2+mhgap;

// Define the variables for the viewport.
var VIEW_X = GENES_X, VIEW_Y = MINIS_Y1, VIEW_HEIGHT = 85, VIEW_WIDTH = INNER_WIDTH-2*VIEW_X, VIEW_THICKNESS = 5;

// Define the number of elements for which to display lines. 
var NUM_EL = 1000;

// The text to display at the top.
var greeting = "Greetings!", greeting_x1 = MINIS_X, greeting_y1 = 20, greeting_x2 = 100, greeting_y2 = 100;
var sequence_1 = "Sequence 1:", sequence_1_x1 = GENES_X, sequence_1_y1 = GENE_Y1-20;
var sequence_2 = "Sequence 2:", sequence_2_x1 = GENES_X, sequence_2_y1 = GENE_Y2-20;
var sequence_3 = "Sequence 3:", sequence_3_x1 = GENES_X, sequence_3_y1 = GENE_Y3-20;

// Define the bottom text variables. 
var TEXT_X = GENES_X, TEXT_Y = canvas_height-30;

// The gene constructor.
function gene(g_width, x_pos, y_pos){
    this.width = g_width;
    this.x = x_pos;
    this.y = y_pos;
}

// Generates a random number between the specified minimum and maximum.
function generate_gene_width(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Generate all the gene widths and the total gene widths.
var TOTAL_GENE_WIDTH_1 = 0, TOTAL_GENE_WIDTH_2 = 0, TOTAL_GENE_WIDTH_3 = 0;
function initialize_genes(x_pos, y_pos, genes){
    var total_width = 0;
    for (var n = 0; n < NUM_GENES; n += 1){
        var rand_gene_width = generate_gene_width(min, max);
        x_pos += rand_gene_width/2;
        genes.genes[n] = new gene(rand_gene_width, x_pos, y_pos);
        total_width += rand_gene_width;
        if (total_width > (INNER_WIDTH-GENES_X) && genes.end === 0){
            genes.end = n;
        }
        x_pos += rand_gene_width/2;
    }

    return total_width;
}
TOTAL_GENE_WIDTH_1 = initialize_genes(GENES_X, GENE_Y1, GENES_1);
TOTAL_GENE_WIDTH_2 = initialize_genes(GENES_X, GENE_Y2, GENES_2);
TOTAL_GENE_WIDTH_3 = initialize_genes(GENES_X, GENE_Y3, GENES_3);

// The factor by which to 
function initialize_mini_genes(x_pos, y_pos, genes, orig_genes, total_width){
    var factor = total_width/INNER_WIDTH;
    for (var n = 0; n < NUM_GENES; n += 1){
        var new_width = orig_genes[n].width/factor;
        if (n > 0){
            x_pos += new_width/2;
        }
        genes[n] = new gene(new_width, x_pos, y_pos);
        x_pos += new_width/2;
    }
}
// initialize_mini_genes(MINIS_X, MINIS_Y1, MINI_GENES_1, GENES_1.genes, TOTAL_GENE_WIDTH_1);
// initialize_mini_genes(MINIS_X, MINIS_Y2, MINI_GENES_2, GENES_2.genes, TOTAL_GENE_WIDTH_2);
// initialize_mini_genes(MINIS_X, MINIS_Y3, MINI_GENES_3, GENES_3.genes, TOTAL_GENE_WIDTH_3);

// Instantiate the angular app.
var app = angular.module("genomics_app", []);
app.controller("genomics_controller", function($scope) {
});

// Creates the genes on the graphics. 
function create_genes(genes, graphics){
    for (var n = 0; n < NUM_GENES; n += 1){
        var gene = genes[n];
        var check_left = gene.x+gene.width;
        var check_right = gene.x-gene.width;
        if (check_left >= 0 && check_right <= INNER_WIDTH){
            graphics.ellipse(gene.x, gene.y, gene.width, GENE_HEIGHT);
        }
    }
}

// Draws the genes according to their specified x and y position.
function draw_genes(genes, gene_row){
    var genes_arr = genes.genes;
    for (var n = genes.start; n <= genes.end; n += 1){
        var gene = genes_arr[n];
        var check_left = gene.x+gene.width;
        var check_right = gene.x-gene.width;
        if (check_left >= 0 && check_right <= INNER_WIDTH){
            if (n == (gene_num-1) && gene_row === row){
                stroke("#ff0000");
            }
            ellipse(gene.x, gene.y, gene.width, GENE_HEIGHT);
            if (n == (gene_num-1) && gene_row === row){
                stroke("black");
            }
        }
        else if (check_right > INNER_WIDTH){
            return;
        }
    }
}

// Move the elements when the mouse is dragged. 
var initial_x = GENES_X;
var LARGEST_WIDTH = Math.max(TOTAL_GENE_WIDTH_1, TOTAL_GENE_WIDTH_2, TOTAL_GENE_WIDTH_3);
var SMALLEST_WIDTH = Math.min(TOTAL_GENE_WIDTH_1, TOTAL_GENE_WIDTH_2, TOTAL_GENE_WIDTH_3);
var final_x = INNER_WIDTH-initial_x;

// Determine how much to shave off. 
var FACTOR = LARGEST_WIDTH/VIEW_WIDTH;
var SHAVE_1 = (LARGEST_WIDTH-TOTAL_GENE_WIDTH_1)/FACTOR;
var SHAVE_2 = (LARGEST_WIDTH-TOTAL_GENE_WIDTH_2)/FACTOR;
var SHAVE_3 = (LARGEST_WIDTH-TOTAL_GENE_WIDTH_3)/FACTOR;

// Determine the variables for allowing scrolling.
var typ_genes;
if (LARGEST_WIDTH === TOTAL_GENE_WIDTH_1){
    typ_genes = GENES_1;
}
else if (LARGEST_WIDTH === TOTAL_GENE_WIDTH_2){
    typ_genes = GENES_2;
}
else if (LARGEST_WIDTH === TOTAL_GENE_WIDTH_3){
    typ_genes = GENES_3;
}
var first_gene = typ_genes.genes[0];
var last_gene = typ_genes.genes[typ_genes.genes.length-1];

// Can scroll?
function canScroll(diff){
    var check_left = first_gene.x-first_gene.width/2+diff;
    var check_right = last_gene.x+last_gene.width/2+diff;
    return (check_left <= initial_x && check_right >= final_x);
}

// Preload the image.
var g;
function preload(){
    // Draw the miniature genes.
    g = createGraphics(INNER_WIDTH, canvas_height);
    g.strokeWeight(1);
    g.stroke("black");
    // g.fill("#004d1a");
    // create_genes(MINI_GENES_1, g);
    // g.fill("#00802b");
    // create_genes(MINI_GENES_2, g);
    // g.fill("#00cc44");
    // create_genes(MINI_GENES_3, g);

    // Draw the greeting message.
    g.fill("black");
    g.textSize(40);
    g.text(greeting, greeting_x1, greeting_y1, greeting_x2, greeting_y2)

    // Draw the text that will indicate which sequence. 
    g.textSize(15);
    g.text(sequence_1, sequence_1_x1, sequence_1_y1);
    g.text(sequence_2, sequence_2_x1, sequence_2_y1);
    g.text(sequence_3, sequence_3_x1, sequence_3_y1);

    g.text("Search -", GENES_X, 245);
    g.text("Row:", 120, 245);
    g.text("Gene Number:", 340, 245);

    // Draw the three rectangles that will represent the user's position within the "map".
    g.fill("#004d1a");
    var final_width = VIEW_WIDTH-SHAVE_1;
    g.rect(MINIS_X, MINIS_Y1, final_width, GENE_HEIGHT);
    var num_lines = NUM_GENES/NUM_EL;
    var length = final_width/num_lines;
    for (var n = 1; n <= num_lines; n += 1){
        g.line(GENES_X+n*length, MINIS_Y1, GENES_X+n*length, MINIS_Y1+GENE_HEIGHT);
    }
    g.fill("#00802b");
    var final_width = VIEW_WIDTH-SHAVE_2;
    g.rect(MINIS_X, MINIS_Y2, final_width, GENE_HEIGHT);
    var num_lines = NUM_GENES/NUM_EL;
    var length = final_width/num_lines;
    for (var n = 1; n <= num_lines; n += 1){
        g.line(GENES_X+n*length, MINIS_Y2, GENES_X+n*length, MINIS_Y2+GENE_HEIGHT);
    }
    g.fill("#00cc44");
    var final_width = VIEW_WIDTH-SHAVE_3;
    g.rect(MINIS_X, MINIS_Y3, final_width, GENE_HEIGHT);
    var num_lines = NUM_GENES/NUM_EL;
    var length = final_width/num_lines;
    for (var n = 1; n <= num_lines; n += 1){
        g.line(GENES_X+n*length, MINIS_Y3, GENES_X+n*length, MINIS_Y3+GENE_HEIGHT);
    }
}

// Setup function required by p5. Establlishes the setup for the drawing. 
var row_input;
var gene_input;
var button;
function setup(){
    // Create the canvas that will be used for the application.
    createCanvas(window.innerWidth-15, canvas_height);

    // Create the input for searching.
    row_input = createInput();
    row_input.position(160, 235);
    gene_input = createInput();
    gene_input.position(445, 235);
    button = createButton("Submit");
    button.position(650, 235);
    button.mouseClicked(search);
}

// Searches for the genes specified in the search input fields. 
var screen_middle = INNER_WIDTH/2;
var button_pressed = false;
function search(){
    // The button was pressed.
    button_pressed = true;

    // Retrieve the correct values. 
    var row_in = Number(row_input.value());
    var num_in = Number(gene_input.value());

    // Determine if the values are valid.
    if (row_in < 1 || row_in > 3){
        alert("The row number is invalid.");
        return;
    }
    if (num_in < 1 || num_in > NUM_GENES){
        alert("The gene number is invalid.");
        return;
    }

    // Clear the input fields.
    row_input.value("");
    gene_input.value("");

    // Determine the correct gene sequence.
    var genes;
    switch (row_in){
        case 1: 
            genes = GENES_1;
            break;
        case 2: 
            genes = GENES_2;
            break;
        case 3: 
            genes = GENES_3;
            break;
    }

    // Position the elements so that the correct gene is displayed.
    var direction;
    var distance = 50;
    var gene = genes.genes[num_in-1];
    var num = num_in-1;
    if (num_in-1 > genes.end){
        direction = -distance;
    }
    else if (num_in-1 < genes.start){
        direction = distance;
    }
    console.log(genes.end);
    while ((genes.end < num || genes.start > num) && canScroll(direction)){
        update_all(direction);
    }
    console.log(genes.end);

    distance = 0.5;
    if (gene.x > screen_middle){
        direction = -distance;
    }
    else if (gene.x < screen_middle){
        direction = distance;
    }
    while (gene.x != screen_middle && canScroll(direction)){
        update_all(direction);
    }

    // Update the row number, gene number, and gene width.
    row = row_in;
    gene_num = num_in;
    gene_width = gene.width;
}

// The draw function required by p5. Draws on the canvas created during the setup.
var speed = 10;
var speed_increase = 5;
function draw(){
    // Prepare the window.
    clear();
    image(g, 0, 0);

    // Draw the text near the bottom.
    strokeWeight(0.5);
    fill("black");
    textSize(25);
    text("Row: " + row, TEXT_X, TEXT_Y, TEXT_X+50, 375);
    text("Gene Width: " + gene_width, TEXT_X+100, TEXT_Y, TEXT_X+200, 375);
    text("Gene Number: " + gene_num, TEXT_X+320, TEXT_Y, TEXT_X+300, 375);

    // Draw the viewport.
    stroke("black");
    strokeWeight(VIEW_THICKNESS);
    noFill();
    rect(VIEW_X, VIEW_Y-VIEW_THICKNESS, VIEW_WIDTH/FACTOR, VIEW_HEIGHT+2*VIEW_THICKNESS);

    // Draw the three sets of genes.
    strokeWeight(GENE_THICKNESS);
    fill("#004d1a");
    draw_genes(GENES_1, 1);
    fill("#00802b");
    draw_genes(GENES_2, 2);
    fill("#00cc44");
    draw_genes(GENES_3, 3);

    // Determine if the genes need to be moved by the arrows.
    if (keyIsDown(LEFT_ARROW)){
        if (keyIsDown(DOWN_ARROW) && canScroll(speed*speed_increase)){
            update_all(speed*speed_increase);
            return;
        }
        if (canScroll(speed)){
            update_all(speed);
        }
    }
    else if (keyIsDown(RIGHT_ARROW)){
        if (keyIsDown(DOWN_ARROW) && canScroll(-speed*speed_increase)){
            update_all(-speed*speed_increase);
            return;
        }
        if (canScroll(-speed)){
            update_all(-speed);
        }
    }
}

// Corrects the genes x position by diff.
function update_genes(genes, diff){
    // Correct the start and end indices.
    var gene, check_left, check_right;
    if (diff < 0){
        gene = genes.genes[genes.start];
        check_left = gene.x+gene.width;
        while(check_left < 0 && genes.start < NUM_GENES-1){
            genes.start += 1;
            var cur_gene = genes.genes[genes.start];
            check_left = cur_gene.x+cur_gene.width;
        }
        gene = genes.genes[genes.end];
        check_right = gene.x-gene.width;
        while(check_right < INNER_WIDTH && genes.end < NUM_GENES-1){
            genes.end += 1;
            var cur_gene = genes.genes[genes.end];
            check_right = cur_gene.x-cur_gene.width;
            var next_gene = genes.genes[genes.end-1];
            cur_gene.x = next_gene.x+next_gene.width/2+cur_gene.width/2;
        }
    }
    else if (diff > 0){
        gene = genes.genes[genes.start];
        check_left = gene.x+gene.width;
        while(check_left > 0 && genes.start > 0){
            genes.start -= 1;
            var cur_gene = genes.genes[genes.start];
            check_left = cur_gene.x+cur_gene.width;
            var next_gene = genes.genes[genes.start+1];
            cur_gene.x = next_gene.x-next_gene.width/2-cur_gene.width/2;
        }   
        gene = genes.genes[genes.end];
        check_right = gene.x-gene.width;
        while(check_right > INNER_WIDTH && genes.end > 0){
            genes.end -= 1;
            var cur_gene = genes.genes[genes.end];
            check_right = cur_gene.x-cur_gene.width;
        }
    }
    // Correct the genes' location.
    for (var n = genes.start; n <= genes.end; n += 1){
        genes.genes[n].x += diff;
    }
}

// Corrects all three collections of genes. 
var factor = VIEW_WIDTH/LARGEST_WIDTH;
function update_all(diff){
    // Adjust the overall view.
    VIEW_X -= diff*factor;

    // Adjust all the genes.
    update_genes(GENES_1, diff);
    update_genes(GENES_2, diff);
    update_genes(GENES_3, diff);
}

// p5's mouse dragged function.
var dragged = false;
var upper_limit = GENE_Y1-20;
var lower_limit = GENE_Y3+40;
function mouseDragged(){
    // Check to determine the mouse is within the correct region.
    // The mouse was dragged.
    dragged = true;

    if (!(mouseY >= upper_limit && mouseY <= lower_limit)){
        return;
    }

    // Determine how the genes and the view are to move.
    var diff = (pmouseX-mouseX);
    if (!canScroll(diff)){
        return;
    }
    update_all(diff);
}

// The mouse clicked function for p5.
var row = 0;
var gene_num = 0;
var gene_width = 0;
function mouseClicked(){
    // Determine which gene was clicked.
    if (!dragged && !button_pressed){
        var dist_1 = abs(mouseY-GENE_Y1), dist_2 = abs(mouseY-GENE_Y2), dist_3 = abs(mouseY-GENE_Y3);
        var dist_y = Math.min(dist_1, dist_2, dist_3);
        var genes;

        // Do not make any changes if the mouse was not clicked near enough.
        if (!(dist_y <= GENE_HEIGHT/2)){
            return;
        }

        if (dist_y === dist_1){
            genes = GENES_1;
            row = 1;
        }
        else if (dist_y === dist_2){
            genes = GENES_2;
            row = 2;
        }
        else if (dist_y === dist_3){
            genes = GENES_3;
            row = 3;
        }
        for (var n = genes.start; n <= genes.end; n += 1){
            var gene = genes.genes[n];
            var dist_x = abs(mouseX-gene.x);
            if (dist_x <= gene.width/2){
                gene_width = gene.width;
                gene_num = n+1;
                return;
            }
        }
    }
    // Reset the dragging.
    else {
        dragged = false;
        button_pressed = false;
    }
}

// Imitates a sleeping function.
function sleep(ms){
    var date = Date.now();
    var cur_date;
    do {
        cur_date = Date.now();
    } while (cur_date-date < ms);
}