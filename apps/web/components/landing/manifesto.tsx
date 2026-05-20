export default function Manifesto() {
  return (
    <section className="relative">
      <div className="max-w-[1080px] mx-auto px-8 lg:px-14 py-28 lg:py-40 text-center">
        <span className="eyebrow">Our position</span>
        <p className="font-display mt-6 mx-auto text-balance text-foreground max-w-[30ch] leading-[1.3] tracking-[-0.005em] font-light text-[clamp(2rem,_4.0vw,_3.0rem)]">
          Most form tools treat questions like rows in a spreadsheet.{' '}
          <em className="italic text-primary font-normal">We treat them like brushstrokes</em> -
          each one earning its place on the canvas.
        </p>

        <div className="mt-12 flex items-center justify-center gap-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-body italic text-sm text-muted-foreground">
            A small note from the makers of StarForm
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-8 lg:px-14">
        <div className="brushstroke" />
      </div>
    </section>
  );
}
