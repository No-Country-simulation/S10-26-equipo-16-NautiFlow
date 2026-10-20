export default function Hero() {
  return (
    <div
      className="mt-16 hero min-h-1/2"
      style={{
        backgroundImage:
          "url(https://plus.unsplash.com/premium_photo-1675802755792-a7cfd346b5be)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center ">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl text-white font-bold">
            Tu proxima aventura comienza en el mar
          </h1>
          <p className="mb-5">
           Experiencias que se convierten en recuerdos
          </p>
          
        </div>
      </div>
    </div>
  );
}
