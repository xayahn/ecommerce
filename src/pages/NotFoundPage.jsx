/**
 * NotFoundPage.jsx
 * Custom 404 page with navigation back.
 */

import { Link, useNavigate } from "react-router-dom";
import Button                from "../components/Button";
import SEO                   from "../components/SEO";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <SEO title="Page Not Found" noIndex />
      <p className="text-8xl font-display font-bold text-brand-100 select-none mb-2">
        404
      </p>
      <h1 className="text-3xl font-display font-bold text-neutral-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-neutral-500 max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for.
        It might have been moved or doesn't exist.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="primary" size="lg" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Link to="/">
          <Button variant="outline" size="lg">Home</Button>
        </Link>
        <Link to="/shop">
          <Button variant="ghost" size="lg">Browse Shop</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;