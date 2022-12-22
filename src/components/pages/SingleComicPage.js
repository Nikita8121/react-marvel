import { useParams, Link } from "react-router-dom";

import { useState, useEffect } from "react";
import setContent from "../../utils/setContent";
import useMarvelService from "../../services/MarvelService";

import xMen from "../../resources/img/x-men.png";
import "./singleComicPage.scss";

export default function SingleComicPage() {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const { getComic, clearError, processState, setProcessState } =
    useMarvelService();

  useEffect(() => {
    updateComic();
  }, [comicId]);

  const updateComic = () => {
    clearError();
    getComic(comicId)
      .then(onComicLoaded)
      .then(() => setProcessState("confirmed"));
  };

  const onComicLoaded = (comic) => {
    setComic(comic);
  };

  return <>{setContent(processState, View, comic)}</>;
}

const View = ({ data }) => {
  const { title, description, pageCount, thumbnail, language, price } = data;

  return (
    <div className="single-comic">
      <img src={thumbnail} alt={title} className="single-comic__img" />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{title}</h2>
        <p className="single-comic__descr">{description}</p>
        <p className="single-comic__descr">{pageCount} pages</p>
        <p className="single-comic__descr">Language: {language}</p>
        <div className="single-comic__price">{price}</div>
      </div>
      <Link to="/comics" className="single-comic__back">
        Back to all
      </Link>
    </div>
  );
};
