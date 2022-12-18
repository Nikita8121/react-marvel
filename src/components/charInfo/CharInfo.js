import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";
import MarvelService from "../../services/MarvelService";

const CharInfo = ({charId}) => {
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
  }, [charId]);

  const updateChar = () => {
    if (!charId) {
      return;
    }

    marvelService.getCharacter(charId).then(onCharLoaded).catch(onError);
  };

  const onCharLoaded = (char) => {
    setChar(char);
    setLoading(false);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const skeleton = char || loading || error ? null : <Skeleton />;
  const spinner = loading ? <Spinner /> : null;
  const errorMessage = error ? <ErrorMessage /> : null;
  const content = !(loading || error || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {spinner}
      {errorMessage}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;

  let imgStyle = { objectFit: "cover" };
  if (thumbnail.includes("image_not_available")) {
    imgStyle = { objectFit: "unset" };
  }
  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} style={imgStyle} alt="abyss" />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : "There is no comments"}
        {comics.slice(0, 10).map((item, i) => {
          return (
            <li key={i.toString()} className="char__comics-item">
              {item.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
