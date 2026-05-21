import Link from "next/link";

const FORMATS = [
  { format: "Blitz", rounds: 4, duration: "15 min", total: "1 hr" },
  { format: "Speed", rounds: 8, duration: "30 min", total: "4 hr" },
  { format: "Day", rounds: 12, duration: "40 min", total: "8 hr" },
];

export default function RulesPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-arena-muted hover:text-white transition">
          &larr; Lobby
        </Link>

        <h1 className="text-3xl font-black mt-6 mb-8 uppercase tracking-wider">
          Rules of Engagement
        </h1>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed">
          <Rule n={1}>Everyone starts with <Strong>10,000 chips</Strong>.</Rule>
          <Rule n={2}>The <Strong>ONLY</Strong> thing that matters: <Strong>NET PROFIT</Strong>.</Rule>
          <Rule n={3}>Every round, the <Strong>bottom 10%</Strong> gets eliminated.</Rule>
          <Rule n={4}>You <Strong>CAN</Strong> bust out (drop below 100 chips) at any time &mdash; that&apos;s the &ldquo;all-in&rdquo; risk.</Rule>
          <Rule n={5}>During breaks: <Strong>positions freeze</Strong>, adjust your bot&apos;s strategy via the crew chief.</Rule>
          <Rule n={6}>Final table: last survivors fight to the finish.</Rule>
          <Rule n={7}>Winner takes the biggest slice of the <Strong>prize pool</Strong>.</Rule>
        </div>

        <div className="mt-10 bg-arena-card border border-arena-accent/20 rounded-lg p-5 text-center">
          <p className="text-arena-accent font-bold text-lg">
            You can&apos;t win the tournament in Round 1.
          </p>
          <p className="text-arena-red font-bold text-lg mt-1">
            But you can definitely LOSE it.
          </p>
        </div>

        {/* Format Table */}
        <h2 className="text-lg font-black mt-12 mb-4 uppercase tracking-wider">Tournament Formats</h2>
        <div className="bg-arena-card border border-arena-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-arena-muted text-[10px] uppercase bg-arena-bg/50">
              <tr>
                <th className="text-left px-4 py-2">Format</th>
                <th className="text-center px-4 py-2">Rounds</th>
                <th className="text-center px-4 py-2">Round Duration</th>
                <th className="text-center px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {FORMATS.map(f => (
                <tr key={f.format} className="border-t border-arena-border/30">
                  <td className="px-4 py-3 font-bold">{f.format}</td>
                  <td className="px-4 py-3 text-center font-mono">{f.rounds}</td>
                  <td className="px-4 py-3 text-center font-mono">{f.duration}</td>
                  <td className="px-4 py-3 text-center font-mono text-arena-accent">{f.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-black mt-12 mb-4 uppercase tracking-wider">Key Constants</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Starting Chips", value: "10,000" },
            { label: "Bust Threshold", value: "100 chips" },
            { label: "Break Duration", value: "60 seconds" },
            { label: "Elimination Rate", value: "Bottom 10%" },
          ].map(c => (
            <div key={c.label} className="bg-arena-card border border-arena-border rounded-lg p-3 text-center">
              <div className="text-lg font-black font-mono text-arena-accent">{c.value}</div>
              <div className="text-[9px] text-arena-muted uppercase">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Round Flow */}
        <h2 className="text-lg font-black mt-12 mb-4 uppercase tracking-wider">Round Flow</h2>
        <div className="flex items-center gap-2 text-xs font-mono text-arena-muted">
          <span className="px-3 py-1.5 bg-arena-green/10 text-arena-green border border-arena-green/20 rounded">⚔️ TRADING</span>
          <span>&rarr;</span>
          <span className="px-3 py-1.5 bg-arena-blue/10 text-arena-blue border border-arena-blue/20 rounded">⏸ BREAK (60s)</span>
          <span>&rarr;</span>
          <span className="px-3 py-1.5 bg-arena-red/10 text-arena-red border border-arena-red/20 rounded">❌ ELIMINATION</span>
          <span>&rarr;</span>
          <span className="text-arena-muted">Next Round</span>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-arena-accent font-bold hover:underline">&larr; Back to Lobby</Link>
        </div>
      </div>
    </div>
  );
}

function Rule({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="text-2xl font-black text-arena-accent/40 font-mono shrink-0 w-8">{n}</span>
      <p>{children}</p>
    </div>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="text-white font-bold">{children}</span>;
}
