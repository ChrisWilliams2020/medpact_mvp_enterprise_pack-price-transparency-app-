import Link from "next/link";
import { Container, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main>
      <Container className="py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mb-6 text-8xl font-extrabold text-black/10">404</div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Page Not Found
          </h1>
          <p className="mt-4 text-black/70">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary">Contact Us</Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
