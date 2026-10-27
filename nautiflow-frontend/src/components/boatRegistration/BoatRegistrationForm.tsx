import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  FileCheck,
  ImagePlus,
  Ship,
  UserRound,
  X,
} from "lucide-react";
import type {
  BoatFormData,
  
  UploadedFile,
  BoatDocument,
  BoatRegistrationData,
  BoatRegistrationFormProps,
  DocumentType,
} from "./boatFormTypes";
import { INITIAL_FORM, DOCUMENT_TYPES } from "./boatFormTypes";

import Field from "./Field";
import UploadZone from "./UploadZone";
import ActionButton from "./ActionButton";

export default function BoatRegistrationForm({
  onSubmit,
}: BoatRegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BoatFormData>(INITIAL_FORM);
  const [photos, setPhotos] = useState<UploadedFile[]>([]);
  const [documents, setDocuments] = useState<BoatDocument[]>([]);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  //clear temporary URLs
  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, [photos]);

  function update<K extends keyof BoatFormData>(
    key: K,
    value: BoatFormData[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    );

    if (validFiles.length !== files.length) {
      setError("Selecciona fotografías JPG, PNG o WebP.");
    } else {
      setError("");
    }

    const available = Math.max(0, 10 - photos.length);
    const selected = validFiles.slice(0, available);

    if (selected.length < validFiles.length) {
      setError("Máximo 10 fotografías.");
    }

    setPhotos((previous) => [
      ...previous,
      ...selected.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);

    // Allows to select the same file.
    event.target.value = "";
  }

  function removePhoto(photoToRemove: UploadedFile) {
    URL.revokeObjectURL(photoToRemove.previewUrl);

    setPhotos((previous) =>
      previous.filter((photo) => photo !== photoToRemove),
    );
  }

  function handleDocumentChange(
    name: string,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!validTypes.includes(file.type)) {
      setError("El documento debe ser PDF, JPG, PNG o WebP.");
      event.target.value = "";
      return;
    }

    setError("");

    setDocuments((previous) => [
      ...previous.filter((document) => document.name !== name),
      { name, file },
    ]);

    event.target.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    //////////////
    if (!validateStep()) {
      return;
    }

    if (step < 3) {
      setStep((previous) => previous + 1);
      return;
    }

    const photosError = formValidation.photos(
      photos.map((photo) => photo.file),
    );

    const documentsError = formValidation.documents(documents);

    if (photosError || documentsError) {
      setError(photosError ?? documentsError ?? "");
      return;
    }

    /////////////////////////

    setLoading(true);

    try {
      const data: BoatRegistrationData = {
        ...form,
        photos: photos.map((photo) => photo.file),
        documents,
      };

      if (onSubmit) {
        await onSubmit(data);
      } else {
        // API conection pending.
        console.info("Datos de registro de embarcación:", data);
      }

      setSent(true);
    } catch {
      setError("No fue posible enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    setError("");
    setStep((previous) => Math.max(1, previous - 1));
  }

  function validateStep(): boolean {
    setError("");

    if (step === 1) {
      const captainError = formValidation.captain(form.captain);
      const phoneError = formValidation.phone(form.phone);

      if (captainError || phoneError) {
        setError(captainError ?? phoneError ?? "");
        return false;
      }
    }

    return true;
  }
  const formValidation = {
    captain: (value: string): string | null => {
      if (!value.trim()) {
        return "El nombre del lanchero es obligatorio.";
      }

      if (value.trim().length < 2) {
        return "El nombre debe tener al menos 2 caracteres.";
      }

      return null;
    },

    phone: (value: string): string | null => {
      if (!value) {
        return "El número de teléfono es obligatorio.";
      }

      if (!/^\d+$/.test(value)) {
        return "El teléfono solo debe contener números.";
      }

      if (value.length < 10 || value.length > 13) {
        return "El teléfono debe tener entre 10 y 13 dígitos.";
      }

      return null;
    },

    photos: (files: File[]): string | null => {
      if (files.length === 0) {
        return "Debes subir al menos una fotografía de la embarcación.";
      }

      return null;
    },

    documents: (files: BoatDocument[]): string | null => {
      const missingDocuments = DOCUMENT_TYPES.filter(
        (type) => !files.some((document) => document.name === type),
      );

      if (missingDocuments.length > 0) {
        return `Debes subir: ${missingDocuments.join(", ")}.`;
      }

      return null;
    },
  };

  const steps = [
    { number: 1, label: "Tus datos", icon: UserRound },
    { number: 2, label: "Embarcación", icon: Ship },
    { number: 3, label: "Documentos", icon: FileCheck },
  ];

  return (
    <main className="min-h-screen bg-base-200/50 px-4 py-8 text-base-content sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-base-content/60 transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Volver a explorar
        </Link>

        <header className="mb-8 mt-7">
          <span className="text-xs font-bold tracking-[0.18em] text-primary">
            PORTAL DE LANCHEROS
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Registra tu embarcación.
          </h1>

          <p className="mt-3 text-sm text-base-content/65 sm:text-base">
            Forma parte de la comunidad de capitanes de Nautiflow.
          </p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Form */}
          <section className="min-w-0 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8">
            {sent ? (
              <div className="py-10 text-center sm:py-14">
                <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Check size={32} />
                </div>

                <h2 className="text-2xl font-bold">
                  Solicitud enviada a revisión
                </h2>

                <p className="mt-4 leading-7 text-base-content/70">
                  {form.captain}, recibimos la información de {form.name}.
                </p>

                <span className="mt-5 inline-flex rounded-full bg-warning/15 px-4 py-2 text-xs font-semibold text-warning">
                  Pendiente de verificación
                </span>

                {!onSubmit && (
                  <p className="mx-auto mt-6 max-w-md text-xs leading-5 text-base-content/60">
                    El administrador se pondrá en contacto contigo una vez
                    validada la información
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* Step indicator */}
                <div className="mb-9 flex items-start justify-between gap-2">
                  {steps.map((item, index) => {
                    const StepIcon = item.icon;
                    const active = step === item.number;
                    const completed = step > item.number;

                    return (
                      <div
                        key={item.number}
                        className="relative flex flex-1 flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3"
                      >
                        {index > 0 && (
                          <div
                            className={`absolute right-1/2 top-5 -z-0 h-0.5 w-full ${
                              step >= item.number ? "bg-primary" : "bg-base-300"
                            }`}
                          />
                        )}

                        <span
                          className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full ${
                            active || completed
                              ? "bg-primary text-primary-content"
                              : "border border-base-300 bg-base-200 text-base-content/50"
                          }`}
                        >
                          {completed ? (
                            <Check size={17} />
                          ) : (
                            <StepIcon size={17} />
                          )}
                        </span>

                        <span
                          className={`relative z-10 text-center text-[11px] sm:text-xs ${
                            active
                              ? "font-bold text-primary"
                              : "text-base-content/60"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSubmit}>
                  <h2 className="mb-6 text-xl font-bold">
                    {step === 1
                      ? "Registro de lanchero"
                      : step === 2
                        ? "Información de tu embarcación"
                        : "Fotos y documentación"}
                  </h2>

                  {/* PASO 1 */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field label="Nombre completo">
                        <input
                          className="input input-bordered w-full"
                          required
                          autoComplete="name"
                          placeholder="Nombre y apellidos"
                          value={form.captain}
                          onChange={(event) =>
                            update("captain", event.target.value)
                          }
                        />
                      </Field>

                      <Field
                        label="Número de WhatsApp"
                        className="sm:col-span-2"
                      >
                        <input
                          className="input input-bordered w-full"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          required
                          minLength={10}
                          maxLength={13}
                          placeholder="9981234567"
                          value={form.phone}
                          onChange={(event) => {
                            const digitsOnly = event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 13);

                            update("phone", digitsOnly);
                          }}
                        />
                      </Field>
                    </div>
                  )}

                  {/*  2 */}
                  {step === 2 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field label="Nombre de la embarcación">
                        <input
                          className="input input-bordered w-full"
                          required
                          placeholder="Ej. Azul Caribe"
                          value={form.name}
                          onChange={(event) =>
                            update("name", event.target.value)
                          }
                        />
                      </Field>

                      <Field label="Capacidad de pasajeros">
                        <input
                          className="input input-bordered w-full"
                          required
                          type="number"
                          min={1}
                          max={100}
                          step={1}
                          placeholder="Ej. 8"
                          value={form.capacity}
                          onChange={(event) =>
                            update("capacity", event.target.value)
                          }
                        />
                      </Field>

                      <Field
                        label="Zona de cobertura"
                        className="sm:col-span-2"
                      >
                        <select
                          className="select select-bordered w-full"
                          required
                          value={form.zone}
                          onChange={(event) =>
                            update("zone", event.target.value)
                          }
                        >
                          <option value="Cancún">Cancún</option>
                          <option value="Isla Mujeres">Isla Mujeres</option>
                          <option value="Cozumel">Cozumel</option>
                        </select>
                      </Field>
                    </div>
                  )}

                  {/*  3 */}
                  {step === 3 && (
                    <div className="space-y-7">
                      <div>
                        <span className="mb-3 block text-sm font-medium">
                          Fotos de la embarcación
                        </span>

                        <UploadZone
                          title="Seleccionar fotografías"
                          description="JPG, PNG o WebP · Máximo 10 fotografías"
                          icon={
                            <ImagePlus size={25} className="text-primary" />
                          }
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          ariaLabel="Fotos de la embarcación"
                          onChange={handlePhotosChange}
                        />

                        {photos.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {photos.map((photo, index) => (
                              <div
                                key={`${photo.file.name}-${index}`}
                                className="relative min-w-0"
                              >
                                <img
                                  src={photo.previewUrl}
                                  alt={`Foto de embarcación ${index + 1}`}
                                  className="h-28 w-full rounded-xl border border-base-300 object-cover"
                                />

                                <button
                                  type="button"
                                  aria-label={`Eliminar fotografía ${index + 1}`}
                                  onClick={() => removePhoto(photo)}
                                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-base-100 text-error shadow hover:bg-base-200"
                                >
                                  <X size={15} />
                                </button>

                                <p className="mt-1 truncate text-xs text-base-content/60">
                                  {photo.file.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {DOCUMENT_TYPES.map((name) => {
                          const selected = documents.find(
                            (document) => document.name === name,
                          );

                          return (
                            <div key={name}>
                              <span className="mb-3 block text-sm font-medium">
                                {name}
                              </span>

                              <UploadZone
                                title={
                                  selected
                                    ? "Cambiar documento"
                                    : "Subir documento"
                                }
                                description="Fotografía o PDF"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                ariaLabel={name}
                                onChange={(event) =>
                                  handleDocumentChange(name, event)
                                }
                              />

                              {selected && (
                                <div className="mt-2 flex items-start gap-2 text-xs text-base-content/70">
                                  <FileCheck
                                    size={16}
                                    className="shrink-0 text-primary"
                                  />
                                  <span className="break-all">
                                    {selected.file.name}
                                  </span>

                                  <button
                                    type="button"
                                    aria-label={`Eliminar ${name}`}
                                    className="ml-auto text-error hover:underline"
                                    onClick={() =>
                                      setDocuments((previous) =>
                                        previous.filter(
                                          (document) => document.name !== name,
                                        ),
                                      )
                                    }
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {error && (
                    <p role="alert" className="mt-5 text-sm text-error">
                      {error}
                    </p>
                  )}

                  {/* Navegación */}
                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-base-300 pt-6">
                    <ActionButton
                      type="button"
                      variant="ghost"
                      disabled={step === 1 || loading}
                      onClick={goBack}
                    >
                      <ArrowLeft size={16} />
                      Anterior
                    </ActionButton>

                    <ActionButton type="submit" disabled={loading}>
                      {loading
                        ? "Enviando..."
                        : step === 3
                          ? "Enviar a verificación"
                          : "Continuar"}

                      {!loading && <ArrowRight size={16} />}
                    </ActionButton>
                  </div>
                </form>
              </>
            )}
          </section>

          {/* Panel informativo */}
          <aside className="rounded-2xl border border-base-300 bg-base-100 p-6">
            <div className="flex justify-center items-center">
              <div className=" flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mr-1">
                <BadgeCheck size={27} />
              </div>

              <h3 className="text-lg font-bold ml-1">Importante </h3>
            </div>

            <p className="mt-4 text-sm leading-7 text-base-content/65">
              Revisamos la documentación de cada capitán y su embarcación para
              que los viajeros naveguen con tranquilidad.
            </p>

            <div className="mt-6 space-y-4 border-t border-base-300 pt-6">
              {[
                "El administrador validará tus documentos.",
                "Te enviará un mensaje de Whats App para informarte el status.",
                "Al ser aprobado podrás comenzar a recibir viajes.",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </p>
              ))}
            </div>

            <p className="mt-8 text-xs leading-6 text-base-content/55">
              Tus documentos serán utilizados para el proceso de verificación de
              tu registro.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
