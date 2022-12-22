import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./comicsList.scss";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import useMarvelService from "../../services/MarvelService";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;
    case "confirmed":
      return <Component />;
    case "error":
      return <ErrorMessage />;
    default:
      throw new Error("Unexpected process state");
  }
};

const ComicsList = () => {
  const [comicList, setComicList] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [comicEnded, setComicEnded] = useState(false);

  const { getAllComics, processState, setProcessState } = useMarvelService();

  useEffect(() => {
    onRequest();
  }, []);

  const onRequest = (offset, initial = true) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onComicListLoaded)
      .then(() => setProcessState("confirmed"));
  };

  const onComicListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 8) ended = true;

    setComicList((charList) => [...charList, ...newCharList]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 9);
    setComicEnded(ended);
  };

  const renderItems = (arr) => {
    const items = arr.map(({ title, thumbnail, price, id }, i) => {
      return (
        <li key={i.toString()} className="comics__item">
          <Link to={`/comics/${id}`}>
            <img
              src={thumbnail}
              alt="ultimate war"
              className="comics__item-img"
            />
            <div className="comics__item-name">{title}</div>
            <div className="comics__item-price">{price}</div>
          </Link>
        </li>
      );
    });
    return <ul className="comics__grid">{items}</ul>;
  };

  return (
    <div className="comics__list">
      {setContent(processState, () => renderItems(comicList), newItemLoading)}
      <button
        style={{ display: comicEnded ? "none" : "block" }}
        onClick={() => onRequest(offset, false)}
        className="button button__main button__long"
      >
        <div className="inner">
          {newItemLoading ? "Loading..." : "Load more"}
        </div>
      </button>
    </div>
  );
};

export default ComicsList;
