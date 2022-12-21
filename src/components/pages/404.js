import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div>
      <ErrorMessage />
      <p>Page doesn't exist</p>
      <Link to="/">Back to main page</Link>
    </div>
  );
}
