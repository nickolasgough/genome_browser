// A collection of genes with defined properties.
function Genes(){
    this.genes = [];
    this.start = 0;
    this.end = 0;
    this.length = 0;
    this.max = 0;
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
function Gene(num, start, end, id, sign){
    this.chrom_num = num;
    this.start = start;
    this.end = end;
    this.id = id;
    this.width;
    this.x1 = 0;
    this.x2 = 0;
    this.outline = "black";
    this.color = "green";
    this.sign = sign;
}

// Define the overview connection. 
var temp_x1, temp_x2;
function Overview_Connection(gene1, gene2){
    this.point1 = gene1;
    this.point2 = gene2;
    this.x1 = function(){
        temp_x1 = myp5.map(this.point1.start, 0, turnip_genes.max, genes_x, genes_x+view_width);
        temp_x2 = myp5.map(this.point1.end, 0, turnip_genes.max, genes_x, genes_x+view_width);
        return (temp_x1+temp_x2)/2;
    }
    this.x2 = function(){
        temp_x1 = myp5.map(this.point2.start, 0, cabbage_genes.max, genes_x, genes_x+view_width);
        temp_x2 = myp5.map(this.point2.end, 0, cabbage_genes.max, genes_x, genes_x+view_width);
        return (temp_x1+temp_x2)/2;
    }
    this.y1 = function(){
        return minis_y1+gene_height;
    }
    this.y2 = function(){
        return minis_y2;
    }
}

// Define the zoomed connection;
function Zoomed_Connection(gene1, gene2){
    this.point1 = gene1;
    this.point2 = gene2;
    this.x1 = function(){
        return (this.point1.x2+this.point1.x1)/2;
    }
    this.x2 = function(){
        return (this.point2.x2+this.point2.x1)/2;
    }
    this.y1 = function(){
        return genes_y1+gene_height;
    }
    this.y2 = function(){
        return genes_y2;
    }
}

// Define the genes and the globals.
var napus, turnip_genes, cabbage_genes, overview_connections, zoomed_connections;

// The desired beginning x coordinate and height of the genes.
var genes_x = 50, gene_height = 25;

// The desired inner width.
var inner_width = 935;//((5/7)*window.innerWidth);
var inner_height = 678;

// The initial x and y position at which to start drawing. 
var ghgap = 80;
var genes_y1 = 210, genes_y2 = genes_y1+ghgap, genes_thickness = 1.5;
var user_highlight = "#ff6600", other_highlight = "#0000cc";
var gene_radius = 10;

// The miniature genes. 
var mhgap = 50;
var minis_x = 50, minis_y1 = 60, minis_y2 = minis_y1+mhgap;

// Define the variables for the viewport.
var view_x = [], view_y1 = minis_y1, view_y2 = minis_y2, view_height = 25;
var view_width = inner_width-2*view_x, view_thickness = 1.5, viewp_width;

// The text to display at the top.
var greeting = "Overview:", greeting_x1 = minis_x, greeting_y1 = 30, greeting_x2 = 100, greeting_y2 = 100;
var text_gap = 35;
var sequence_1 = "Zoomed (Turnip)", sequence_1_x1 = genes_x, sequence_1_y1 = genes_y1-text_gap;
var sequence_2 = "Zoomed (Cabbage)", sequence_2_x1 = genes_x, sequence_2_y1 = genes_y2-text_gap;

// Define the other users mouse dimensions.
var mouse_radius = 7;

// Define the coordinates for the search text and io at the bottom of the canvas.
var search_y;

// The sketch function to instantiate the p5 object.
var sketch = function(p){
    // Parse the data.
    var chrom, chrom_name, chrom_num;
    var g;
    var parts;
    p.parse_data = function(data, turn_genes, cab_genes, genome){
        console.log(data.length);
        chrom_name = "N0";
        for (var n = 0; n < data.length; n += 1){
            parts = data[n].split("\t");
            chrom;
            if (parts.length > 0){
                chrom_num = Number(parts[0].substring(1, parts[0].length));
                if (parts[0] != chrom_name){
                    console.log(data[n]);
                    chrom_name = parts[0];
                    chrom = new Chromosome(chrom_name);
                    genome.chromosomes.push(chrom);
                }
                g = new Gene(chrom_num, Number(parts[3]), Number(parts[4]), parts[8], parts[6]);
                chrom.genes.push(g);
            }
        }
        console.log("There are " + genome.chromosomes.length + " chromosomes.");
        console.log("N1 has " + genome.chromosomes[0].genes.length + " genes.");

        p.parse_genes(genome, turn_genes, cab_genes);
    }

    // Determine which genes are turnip and which are genes.
    var cur_chrom, cur_gene;
    var num;
    p.parse_genes = function(genome, turn_genes, cab_genes){
        console.log(genome.chromosomes.length);
        for (var n = 0; n < genome.chromosomes.length; n += 1){
            cur_chrom = genome.chromosomes[n];
            for (var i = 0; i < cur_chrom.genes.length; i += 1){
                cur_gene = cur_chrom.genes[i];
                num = cur_gene.chrom_num;
                if (num >= 1 && num <= 10){
                    turn_genes.genes.push(cur_gene);
                    if (cur_gene.end > turn_genes.max){
                        turn_genes.max = cur_gene.end;
                    }
                }
                else {
                    cab_genes.genes.push(cur_gene);
                    if (cur_gene.end > cab_genes.max){
                        cab_genes.max = cur_gene.end;
                    }
                }
            }
        }
        console.log("There are " + turn_genes.genes.length + " turnip genes.");
        console.log("There are " + cab_genes.genes.length + " cabbage genes.");

        p.init_genes(turn_genes, genes_x, "#004d1a");
        p.init_genes(cab_genes, genes_x, "#00802b");
    }

    // Initialize the genes with the correct x coordinates and determine the total width.
    var zoom_width = 1000000;
    var cur_gene, left, right;
    var start_x, max_index;
    var genes_arr;
    p.init_genes = function(the_genes, x_pos, gene_color){
        start_x = x_pos;
        max_index = the_genes.max;
        genes_arr = the_genes.genes;
        for (var n = 0; n < genes_arr.length; n += 1){
            cur_gene = genes_arr[n];
            left = p.map(cur_gene.start, 0, max_index, start_x, start_x+zoom_width);
            right = p.map(cur_gene.end, 0, max_index, start_x, start_x+zoom_width);
            cur_gene.width = right-left;
            cur_gene.x1 = left;
            cur_gene.x2 = right;
            cur_gene.color = gene_color;
            the_genes.length += cur_gene.width;
        }

        the_genes.end = genes_arr.length;
    }

    // Create the connections.
    var rand1, rand2;
    var one_gene, two_gene;
    p.establish_connections = function(genes1, genes2, connections1, connections2){
        for (var n = 0; n < 1000; n += 1){
            rand1 = Math.ceil(Math.random()*genes1.length);
            rand2 = Math.ceil(Math.random()*genes2.length);
            one_gene = genes1[rand1];
            two_gene = genes2[rand2];

            connections1[n] = new Overview_Connection(one_gene, two_gene);
            connections2[n] = new Zoomed_Connection(one_gene, two_gene);
        }
    }

    // Draws the bars to display the positioning of the user within the sequence. 
    var max_index;
    var left, right, cur_gene;
    var genes_arr;
    p.draw_bar = function(x, y, width, genes, graphics){
        max_index = genes.max;
        genes_arr = genes.genes;
        for (var n = 0; n < genes_arr.length; n += 1){
            cur_gene = genes_arr[n];
            left = p.map(cur_gene.start, 0, max_index, x, x+width);
            right = p.map(cur_gene.end, 0, max_index, x, x+width);
            graphics.rect(left, y, right-left, gene_height);
        }
    }

    // Draws the genes according to their specified x and y position.
    var data_text_size = 15, temp;
    p.draw_genes = function(genes_arr, gene_row, gene_y){
        var gene, check_left, check_right;
        for (var n = 0; n < genes_arr.length; n += 1){
            gene = genes_arr[n];
            check_left = gene.x1+gene.width;
            check_right = gene.x2-gene.width;
            if (check_left >= 0 && check_right <= inner_width){
                // Draw the data associated with the gene if selected.
                if (gene.outline != "black"){
                    p.fill(gene.outline);
                    p.textSize(data_text_size);
                    p.text((n+1) + "\t" + gene.sign, gene.x1, gene_y-data_text_size);
                    p.fill(gene.color);
                }
                
                // Draw the gene. 
                p.stroke(gene.outline);
                p.rect(gene.x1, gene_y, gene.x2, gene_y+gene_height, gene_radius);
                p.stroke("black");
            }
        }
    }

    // Preload the data.
    var gene_data;
    p.preload = function(){
        gene_data = p.loadStrings('/static/rtcWeb/genes/genes.gff3');
    }

    // Setup function required by p5. Establishes the setup for the drawing. 
    var g_context;
    var initial_x, final_x;
    var genome_canvas;
    var row_input, gene_input, search_button, clear_button;
    p.setup = function(){
        // Initialize the pixel density.
        p.pixelDensity(1);
        
        // Declare the genome and the genes.
        napus = new Genome("Brassica Napus");
        turnip_genes = new Genes(), cabbage_genes = new Genes();

        // Parse the data.
        p.parse_data(gene_data, turnip_genes, cabbage_genes, napus);

        // Declare the array of connections. 
        overview_connections = [];
        zoomed_connections = [];
        p.establish_connections(turnip_genes.genes, cabbage_genes.genes, overview_connections, zoomed_connections);

        // Instantiate the constants. 
        initial_x = genes_x;
        final_x = -zoom_width+inner_width-initial_x;

        // Set the x coodinate of the viewport.
        view_x[id] = genes_x;

        // Create the canvas that will be used for the application.
        genome_canvas = p.createCanvas(inner_width, inner_height);
        genome_canvas.parent("playArea");

        // Draw the graphics context.
        g_context = p.createGraphics(inner_width, p.windowHeight);
        row_input = p.createInput();
        gene_input = p.createInput();
        search_button = p.createButton("Submit");
        search_button.mouseClicked(p.search);
        clear_button = p.createButton("Clear");
        clear_button.mouseClicked(p.clear_genes);
        p.draw_graphics(g_context);
    }

    // Draw the graphics to be displayed.
    var min_width = 561, min_height = 658;
    var temp;
    p.draw_graphics = function(g){
        // Ensure the size does not fall below the minimum.
        if (inner_width < min_width){
            inner_width = min_width;
        }
        if (inner_height < min_height){
            inner_height = min_height;
        }

        // Initialize the view x coordinate and width. 
        view_width = inner_width-2*genes_x;
        viewp_width = inner_width*view_width/zoom_width;

        search_y = p.height-260;
        
        // Setup the graphics object.
        g.strokeWeight(1);
        g.stroke("black");

        // Draw the greeting message.
        g.fill("black");
        g.textSize(20);
        g.text(greeting, greeting_x1, greeting_y1)

        // Draw the text that will indicate which sequence. 
        g.textSize(15);
        g.text(sequence_1, sequence_1_x1, sequence_1_y1);
        g.text(sequence_2, sequence_2_x1, sequence_2_y1);

        g.text("Search -", genes_x, search_y+20);
        g.text("Row:", 120, search_y+20);
        g.text("Gene Number:", 240, search_y+20);

        // Draw the three rectangles that will represent the user's position within the "map".
        g.strokeWeight(0.01);
        g.stroke("#004d1a");
        g.fill("#004d1a");
        p.draw_bar(minis_x, minis_y1, view_width, turnip_genes, g_context);
        g.stroke("#00802b");
        g.fill("#00802b");
        p.draw_bar(minis_x, minis_y2, view_width, cabbage_genes, g_context);

        // Draw the overview connections.
        g.stroke("rgba(0, 128, 0, 0.40)");
        g.strokeWeight(0.2);
        for (var n = 0; n < overview_connections.length; n += 1){
            temp = overview_connections[n];
            g.line(temp.x1(), temp.y1(), temp.x2(), temp.y2());
        }

        // Create the input for searching.
        row_input.position(genome_canvas.canvas.offsetLeft+160, genome_canvas.canvas.offsetTop+search_y);
        row_input.size(75);
        gene_input.position(row_input.x+185, genome_canvas.canvas.offsetTop+search_y);
        gene_input.size(75);
        search_button.position(gene_input.x + 100, genome_canvas.canvas.offsetTop+search_y+2);
        clear_button.position(genome_canvas.canvas.offsetLeft+genes_x, genome_canvas.canvas.offsetTop+genes_y2+gene_height+20);
    }

    // Can scroll?
    var anchor = 0, check_left, check_right;
    p.canScroll = function(diff){
        check_left = anchor+diff+genes_x;
        check_right = anchor+diff+genes_x;
        return (check_left <= initial_x && check_right >= final_x);
    }

    // Clear the genes.
    var genes, gene;
    p.clear_genes = function(){
        genes = turnip_genes.genes;
        for (var n = 0; n < genes.length; n += 1){
            gene = genes[n];
            if (gene.outline == ("#"+my_color)){
                gene.outline = "black";
            }
        }
        genes = cabbage_genes.genes;
        for (var n = 0; n < genes.length; n += 1){
            gene = genes[n];
            if (gene.outline == ("#"+my_color)){
                gene.outline = "black";
            }
        }

        sendMessage(id, cur_room, "clear_others", my_color);
    }

    // Clear the genes highlighted by the other users. 
    p.clear_others = function(user_id, user_color){
        genes = turnip_genes.genes;
        for (var n = 0; n < genes.length; n += 1){
            gene = genes[n];
            if (gene.outline == ("#"+user_color)){
                gene.outline = "black";
            }
        }
        genes = cabbage_genes.genes;
        for (var n = 0; n < genes.length; n += 1){
            gene = genes[n];
            if (gene.outline == ("#"+user_color)){
                gene.outline = "black";
            }
        }
    }

    // Searches for the genes specified in the search input fields. 
    var button_pressed = false;
    var screen_middle;
    var row_in, num_in;
    var genes, move_gene;
    var direction, num;
    var min;
    var highlight = {
        row: 0,
        num: 0,
        width: 0,
        color: "black"
    }
    p.search = function(){
        // Determine what the middle of the screen is. 
        screen_middle = Math.round(inner_width/2);

        // The button was pressed.
        button_pressed = true;

        // Retrieve the correct values. 
        row_in = Number(row_input.value());
        num_in = Number(gene_input.value());

        // Determine if the row is valid.
        if (row_in < 1 || row_in > 2){
            alert("The row number is invalid.");
            return;
        }

        // Determine the correct gene sequence.
        switch (row_in){
            case 1: 
                genes = turnip_genes.genes;
                break;
            case 2: 
                genes = cabbage_genes.genes;
                break;
        }

        // Determine if the number is valid.
        if (num_in < 1 || num_in > genes.length){
            alert("The gene number is invalid.");
            return;
        }

        // Clear the input fields.
        row_input.value("");
        gene_input.value("");

        // Position the elements so that the correct gene is displayed.
        num = num_in-1;
        move_gene = genes[num];
        alert(gene.x1);
        if (move_gene.x1 > inner_width){
            direction = -max;
        }
        else if (move_gene.x1 < 0){
            direction = max;
        }
        while ((move_gene.x1 < 0 || move_gene.x1 > inner_width) && p.canScroll(direction)){
            p.update_all(direction);
        }

        min = 1.0;
        if (move_gene.x1 > screen_middle){
            direction = -min;
        }
        else if (move_gene.x1 < screen_middle){
            direction = min;
        }
        while (Math.floor(move_gene.x1) != screen_middle && p.canScroll(direction)){
            p.update_all(direction);
        }

        // Update the row number, gene number, and gene width.
        row = highlight.row = row_in;
        gene_num = highlight.num = num_in;
        gene_width = highlight.width = Math.round(move_gene.width);
        highlight.color = my_color;

        // Update the color of the gene.
        move_gene.outline = "#"+my_color;

        sendMessage(id, cur_room, "gene_highlighted", highlight);
    }

    // The speed up character.
    p.alt = 16; // shift key.

    // The draw function required by p5. Draws on the canvas created during the setup.
    var speed = 100, max = 500;
    var text_x = genes_x, text_y;
    var current_id;
    var temp, temp_x;
    var view = {
        ratio: 0,
        color: "black"
    }
    var mouse = {
        x_ratio: 0,
        y_ratio: 0,
        old_width: inner_width,
        old_height: p.height,
        color: "black"
    }
    p.draw = function(){
        // Prepare the window.
        p.clear();
        p.image(g_context, 0, 0);
        p.rectMode(p.CORNER);

        // Draw the text near the bottom.
        text_y = search_y+50;
        p.strokeWeight(0.5);
        p.fill("black");
        p.textSize(25);
        p.text("Row: " + row, text_x, text_y, text_x+50, 375);
        p.text("Gene Width: " + gene_width, text_x+100, text_y, text_x+200, 375);
        p.text("Gene Number: " + gene_num, text_x+320, text_y, text_x+300, 375);

        // Draw the viewports.
        p.strokeWeight(view_thickness);
        p.noFill();

        // Draw any new views.
        p.stroke("rgba(0, 0, 255, 0.50)");
        for (var n =0; n < ids.length; n += 1){
            current_id = ids[n];
            temp = view_x[current_id];
            if (temp != null){
                p.stroke("#"+temp.color);
                p.rect((temp.ratio*view_width)+genes_x, view_y1-view_thickness, viewp_width, view_height+2*view_thickness);
                p.rect((temp.ratio*view_width)+genes_x, view_y2-view_thickness, viewp_width, view_height+2*view_thickness);
            }
        }

        // Draw the user's viewport.
        p.stroke("#"+my_color);
        p.rect(view_x[id], view_y1-view_thickness, viewp_width, view_height+2*view_thickness);
        p.rect(view_x[id], view_y2-view_thickness, viewp_width, view_height+2*view_thickness);

        // Draw the three sets of genes.
        p.stroke("black");
        p.strokeWeight(genes_thickness);
        p.rectMode(p.CORNERS);
        p.fill("#004d1a");
        p.draw_genes(turnip_genes.genes, 1, genes_y1);
        p.fill("#00802b");
        p.draw_genes(cabbage_genes.genes, 2, genes_y2);

        // Draw the connections.
        p.stroke("rgba(0, 128, 0, 0.40)");
        p.strokeWeight(0.2);
        for (var n = 0; n < zoomed_connections.length; n += 1){
            temp = zoomed_connections[n];
            p.line(temp.x1(), temp.y1(), temp.x2(), temp.y2());
        }

        // Determine if the genes need to be updated via the mouse.
        if (mouse_x != -1 && p.canScroll(move_amount)){
            p.update_all(move_amount);
        }

        // Determine if the genes need to be moved via the keys.
        p.key_pressed();

        // Draw the mouse positions of the other users. 
        p.strokeWeight(0.5);
        p.stroke("black");
        for (var n = 0; n < ids.length; n += 1){
            current_id = ids[n];
            temp = mouse_positions[current_id];
            if (temp != null){
                p.fill("#"+temp.color);
                temp_x = temp.x_ratio+(anchor-temp.old_width);//p.map(temp.x_ratio, 0, temp.old_width, 0, inner_width);
                // temp.y_ratio = p.map(temp.y_ratio, 0, temp.old_height, 0, p.height);
                p.ellipse(temp_x, temp.y_ratio, mouse_radius);
            }
        }

        // Update the ids of the other users.
        sendMessage(id, cur_room, "update_ids", null);
    }
    
    // Send an update of the mouse position when the mouse is moved.
    p.mouseMoved = function(){
        // Update the mouse position.
        mouse.x_ratio = p.mouseX///p.width;
        mouse.y_ratio = p.mouseY;///p.height;
        mouse.old_width = anchor;
        mouse.old_height = p.height;
        mouse.color = my_color;
        sendMessage(id, cur_room, "mouse_position", mouse);
    }

    // Update the genes when the correct key is pressed.
    p.key_pressed = function(){
        // Determine if the genes need to be moved by the arrows.
        if (p.keyIsDown(p.LEFT_ARROW)){
            if (p.keyIsDown(p.alt) && p.canScroll(max*2)){
                p.update_all(max*2);
            }
            else if (p.canScroll(speed)){
                p.update_all(speed);
            }
        }
        else if (p.keyIsDown(p.RIGHT_ARROW)){
            if (p.keyIsDown(p.alt) && p.canScroll(-max*2)){
                p.update_all(-max*2);
            }
            else if (p.canScroll(-speed)){
                p.update_all(-speed);
            }
        }
    }

    // Determine the mouse's x position when the mouse is pressed.
    var mouse_x = -1;
    p.mousePressed = function(){
        mouse_x = p.mouseX;
    }

    // Reset the mouse x position when the mouse is released.
    p.mouseReleased = function(){
        move_amount = 0;
        mouse_x = -1;
    }

    // Corrects the genes x position by diff.
    var gene;
    p.update_genes = function(genes, diff){
        // Correct the start and end indices.
        // var gene, check_left, check_right;
        // if (diff < 0){
        //     gene = genes.genes[genes.end];
        //     check_right = gene.x-gene.width;
        //     while(check_right < INNER_WIDTH && genes.end < genes.genes.length-1){
        //         genes.end += 1;
        //         var cur_gene = genes.genes[genes.end];
        //         check_right = cur_gene.x-cur_gene.width;
        //         var prev_gene = genes.genes[genes.end-1];
        //         cur_gene.x = prev_gene.x+prev_gene.width/2+cur_gene.width/2;
        //     }
        //     gene = genes.genes[genes.start];
        //     check_left = gene.x+gene.width;
        //     while(check_left < 0 && genes.start < genes.genes.length-1){
        //         genes.start += 1;
        //         var cur_gene = genes.genes[genes.start];
        //         check_left = cur_gene.x+cur_gene.width;
        //     }
        // }
        // else if (diff > 0){
        //     gene = genes.genes[genes.start];
        //     check_left = gene.x2+gene.width;
        //     while(check_left > 0 && genes.start > 0){
        //         genes.start -= 1;
        //         var cur_gene = genes.genes[genes.start];
        //         check_left = cur_gene.x1+cur_gene.width;
        //         var prev_gene = genes.genes[genes.start+1];
        //         cur_gene.x = prev_gene.x-prev_gene.width/2-cur_gene.width/2;
        //     }   
        //     gene = genes.genes[genes.end];
        //     check_right = gene.x1-gene.width;
        //     while(check_right > INNER_WIDTH && genes.end > 0){
        //         genes.end -= 1;
        //         var cur_gene = genes.genes[genes.end];
        //         check_right = cur_gene.x-cur_gene.width;
        //     }
        // }

        // // Correct the genes' location.
        for (var n = genes.start; n < genes.end; n += 1){
            gene = genes.genes[n]
            gene.x1 += diff;
            gene.x2 += diff;
        }
    }

    // Corrects all three collections of genes. 
    var factor;
    p.update_all = function(diff){
        // Adjust the overall view.
        factor = (view_width-viewp_width)/zoom_width;
        view_x[id] -= diff*factor;

        // Adjust all the genes.
        p.update_genes(turnip_genes, diff);
        p.update_genes(cabbage_genes, diff);

        // Update the anchor.
        anchor += diff;

        // Update the other views.
        view.ratio = (view_x[id]-genes_x)/view_width;
        view.color = my_color;
        sendMessage(id, cur_room, "view_moved", view);
    }

    // p5's mouse dragged function.
    var dragged = false, move_amount;
    p.mouseDragged = function(){
        // The mouse was dragged.
        dragged = true;

        // Determine how the genes and the view are to move, then move.
        move_amount = (mouse_x-p.mouseX);
        
        // Limit the mouse movement.
        // if (move_amount > 0 && move_amount > max){
        //     move_amount = max;
        // }
        // else if (move_amount < 0 && move_amount < -max){
        //     move_amount = -max;
        // }
    }

    // The mouse clicked function for p5.
    var row = 0, gene_num = 0, gene_width = 0;
    var dist_1, dist_2, dist_y;
    var gene, temp, genes, genes_arr;
    p.mouseClicked = function(){
        // Determine which gene was clicked.
        if (!dragged && !button_pressed){
            dist_1 = p.abs(p.mouseY-genes_y1), dist_2 = p.abs(p.mouseY-genes_y2);
            dist_y = Math.min(dist_1, dist_2);

            // Do not make any changes if the mouse was not clicked near enough.
            if (!(dist_y <= gene_height)){
                return;
            }

            // Find the correct genes (row) and then find the correct gene.
            if (dist_y === dist_1){
                genes = turnip_genes;
                row = 1;
            }
            else if (dist_y === dist_2){
                genes = cabbage_genes;
                row = 2;
            }
            genes_arr = genes.genes;
            for (var n = genes.start; n < genes.end; n += 1){
                gene = genes_arr[n];
                if (p.mouseX >= gene.x1 && p.mouseX <= gene.x2){
                    gene_width = Math.round(gene.width);
                    gene_num = n+1;
                    temp = gene;
                }
            }

            // Indicate the gene has been selected. 
            temp.outline = "#"+my_color;

            highlight.row = row;
            highlight.num = gene_num;
            highlight.width = gene_width;
            highlight.color = my_color;
            sendMessage(id, cur_room, "gene_highlighted", highlight);
        }

        // Reset the dragging.
        else {
            dragged = false;
            button_pressed = false;
        }
    }

    // Imitates a sleeping function.
    var date, cur_date;
    p.sleep = function(ms){
        date = Date.now();
        cur_date;
        do {
            cur_date = Date.now();
        } while (cur_date-date < ms);
    }

    // Function required by the toolkit.
    p.updateDest = function(newName, newRoomName){
        console.log(newName + " " + newRoomName);
        dest = newName;
        cur_room = newRoomName;
    };

    // Function required by the toolkit.
    p.updateColor = function(newColor){
        my_color = newColor;
    };

    // Update the ids.
    var is_new;
    p.update_ids = function(temp_id){
        // Determine if the id is new.
        is_new = true;
        for (var n = 0; n < ids.length; n += 1){
            if (ids[n] == temp_id){
                is_new = false;
            } 
        }
        
        // Store the id if it is new.
        if (is_new){
            ids.push(temp_id);
        }
    }

    // Update the other views.
    p.update_views = function(user_id, new_view){
        view_x[user_id] = new_view;
    }

    // Update other users mouse positions. 
    var mouse_positions = [];
    p.update_mice = function(user_id, mouse_info){
        mouse_positions[user_id] = mouse_info;
    }

    // Resize the animation.
    // var ratio;
    // p.windowResized = function(){
    //     // Adjust the width and the size of the canvas. 
    //     ratio = (view_x[id]-genes_x)/view_width;
    //     inner_width = ((5/7)*window.innerWidth);
    //     p.resizeCanvas(inner_width, p.windowHeight);
    //     view_width = inner_width-2*genes_x;
    //     viewp_width = inner_width*view_width/zoom_width;
    //     view_x[id] = (ratio*view_width)+genes_x;
    //     final_x = -zoom_width+inner_width-initial_x;

    //     // Draw the graphics context again.
    //     g_context.clear();
    //     p.draw_graphics(g_context);

    //     // Correct the genes locations if necessary.
    //     while (!p.canScroll(-1)){
    //         p.update_all(1);
    //     }

    //     // Update the genes displayed. 
    //     p.update_all(0);
    // }

    // Remove the specified canvas. 
    p.remove_id = function(old_id){
        for (var n = 0; n < ids.length; n += 1){
            if (ids[n] == old_id){
                view_x[old_id] = 0;
                ids.splice(n, 1);
            }
        }
    }

    // The executed function when the user leaves the room.
    p.removeAll = function(){
        sendMessage(id, cur_room, "remove_id", null);
        p.remove();
    }

    // Updates the highlighted genes.
    var highlights = [], genes, gene;
    p.highlighted = function(user_id, highlight_info){
        if (highlight_info.row == 1){
            genes = turnip_genes.genes;
        }
        else if (highlight_info.row == 2){
            genes = cabbage_genes.genes;
        }
        
        gene = genes[highlight_info.num-1];
        gene.outline = "#"+highlight_info.color;
    }
}

// Required for toolkit.
var id, cur_room, my_color, ids = [], myp5; 
function p5canvas(destID, room, color){
    id = destID;
    cur_room = room;
    my_color = color;
    myp5 = new p5(sketch);
    return myp5;
}