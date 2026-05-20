export default function Atmosphere() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute orb-lavender"
        style={{ top: '-10%', left: '-8%', width: '60vw', height: '60vw' }}
      />
      <div
        className="absolute orb-cerulean"
        style={{ top: '5%', right: '-12%', width: '55vw', height: '55vw' }}
      />
      <div
        className="absolute orb-sage"
        style={{ top: '55%', left: '-10%', width: '45vw', height: '45vw' }}
      />
      <div
        className="absolute orb-rose"
        style={{ top: '70%', right: '-8%', width: '40vw', height: '40vw' }}
      />
      <div
        className="absolute orb-gold"
        style={{ bottom: '-15%', left: '20%', width: '60vw', height: '50vw' }}
      />
    </div>
  );
}
