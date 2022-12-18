export default class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _baseOffset = 210;

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status} `);
    }

    return await res.json();
  };

  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}&apikey=${process.env.REACT_APP_API_KEY}&ts=${process.env.REACT_APP_API_TS}&hash=${process.env.REACT_APP_API_HASH}`
    );
    return this._transformCharacters(res.data.results);
  };

  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?apikey=${process.env.REACT_APP_API_KEY}&ts=${process.env.REACT_APP_API_TS}&hash=${process.env.REACT_APP_API_HASH}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacters = (arrChars) => {
    return arrChars.map((char) => this._transformCharacter(char));
  };

  _transformCharacter = (char) => {
    const {
      name,
      description,
      thumbnail,
      urls,
      comics: { items },
      id,
    } = char;
    return {
      name,
      description: description
        ? description.slice(0, 210) + "..."
        : "no description",
      thumbnail: `${thumbnail.path}.${thumbnail.extension}`,
      homepage: urls[0].url,
      wiki: urls[1].url,
      comics: items,
      id,
    };
  };
}
