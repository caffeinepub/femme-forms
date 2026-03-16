import LoadingState from "../components/states/LoadingState";
import { useGetAboutContent } from "../hooks/useQueries";

export default function AboutPage() {
  const { data: aboutContent, isLoading } = useGetAboutContent();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          About the Artist
        </h1>
        <div className="prose prose-lg mt-8 max-w-none">
          <p className="text-muted-foreground">{aboutContent}</p>
          <p className="mt-4 text-muted-foreground">
            My art explores the beauty and sensuality of the feminine form
            through sketches that celebrate women's faces, bodies, and essence.
            Each piece is a tribute to the grace, strength, and allure that
            define femininity.
          </p>
          <p className="mt-4 text-muted-foreground">
            Working primarily with pencil and charcoal, I create intimate
            portraits and figure studies that capture moments of vulnerability,
            confidence, and natural elegance. Every sketch is hand-drawn and
            one-of-a-kind.
          </p>
          <p className="mt-4 text-muted-foreground">
            In addition to original artwork, I also design and curate a
            collection of jewelry pieces that complement the aesthetic of my
            sketches—rustic, elegant, and timeless.
          </p>
        </div>
      </div>
    </div>
  );
}
