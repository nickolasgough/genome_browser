class Chromosome {
  String name;
  ArrayList<Gene> genes;

  public Chromosome(String newName) {
    name = newName;
    genes = new ArrayList<Gene>();
  }
}