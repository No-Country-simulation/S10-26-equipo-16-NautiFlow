import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
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
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-20">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl"
      >
        <div className="card-body gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Acceso administrador
            </h1>
            <p className="mt-2 text-base-content/70">
              Ingresa con las credenciales del administrador de NautiFlow.
            </p>
          </div>

          <label className="form-control w-full">
            <span className="label-text mb-2">Correo electrónico</span>
            <input
              type="email"
              autoComplete="username"
              required
              className="input input-bordered w-full"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-2">Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              minLength={8}
              required
              className="input input-bordered w-full"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando…" : "Iniciar sesión"}
          </button>
        </div>
      </form>
    </section>
  );
}
