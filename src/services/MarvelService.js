import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&apikey=${process.env.REACT_APP_API_KEY}&ts=${process.env.REACT_APP_API_TS}&hash=${process.env.REACT_APP_API_HASH}`
    );
    return _transformCharacters(res.data.results);
  };

  const getCharacter = async (id) => {
    const res = await request(
      `${_apiBase}characters/${id}?apikey=${process.env.REACT_APP_API_KEY}&ts=${process.env.REACT_APP_API_TS}&hash=${process.env.REACT_APP_API_HASH}`
    );
    return _transformCharacter(res.data.results[0]);
  };

  const getAllComics = async (offset) => {
    const res = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&apikey=${process.env.REACT_APP_API_KEY}&ts=${process.env.REACT_APP_API_TS}&hash=${process.env.REACT_APP_API_HASH}`
    );
    console.log(res);
    return _transformComics(res.data.results);
  };

  const _transformComic = ({
    title,
    thumbnail: { path, extension },
    prices,
    urls,
  }) => {
    return {
      title,
      thumbnail: `${path}.${extension}`,
      price: prices[0].price,
      link: urls[0].url,
    };
  };

  const _transformComics = (arrComics) => {
    return arrComics.map((comic) => _transformComic(comic));
  };

  const _transformCharacters = (arrChars) => {
    return arrChars.map((char) => _transformCharacter(char));
  };

  const _transformCharacter = (char) => {
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

  return {
    loading,
    error,
    getAllCharacters,
    getCharacter,
    clearError,
    getAllComics,
  };
};

export default useMarvelService;
