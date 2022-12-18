import { useState, useEffect, useRef } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from "../../services/MarvelService";
import "./charList.scss";
import PropTypes from "prop-types";

const CharList = (props) => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  }, []);

  const onRequest = (offset) => {
    onCharListLoading();
    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };

  const onCharListLoading = () => {
    setNewItemLoading(true);
  };

  const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) ended = true;

    setCharList((charList) => [...charList, ...newCharList]);
    setLoading(false);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const itemRefs = useRef([]);

  const focusOnItem = (id) => {
    itemRefs.current.forEach((item) =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  const renderItems = (arr) => {
    const items = arr.map(({ thumbnail, name, id }, i) => {
      let imgStyle = { objectFit: "cover" };
      if (thumbnail.includes("image_not_available")) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li
          className="char__item"
          tabIndex={0}
          key={id}
          ref={(el) => (itemRefs.current[i] = el)}
          onClick={() => {
            props.onCharSelected(id);
            focusOnItem(i);
          }}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              props.onCharSelected(id);
              focusOnItem(i);
            }
          }}
        >
          <img src={thumbnail} alt={name} style={imgStyle} />
          <div className="char__name">{name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  };

  const items = renderItems(charList);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? items : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">
          {newItemLoading ? "Loading..." : "Load more"}
        </div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
