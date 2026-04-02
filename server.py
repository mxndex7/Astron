import os
import json
import requests
from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'games.json')
CACHE_PATH = os.path.join(os.path.dirname(__file__), 'data', 'rawg_cache.json')


def load_games():
    try:
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get('games', [])
    except Exception:
        return []


@app.route('/api/games', methods=['GET'])
def api_games():
    """Retorna lista de jogos. Aceita query param `search` para filtrar por termo."""
    games = load_games()
    q = request.args.get('search', '').strip()
    if q:
        q_lower = q.lower()
        games = [g for g in games if q_lower in g.get('title', '').lower() or q_lower in g.get('developer', '').lower() or any(q_lower in c.lower() for c in g.get('categories', []))]
    return jsonify({'games': games})


@app.route('/api/games/<int:game_id>', methods=['GET'])
def api_game_detail(game_id):
    games = load_games()
    for g in games:
        if g.get('id') == game_id:
            return jsonify(g)
    abort(404)


@app.route('/api/rawg', methods=['GET'])
def api_rawg_search():
    """Busca no RAWG (se `RAWG_API_KEY` estiver configurada). Query param: `q`"""
    api_key = os.environ.get('RAWG_API_KEY')
    q = request.args.get('q', '').strip()
    if not api_key:
        return jsonify({'error': 'RAWG_API_KEY not set', 'results': []}), 400
    if not q:
        return jsonify({'results': []})
    # checar cache simples em arquivo
    q_key = q.lower()
    cache = {}
    try:
        if os.path.isfile(CACHE_PATH):
            with open(CACHE_PATH, 'r', encoding='utf-8') as cf:
                cache = json.load(cf) or {}
    except Exception:
        cache = {}

    if q_key in cache:
        return jsonify({'results': cache[q_key]})

    params = {'key': api_key, 'search': q, 'page_size': 10}
    try:
        r = requests.get('https://api.rawg.io/api/games', params=params, timeout=10)
        r.raise_for_status()
    except Exception as e:
        return jsonify({'error': 'RAWG fetch failed', 'details': str(e), 'results': []}), 502

    results = r.json().get('results', [])
    simplified = []
    for item in results:
        simplified.append({
            'id': item.get('id'),
            'name': item.get('name'),
            'released': item.get('released'),
            'rating': item.get('rating'),
            'background_image': item.get('background_image'),
        })

    # salvar no cache de arquivo (silencioso em caso de falha)
    try:
        cache[q_key] = simplified
        with open(CACHE_PATH, 'w', encoding='utf-8') as cf:
            json.dump(cache, cf, ensure_ascii=False, indent=2)
    except Exception:
        pass

    return jsonify({'results': simplified})


# Servir arquivos estáticos (index, css, js, imagens)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def static_proxy(path):
    if path == '':
        return send_from_directory('.', 'index.html')
    if os.path.isfile(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
