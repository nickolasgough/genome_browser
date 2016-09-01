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