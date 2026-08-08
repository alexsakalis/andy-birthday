import { AlexLoginForm } from "@/components/alex/AlexLoginForm";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AlexLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath =
    typeof params.next === "string" && params.next.startsWith("/alex")
      ? params.next
      : "/alex";

  return (
    <main className="relative min-h-full overflow-hidden bg-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 10%, rgba(244,200,200,0.55), transparent 55%), radial-gradient(ellipse 70% 45% at 90% 20%, rgba(212,165,116,0.35), transparent 50%), linear-gradient(180deg, #fff9f2 0%, #fbf6ef 45%, #f0e2d0 100%)",
        }}
      />
      <div className="relative flex min-h-full items-center px-4 py-16">
        <AlexLoginForm nextPath={nextPath} />
      </div>
    </main>
  );
}
