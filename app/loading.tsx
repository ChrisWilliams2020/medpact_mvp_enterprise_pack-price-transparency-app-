import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <main>
      <Container className="py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-black/10 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-black rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-black/50">Loading...</p>
        </div>
      </Container>
    </main>
  );
}
