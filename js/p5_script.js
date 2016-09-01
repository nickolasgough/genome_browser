// A collection of genes with defined properties.
function Genes(){
    this.genes = [];
    this.start = 0;
    this.end = 0;
    this.length = 0;
}

// Define the genome.
function Genome(name){
  this.name = name;
  this.chromosomes = [];
  this.start = 0;
  this.end = 0;
}

// Define the chromosome.
function Chromosome(name){
  this.name = name;
  this.genes = [];
  this.start = 0;
  this.end = 0;
}

// Define the gene.
function Gene(num, start, end, id){
  this.chrom_num = num;
  this.start = start;
  this.end = end;
  this.id = id;
  this.width = (end-start)/DRAW_FACTOR;
  this.x = 0;
}

// Declare the genome.
var genome = new Genome("Brassica Napus");
var turnip_genes = new Genes(), cabbage_genes = new Genes();

// Load the genes file.
// var text = null;
// function open_file(event){
//   var files = event.target.files;
//   var reader = new FileReader();
//   reader.onload = function(){
//     text = reader.result;
//     parse_data(napus, text);
//   }
//   reader.readAsText(files[0]);
// }

// Parse the data.
var lines;
function parse_data(){
  // var lines = text.split("\n");
  // if (lines[lines.length-1] === ""){
  //   lines.pop();
  // }
  console.log(lines.length);
  var chrom_name = "N0";
  for (var n = 0; n < lines.length; n += 1){
    var parts = lines[n].split("\t");
    var chrom;
    if (parts.length > 0){
      var chrom_num = Number(parts[0].substring(1, parts[0].length));
      if (parts[0] != chrom_name){
        console.log(lines[n]);
        chrom_name = parts[0];
        chrom = new Chromosome(chrom_name);
        genome.chromosomes.push(chrom);
      }
      var g = new Gene(chrom_num, Number(parts[3]), Number(parts[4]), parts[8]);
      chrom.genes.push(g);
    }
  }
  console.log("There are " + genome.chromosomes.length + " chromosomes.");
  console.log("N1 has " + genome.chromosomes[0].genes.length + " genes.");
  parse_genes(genome, turnip_genes, cabbage_genes);
}

// Determine which genes are turnip and which are genes.
function parse_genes(genome, turn_genes, cab_genes){
  console.log(genome.chromosomes.length);
  var cur_chrom, cur_gene;
  for (var n = 0; n < genome.chromosomes.length; n += 1){
    cur_chrom = genome.chromosomes[n];
    for (var i = 0; i < cur_chrom.genes.length; i += 1){
      cur_gene = cur_chrom.genes[i];
      var num = cur_gene.chrom_num;
      if (num >= 1 && num <= 10){
        turn_genes.genes.push(cur_gene);
      }
      else {
        cab_genes.genes.push(cur_gene);
      }
    }
  }
  console.log("There are " + turn_genes.genes.length + " turnip genes.");
  console.log("There are " + cab_genes.genes.length + " cabbage genes.");

  init_genes(turn_genes, GENES_X);
  init_genes(cab_genes, GENES_X);

  // var myp5 = new p5(sketch);
}

// Initialize the genes with the correct x coordinates and determine the total width.
function init_genes(the_genes, x_pos){
  var cur_gene;
  for (var n = 0; n < the_genes.genes.length; n += 1){
    cur_gene = the_genes.genes[n];
    x_pos += cur_gene.width/2;
    cur_gene.x = x_pos;
    the_genes.length += cur_gene.width;
    if (the_genes.length > (INNER_WIDTH-GENES_X) && the_genes.end === 0){
      the_genes.end = n;
    }
    x_pos += cur_gene.width/2;
  }
}

// The desired beginning x coordinate.
var GENES_X = 50

// The desired inner width.
var INNER_WIDTH = window.innerWidth-15;

// The draw factor by which to display the genes. 
var DRAW_FACTOR = 10;

// The minimum and maximum lengths of the genes. 
// var min = 30, MAX = 100;

// The number of genes to display on the canvas.
// var NUM_GENES = 5000;

// The height of the genes.
var GENE_HEIGHT = 25;

// The canvas height.
var CANVAS_HEIGHT = 550;

// The initial x and y position at which to start drawing. 
// var GENES_1 = new Genes(), GENES_2 = new Genes(), GENES_3 = new Genes(); 
var ghgap = 60;
var GENE_Y1 = 325, GENE_Y2 = GENE_Y1+ghgap, GENE_Y3 = GENE_Y2+ghgap, GENE_THICKNESS = 3;

// The miniature genes. 
// var MINI_GENES_1 = [], MINI_GENES_2 = [], MINI_GENES_3 = [];
var mhgap = 30;
var MINIS_X = 50, MINIS_Y1 = 100, MINIS_Y2 = MINIS_Y1+mhgap, MINIS_Y3 = MINIS_Y2+mhgap;

// Define the variables for the viewport.
var VIEW_X = GENES_X, VIEW_Y = MINIS_Y1, VIEW_HEIGHT = 55, VIEW_WIDTH = INNER_WIDTH-2*VIEW_X, VIEW_THICKNESS = 5;

// Define the number of elements for which to display lines. 
var NUM_EL = 1000;

// The text to display at the top.
var greeting = "Greetings!", greeting_x1 = MINIS_X, greeting_y1 = 20, greeting_x2 = 100, greeting_y2 = 100;
var sequence_1 = "Turnip Sequence:", sequence_1_x1 = GENES_X, sequence_1_y1 = GENE_Y1-20;
var sequence_2 = "Cabbage Sequence:", sequence_2_x1 = GENES_X, sequence_2_y1 = GENE_Y2-20;
var sequence_3 = "Sequence 3:", sequence_3_x1 = GENES_X, sequence_3_y1 = GENE_Y3-20;

// Define the bottom text variables. 
var TEXT_X = GENES_X, TEXT_Y = CANVAS_HEIGHT-30;

// The sketch function to instantiate the p5 object.
var sketch = function(p){
    // The gene constructor.
    // p.gene = function(g_width, x_pos, y_pos){
    //     this.width = g_width;
    //     this.x = x_pos;
    //     this.y = y_pos;
    // }

    // Generates a random number between the specified minimum and maximum.
    // p.generate_gene_width = function(min, max){
    //     return Math.floor(Math.random()*(max-min+1)+min);
    // }

    // Generate all the gene widths and the total gene widths.
    // var TOTAL_GENE_WIDTH_1 = 0, TOTAL_GENE_WIDTH_2 = 0, TOTAL_GENE_WIDTH_3 = 0;
    // p.initialize_genes = function(x_pos, y_pos, genes){
    //     var total_width = 0;
    //     for (var n = 0; n < NUM_GENES; n += 1){
    //         var rand_gene_width = p.generate_gene_width(min, MAX);
    //         x_pos += rand_gene_width/2;
    //         genes.genes[n] = new p.gene(rand_gene_width, x_pos, y_pos);
    //         total_width += rand_gene_width;
    //         if (total_width > (INNER_WIDTH-GENES_X) && genes.end === 0){
    //             genes.end = n;
    //         }
    //         x_pos += rand_gene_width/2;
    //     }

    //     return total_width;
    // }
    // TOTAL_GENE_WIDTH_1 = p.initialize_genes(GENES_X, GENE_Y1, GENES_1);
    // TOTAL_GENE_WIDTH_2 = p.initialize_genes(GENES_X, GENE_Y2, GENES_2);
    // TOTAL_GENE_WIDTH_3 = p.initialize_genes(GENES_X, GENE_Y3, GENES_3);

    // The factor by which to 
    // p.initialize_mini_genes = function(x_pos, y_pos, genes, orig_genes, total_width){
    //     var factor = total_width/INNER_WIDTH;
    //     for (var n = 0; n < NUM_GENES; n += 1){
    //         var new_width = orig_genes[n].width/factor;
    //         if (n > 0){
    //             x_pos += new_width/2;
    //         }
    //         genes[n] = new p.gene(new_width, x_pos, y_pos);
    //         x_pos += new_width/2;
    //     }
    // }
    // initialize_mini_genes(MINIS_X, MINIS_Y1, MINI_GENES_1, GENES_1.genes, TOTAL_GENE_WIDTH_1);
    // initialize_mini_genes(MINIS_X, MINIS_Y2, MINI_GENES_2, GENES_2.genes, TOTAL_GENE_WIDTH_2);
    // initialize_mini_genes(MINIS_X, MINIS_Y3, MINI_GENES_3, GENES_3.genes, TOTAL_GENE_WIDTH_3);

    // Instantiate the angular app.
    // var app = angular.module("genomics_app", []);
    // app.controller("genomics_controller", function($scope) {
    // });

    // Creates the genes on the graphics. 
    // p.create_genes = function(genes, graphics){
    //     for (var n = 0; n < NUM_GENES; n += 1){
    //         var gene = genes[n];
    //         var check_left = gene.x+gene.width;
    //         var check_right = gene.x-gene.width;
    //         if (check_left >= 0 && check_right <= INNER_WIDTH){
    //             graphics.ellipse(gene.x, gene.y, gene.width, GENE_HEIGHT);
    //         }
    //     }
    // }

    // Draws the bars to display the positioning of the user within the sequence. 
    // var NUM_LINES = NUM_GENES/NUM_EL;
    p.draw_bar = function(x, y, width, num_genes, g){
        var num_lines = num_genes/NUM_EL;
        var length = width/num_lines;
        g.rect(x, y, width, GENE_HEIGHT);
        for (var n = 1; n <= num_lines; n += 1){
            g.line(x+n*length, y, x+n*length, y+GENE_HEIGHT);
        }
    }

    // Draws the genes according to their specified x and y position.
    p.draw_genes = function(genes, gene_row, gene_y){
        var genes_arr = genes.genes;
        for (var n = genes.start; n <= genes.end; n += 1){
            var gene = genes_arr[n];
            var check_left = gene.x+gene.width;
            var check_right = gene.x-gene.width;
            if (check_left >= 0 && check_right <= INNER_WIDTH){
                if (n == (gene_num-1) && gene_row === row){
                    p.stroke("#ff0000");
                }
                p.ellipse(gene.x, gene_y, gene.width, GENE_HEIGHT);
                if (n == (gene_num-1) && gene_row === row){
                    p.stroke("black");
                }
            }
            else if (check_right > INNER_WIDTH){
                return;
            }
        }
    }

    // Preload the image.
    var g;
    p.preload = function(){
        // Load the data and parse it.
        lines = p.loadStrings('../napus/genes.gff3', parse_data);
    }

    // Setup function required by p5. Establlishes the setup for the drawing. 
    var row_input;
    var gene_input;
    var button;
    var first_gene, last_gene, initial_x, final_x;
    var LARGEST_WIDTH;
    p.setup = function(){
        // Create the canvas that will be used for the application.
        p.createCanvas(window.innerWidth-15, CANVAS_HEIGHT);

        // Move the elements when the mouse is dragged. 
        initial_x = GENES_X;
        // var LARGEST_WIDTH = Math.max(TOTAL_GENE_WIDTH_1, TOTAL_GENE_WIDTH_2, TOTAL_GENE_WIDTH_3);
        LARGEST_WIDTH = Math.max(turnip_genes.length, cabbage_genes.length);
        // var SMALLEST_WIDTH = Math.min(TOTAL_GENE_WIDTH_1, TOTAL_GENE_WIDTH_2, TOTAL_GENE_WIDTH_3);
        var SMALLEST_WIDTH = Math.min(turnip_genes.length, cabbage_genes.length);
        final_x = INNER_WIDTH-initial_x;

        // Determine how much to shave off. 
        FACTOR = LARGEST_WIDTH/VIEW_WIDTH;
        // var SHAVE_1 = (LARGEST_WIDTH-TOTAL_GENE_WIDTH_1)/FACTOR;
        // var SHAVE_2 = (LARGEST_WIDTH-TOTAL_GENE_WIDTH_2)/FACTOR;
        // var SHAVE_3 = (LARGEST_WIDTH-TOTAL_GENE_WIDTH_3)/FACTOR;
        var SHAVE_1 = (LARGEST_WIDTH-turnip_genes.length)/FACTOR;
        var SHAVE_2 = (LARGEST_WIDTH-cabbage_genes.length)/FACTOR;

        // Determine the variables for allowing scrolling.
        var typ_genes;
        // if (LARGEST_WIDTH === TOTAL_GENE_WIDTH_1){
        //     typ_genes = GENES_1;
        // }
        // else if (LARGEST_WIDTH === TOTAL_GENE_WIDTH_2){
        //     typ_genes = GENES_2;
        // }
        // else if (LARGEST_WIDTH === TOTAL_GENE_WIDTH_3){
        //     typ_genes = GENES_3;
        // }
        if (LARGEST_WIDTH === turnip_genes.length){
            typ_genes = turnip_genes;
        }
        else if (LARGEST_WIDTH === cabbage_genes.length){
            typ_genes = cabbage_genes;
        }
        first_gene = typ_genes.genes[0];
        last_gene = typ_genes.genes[typ_genes.genes.length-1];
        
        // Draw the miniature genes.
        g = p.createGraphics(INNER_WIDTH, CANVAS_HEIGHT);
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
        // g.text(sequence_3, sequence_3_x1, sequence_3_y1);

        g.text("Search -", GENES_X, 245);
        g.text("Row:", 120, 245);
        g.text("Gene Number:", 340, 245);

        // Draw the three rectangles that will represent the user's position within the "map".
        g.fill("#004d1a");
        var final_width = VIEW_WIDTH-SHAVE_1;
        p.draw_bar(MINIS_X, MINIS_Y1, final_width, turnip_genes.genes.length, g);
        g.fill("#00802b");
        var final_width = VIEW_WIDTH-SHAVE_2;
        p.draw_bar(MINIS_X, MINIS_Y2, final_width,cabbage_genes.genes.length, g);
        g.fill("#00cc44");
        // var final_width = VIEW_WIDTH-SHAVE_3;
        // p.draw_bar(MINIS_X, MINIS_Y3, final_width, length, g);

        // Create the input for searching.
        var y_coord = 255;
        row_input = p.createInput();
        row_input.position(160, y_coord);
        gene_input = p.createInput();
        gene_input.position(445, y_coord);
        button = p.createButton("Submit");
        button.position(650, y_coord);
        button.mouseClicked(p.search);
    }

    // Can scroll?
    p.canScroll = function(diff){
        var check_left = first_gene.x-first_gene.width/2+diff;
        var check_right = last_gene.x+last_gene.width/2+diff;
        return (check_left <= initial_x && check_right >= final_x);
    }

    // Searches for the genes specified in the search input fields. 
    var screen_middle = INNER_WIDTH/2;
    var button_pressed = false;
    p.search = function(){
        // The button was pressed.
        button_pressed = true;

        // Retrieve the correct values. 
        var row_in = Number(row_input.value());
        var num_in = Number(gene_input.value());

        // Determine if the row is valid.
        if (row_in < 1 || row_in > 3){
            alert("The row number is invalid.");
            return;
        }

        // Determine the correct gene sequence.
        var genes;
        // switch (row_in){
        //     case 1: 
        //         genes = GENES_1;
        //         break;
        //     case 2: 
        //         genes = GENES_2;
        //         break;
        //     case 3: 
        //         genes = GENES_3;
        //         break;
        // }
        switch (row_in){
            case 1: 
                genes = turnip_genes;
                break;
            case 2: 
                genes = cabbage_genes;
                break;
        }

        // Determine if the number is valid.
        if (num_in < 1 || num_in > genes.genes.length){
            alert("The gene number is invalid.");
            return;
        }

        // Clear the input fields.
        row_input.value("");
        gene_input.value("");

        // Position the elements so that the correct gene is displayed.
        var direction;
        var gene = genes.genes[num_in-1];
        var num = num_in-1;
        if (num_in-1 > genes.end){
            direction = -MAX;
        }
        else if (num_in-1 < genes.start){
            direction = MAX;
        }
        while ((genes.end < num || genes.start > num) && p.canScroll(direction)){
            p.update_all(direction);
        }

        var MIN = 0.5;
        if (gene.x > screen_middle){
            direction = -MIN;
        }
        else if (gene.x < screen_middle){
            direction = MIN;
        }
        while (Math.floor(gene.x) != screen_middle && p.canScroll(direction)){
            p.update_all(direction);
        }

        // Update the row number, gene number, and gene width.
        row = row_in;
        gene_num = num_in;
        gene_width = gene.width;
    }

    // The draw function required by p5. Draws on the canvas created during the setup.
    var speed = 10;
    var MAX = 50;
    p.draw = function(){
        // Prepare the window.
        p.clear();
        p.image(g, 0, 0);

        // Draw the text near the bottom.
        p.strokeWeight(0.5);
        p.fill("black");
        p.textSize(25);
        p.text("Row: " + row, TEXT_X, TEXT_Y, TEXT_X+50, 375);
        p.text("Gene Width: " + gene_width, TEXT_X+100, TEXT_Y, TEXT_X+200, 375);
        p.text("Gene Number: " + gene_num, TEXT_X+320, TEXT_Y, TEXT_X+300, 375);

        // Draw the viewport.
        p.stroke("black");
        p.strokeWeight(VIEW_THICKNESS);
        p.noFill();
        p.rect(VIEW_X, VIEW_Y-VIEW_THICKNESS, VIEW_WIDTH/FACTOR, VIEW_HEIGHT+2*VIEW_THICKNESS);

        // Draw the three sets of genes.
        p.strokeWeight(GENE_THICKNESS);
        p.fill("#004d1a");
        // p.draw_genes(GENES_1, 1);
        p.draw_genes(turnip_genes, 1, GENE_Y1);
        p.fill("#00802b");
        // p.draw_genes(GENES_2, 2);
        p.draw_genes(cabbage_genes, 2, GENE_Y2);
        // p.fill("#00cc44");
        // p.draw_genes(GENES_3, 3);

        // Determine if the genes need to be moved by the arrows.
        if (p.keyIsDown(p.LEFT_ARROW)){
            if (p.keyIsDown(p.DOWN_ARROW) && p.canScroll(MAX)){
                p.update_all(MAX);
                return;
            }
            if (p.canScroll(speed)){
                p.update_all(speed);
            }
        }
        else if (p.keyIsDown(p.RIGHT_ARROW)){
            if (p.keyIsDown(p.DOWN_ARROW) && p.canScroll(-MAX)){
                p.update_all(-MAX);
                return;
            }
            if (p.canScroll(-speed)){
                p.update_all(-speed);
            }
        }
    }

    // Corrects the genes x position by diff.
    p.update_genes = function(genes, diff){
        // Correct the start and end indices.
        var gene, check_left, check_right;
        if (diff < 0){
            gene = genes.genes[genes.end];
            check_right = gene.x-gene.width;
            while(check_right < INNER_WIDTH && genes.end < genes.genes.length-1){
                genes.end += 1;
                var cur_gene = genes.genes[genes.end];
                check_right = cur_gene.x-cur_gene.width;
                var prev_gene = genes.genes[genes.end-1];
                cur_gene.x = prev_gene.x+prev_gene.width/2+cur_gene.width/2;
            }
            gene = genes.genes[genes.start];
            check_left = gene.x+gene.width;
            while(check_left < 0 && genes.start < genes.genes.length-1){
                genes.start += 1;
                var cur_gene = genes.genes[genes.start];
                check_left = cur_gene.x+cur_gene.width;
            }
        }
        else if (diff > 0){
            gene = genes.genes[genes.start];
            check_left = gene.x+gene.width;
            while(check_left > 0 && genes.start > 0){
                genes.start -= 1;
                var cur_gene = genes.genes[genes.start];
                check_left = cur_gene.x+cur_gene.width;
                var prev_gene = genes.genes[genes.start+1];
                cur_gene.x = prev_gene.x-prev_gene.width/2-cur_gene.width/2;
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
    p.update_all = function(diff){
        // Adjust the overall view.
        var factor = VIEW_WIDTH/LARGEST_WIDTH;
        VIEW_X -= diff*factor;

        // Update the other views in the other rooms. 
        // sendMessage(id, room, "view_moved", VIEW_X);

        // Adjust all the genes.
        // p.update_genes(GENES_1, diff);
        // p.update_genes(GENES_2, diff);
        // p.update_genes(GENES_3, diff);
        p.update_genes(turnip_genes, diff);
        p.update_genes(cabbage_genes, diff);
    }

    // p5's mouse dragged function.
    var dragged = false;
    var upper_limit = GENE_Y1-20;
    var lower_limit = GENE_Y3+40;
    p.mouseDragged = function(){
        // Check to determine the mouse is within the correct region.
        // The mouse was dragged.
        dragged = true;

        if (!(p.mouseY >= upper_limit && p.mouseY <= lower_limit)){
            return;
        }

        // Determine how the genes and the view are to move, then move.
        var diff = (p.pmouseX-p.mouseX);
        if (diff > 0 && diff > MAX){
            diff = MAX;
        }
        else if (diff < 0 && diff < -MAX){
            diff = -MAX;
        }
        if (!p.canScroll(diff)){
            return;
        }
        p.update_all(diff);
    }

    // The mouse clicked function for p5.
    var row = 0;
    var gene_num = 0;
    var gene_width = 0;
    p.mouseClicked = function(){
        // Determine which gene was clicked.
        if (!dragged && !button_pressed){
            // var dist_1 = p.abs(p.mouseY-GENE_Y1), dist_2 = p.abs(p.mouseY-GENE_Y2), dist_3 = p.abs(p.mouseY-GENE_Y3);
            // var dist_y = Math.min(dist_1, dist_2, dist_3);
            var dist_1 = p.abs(p.mouseY-GENE_Y1), dist_2 = p.abs(p.mouseY-GENE_Y2);
            var dist_y = Math.min(dist_1, dist_2);
            var genes;

            // Do not make any changes if the mouse was not clicked near enough.
            if (!(dist_y <= GENE_HEIGHT/2)){
                return;
            }

            // if (dist_y === dist_1){
            //     genes = GENES_1;
            //     row = 1;
            // }
            // else if (dist_y === dist_2){
            //     genes = GENES_2;
            //     row = 2;
            // }
            // else if (dist_y === dist_3){
            //     genes = GENES_3;
            //     row = 3;
            // }
            if (dist_y === dist_1){
                genes = turnip_genes;
                row = 1;
            }
            else if (dist_y === dist_2){
                genes = cabbage_genes;
                row = 2;
            }
            for (var n = genes.start; n <= genes.end; n += 1){
                var gene = genes.genes[n];
                var dist_x = p.abs(p.mouseX-gene.x);
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
    p.sleep = function(ms){
        var date = Date.now();
        var cur_date;
        do {
            cur_date = Date.now();
        } while (cur_date-date < ms);
    }

    // Function required by the toolkit.
    p.updateDest = function(newName, newRoomName){
        // console.log(newName + " " + newRoomName);
        dest = newName;
        room = newRoomName;
    };

    // Function required by the toolkit.
    p.updateColor = function(newColor){
        myColor = newColor;
    };

    // Update the other views.
    p.receivedMessage = function(){
        // Update the other view.
    }
}

// Instantiate the p5 object.
// var myp5 = new p5(sketch);

// Required for toolkit.
var id, room, color; 
function p5canvas(destID, room, color){
    id = destID;
    room = room;
    color = color;
    var myp5 = new p5(sketch);
    return myp5;
}