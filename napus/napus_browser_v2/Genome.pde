class Genome {
  String name;
  ArrayList<Chromosome> chromosomes;

  public Genome(String newName) {
    name = newName;
    chromosomes = new ArrayList<Chromosome>();
  }

  int size() {
    // return last index from last gene of last chromosome
    return 0;
  }
}