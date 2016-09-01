Genome napus;
//ArrayList<ArrayList> chromosomes;
//ArrayList<GeneRecord> genes;
//ArrayList<GeneRecord> currentChrom;
String[] parts;
Chromosome newChrom;
Chromosome currentChrom;

void setup() {
  size(1500, 1000);
  napus = new Genome("Brassica Napus");
  //chromosomes = new ArrayList<ArrayList>();
  //for (int i = 1; i <= 19; i++) {
  //chromosomes.add(new ArrayList<GeneRecord>());
  //}
  String[] lines = loadStrings("/home/nickolas/Desktop/genomics_project/napus/genes.gff3");
  println("there are " + lines.length + " lines");
  String chromosomeName = "N0";

  for (String line : lines) {
    parts = split(line, '\t');
    if (parts.length > 0) {
      int chromNumber = Integer.parseInt(parts[0].substring(1, parts[0].length()));

      if (!parts[0].equals(chromosomeName)) {
        println(line);
        chromosomeName = parts[0];
        newChrom = new Chromosome(chromosomeName);
        napus.chromosomes.add(newChrom);
        //currentChrom = chromosomes.get(chromNumber-1);
      }

      newChrom.genes.add(new Gene(chromNumber, Integer.parseInt(parts[3]), Integer.parseInt(parts[4]), parts[8]));
    }
  }

  println("There are " + napus.chromosomes.size() + " chromosomes.");
  println("N1 has " + napus.chromosomes.get(0).genes.size() + " genes.");

  background(0);
  currentChrom = napus.chromosomes.get(0);
  int maxIndex = currentChrom.genes.get(currentChrom.genes.size()-1).end;
  noStroke();
  rectMode(CORNERS);
  fill(0, 255, 0);
  float left, right;
  for (Gene g : currentChrom.genes) {
    left = map(g.start, 0, maxIndex, 0, width);
    right = map(g.end, 0, maxIndex, 0, width);
    //fill(random(255), random(255), random(255));
    rect(left, 100, right, 200);
  }
}

void draw() {
}