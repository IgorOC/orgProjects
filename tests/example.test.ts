function soma(a: number, b: number): number {
    return a + b;
  }
  
  describe("Função de soma", () => {
    it("deve retornar a soma correta de dois números", () => {
      expect(soma(2, 3)).toBe(5);
    });
  
    it("deve retornar um valor incorreto para soma errada", () => {
      expect(soma(2, 2)).not.toBe(5);
    });
  });