class GameAPI {
  constructor() {
    this.games = [];
    this.cart = [];
    this.cartKey = 'astron_cart_v1';
    this.loadCart();
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

  loadCart() {
    try {
      const raw = localStorage.getItem(this.cartKey);
      this.cart = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.cart = [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    } catch (e) {
      console.error('Falha ao salvar carrinho', e);
    }
  }

  addToCart(gameId, qty = 1) {
    const id = Number(gameId);
    const existing = this.cart.find(i => Number(i.id) === id);
    if (existing) {
      existing.qty = Math.max(1, existing.qty + qty);
    } else {
      this.cart.push({ id, qty });
    }
    this.saveCart();
  }

  removeFromCart(gameId) {
    const id = Number(gameId);
    this.cart = this.cart.filter(i => Number(i.id) !== id);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  getCartItems() {
    return this.cart.map(item => {
      const game = this.getGameById(item.id) || { id: item.id, title: 'Desconhecido', price: 0 };
      return { game, qty: item.qty };
    });
  }

  getCartCount() {
    return this.cart.reduce((s, i) => s + (i.qty || 0), 0);
  }

  getCartTotal() {
    return this.getCartItems().reduce((sum, it) => sum + ((it.game.price || 0) * it.qty), 0);
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

  // tenta enriquecer imagens dos jogos que não têm capa local
  // Se RAWG não estiver disponível (sem chave), usa thumbnails locais ou placeholder (picsum)
  async enrichMissingImages(limit = 6) {
    const missing = this.games.filter(g => !g.image || g.image === '' ).slice(0, limit);
    for (const g of missing) {
      let setImg = false;
      try {
        const results = await this.rawgSearch(g.title || '');
        if (results && results.length) {
          const first = results[0];
          if (first.background_image) {
            g.image = first.background_image;
            setImg = true;
          }
        }
      } catch (e) {
        // ignore
      }

      if (!setImg) {
        // usar thumbnail local se existir
        if (g.thumbnails && g.thumbnails.length) {
          g.image = g.thumbnails[0];
          setImg = true;
        }
      }

      if (!setImg) {
        // placeholder sem necessidade de chave: picsum.photos com seed baseado no título/id
        const seed = encodeURIComponent(((g.title || g.id || 'game') + '').replace(/\s+/g, '-').toLowerCase());
        g.image = `https://picsum.photos/seed/${seed}/600/360`;
      }
    }
  }
}

window.gameAPI = new GameAPI();
