"use client";

import { UnsplashImage, UnsplashSearchResponse } from "@/models/unsplash-image";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import styles from "./SearchPage.module.css";

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<UnsplashImage[] | null>(
    null
  );
  const [searchResultsLoading, setSearchResultsLoading] = useState(false);
  const [searchResultsLoadingIsError, setSearchResultsLoadingIsError] =
    useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get("query")?.toString().trim();

    if (query) {
      try {
        setSearchResults(null);
        setSearchResultsLoadingIsError(false);
        setSearchResultsLoading(true);

        const res = await fetch("/api/search?query=" + query);
        const images: UnsplashImage[] = await res.json();
        setSearchResults(images);
      } catch (error) {
        console.log(error);
        setSearchResultsLoadingIsError(true);
      } finally {
        setSearchResultsLoading(false);
      }
    }

    // if (!query) return alert("Please, fill the search bar.");
  }

  return (
    <div>
      <Alert>
        This page fetches data <strong>client-side</strong>. In order to not
        leak API credentials, the request is sent to a NextJS{" "}
        <strong>route handler</strong> that runs on the server. This route
        handler then fetches the data from the Unsplash API and returns it to
        the client.
      </Alert>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3 " controlId="search-input">
          <Form.Label>Search query</Form.Label>
          <Form.Control name="query" placeholder="E.g. cats, dogs, apples..." />
        </Form.Group>
        <Button type="submit" className="mb-3" disabled={searchResultsLoading}>
          Search
        </Button>
      </Form>

      <div className="d-flex flex-column align-items-center">
        {searchResultsLoading && <Spinner animation="border" />}
        {searchResultsLoadingIsError && (
          <p>Something went wrong. Please, try again.</p>
        )}
        {searchResults?.length === 0 && (
          <p>Nothing found. Try a different query!</p>
        )}
      </div>

      {searchResults && (
        <>
          {searchResults.map((image) => (
            <Image
              src={image.urls.raw}
              width={250}
              height={250}
              alt={image.alt_description}
              key={image.urls.raw}
              className={styles.image}
            />
          ))}
        </>
      )}
    </div>
  );
}
