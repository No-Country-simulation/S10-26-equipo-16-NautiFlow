import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert, LockKeyhole, Mail } from "lucide-react";
import { Api } from "../services/Api";
import { saveAuthToken } from "../services/auth";

type LoginResponse = { access_token: string };

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await Api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      const token = response.data?.access_token;
      if (typeof token !== "string" || token.length === 0) {
        throw new Error("El backend no devolvió un token de acceso.");
      }
      saveAuthToken(token);
      navigate("/admin-panel", { replace: true });
    } catch {
      setError("No fue posible iniciar sesión. Verifica tus credenciales.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-linear-to-br from-primary/5 via-base-100 to-accent/10 px-4 py-16 sm:py-20">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md rounded-3xl border border-base-300/80 bg-base-100 shadow-2xl shadow-primary/10"
      >
        <div className="card-body gap-5 p-6 sm:p-8">
          <div className="text-center">
            <img
              src="/logo-nautiflow.png"
              alt="NautiFlow"
              className="mx-auto mb-5 h-16 w-auto object-contain"
            />
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">
              Acceso administrador
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70 sm:text-base">
              Ingresa con las credenciales del administrador de NautiFlow.
            </p>
          </div>

          <label className="form-control w-full">
            <span className="label-text mb-2">Correo electrónico</span>
            <span className="relative block">
              {/* Input primero */}
              <input
                type="email"
                autoComplete="username"
                required
                placeholder="tucorreo@ejemplo.com"
                className="input input-bordered w-full pl-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {/* Icono después para que se pinte encima */}
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                size={18}
              />
            </span>
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-2">Contraseña</span>
            <span className="relative block">
              {/* Input primero */}
              <input
                type="password"
                autoComplete="current-password"
                minLength={8}
                required
                placeholder="Ingresa tu contraseña"
                className="input input-bordered w-full pl-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {/* Icono después para que se pinte encima */}
              <LockKeyhole
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                size={18}
              />
            </span>
          </label>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-error/20 bg-error/10 p-3 text-sm text-error"
            >
              <CircleAlert
                aria-hidden="true"
                className="mt-0.5 shrink-0"
                size={17}
              />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary mt-1 w-full rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
          </button>
        </div>
      </form>
    </section>
  );
}
