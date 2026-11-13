export default function Hero() {
  return (
    <div
      className="hero min-h-[clamp(24rem,58vh,42rem)] w-full bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "url(https://plus.unsplash.com/premium_photo-1675802755792-a7cfd346b5be)",
        backgroundPosition: "center 55%",
      }}
    >
      <div className="hero-overlay bg-linear-to-b from-slate-950/25 via-slate-950/45 to-slate-950/65"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-3xl">
          <h1 className="mx-auto mb-4 max-w-2xl text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Tu próxima aventura comienza en el mar
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/90 sm:text-lg">
            Experiencias que se convierten en recuerdos
          </p>
        </div>
      </div>
    </div>
  );
}
