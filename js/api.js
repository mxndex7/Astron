class GameAPI {
  constructor() {
    this.games = [];
  }

  async loadGames() {
    // tenta o backend primeiro
    try {
      const res = await fetch('/api/games');
      if (!res.ok) throw new Error('API não disponível');
      const data = await res.json();
      this.games = data.games || [];
      return this.games;
    } catch (err) {
      // fallback para arquivo local
      try {
        const res2 = await fetch('data/games.json');
        const data2 = await res2.json();
        this.games = data2.games || [];
        return this.games;
      } catch (err2) {
        console.error('Falha ao carregar jogos:', err2);
        this.games = [];
        return [];
      }
    }
  }

  getGameById(id) {
    return this.games.find(g => Number(g.id) === Number(id));
  }

  async rawgSearch(q) {
    try {
      const res = await fetch('/api/rawg?q=' + encodeURIComponent(q));
      if (!res.ok) return [];
      const data = await res.json();
      return data.results || [];
    } catch (err) {
      return [];
    }
  }
}

window.gameAPI = new GameAPI();
