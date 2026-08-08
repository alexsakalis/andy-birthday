import { AlexDashboard } from "@/components/alex/AlexDashboard";

export default function AlexDashboardPage() {
  return (
    <main className="relative min-h-full overflow-hidden bg-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 10% 0%, rgba(244,200,200,0.45), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 10%, rgba(201,149,106,0.28), transparent 50%), linear-gradient(180deg, #fff9f2 0%, #fbf6ef 40%, #f0e2d0 100%)",
        }}
      />
      <div className="relative">
        <AlexDashboard />
      </div>
    </main>
  );
}
