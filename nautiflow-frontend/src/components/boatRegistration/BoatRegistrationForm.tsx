import { useEffect, useState } from "react";
import type { SubmitEvent, ChangeEvent } from "react";
import { isAxiosError } from "axios";
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
  BoatRegistrationFormProps,
} from "./BoatFormTypes";
import { INITIAL_FORM, DOCUMENT_TYPES } from "./BoatFormTypes";

import Field from "./Field";
import UploadZone from "./UploadZone";
import ActionButton from "./ActionButton";
import { BoatOperatorService } from "../../services/BoatOperator.Service";
import { DELTA_ZONES } from "../../constants/deltaZones";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

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

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    //////////////
    if (!validateStep()) return;

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
      const registrationPayload = {
        ...form,
        photos: photos.map((photo) => photo.file),
        documents,
      };

      if (onSubmit) {
        await onSubmit(registrationPayload);
      } else {
        const response =
          await BoatOperatorService.registerOperatorAndBoat(
            registrationPayload,
          );
        console.log("Registro guardado exitosamente en NestJS:", response);
      }

      setSent(true);
    } catch (err: unknown) {
      console.error("Error al registrar en NestJS:", err);

      const responseData = isAxiosError<unknown>(err)
        ? err.response?.data
        : undefined;
      const message =
        typeof responseData === "object" &&
        responseData !== null &&
        "message" in responseData
          ? responseData.message
          : undefined;
      const apiErrorMessage = Array.isArray(message)
        ? message
            .filter((item): item is string => typeof item === "string")
            .join(", ")
        : typeof message === "string"
          ? message
          : undefined;

      setError(
        apiErrorMessage ||
          "No fue posible enviar la solicitud. Revisa los datos ingresados e intenta nuevamente.",
      );
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

    if (step === 2 && form.zone.length === 0) {
      setError("Selecciona al menos una zona de cobertura.");
      return false;
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
        return "El número de WhatsApp es obligatorio.";
      }

      if (!isValidPhoneNumber(value)) {
        return "Ingresa un número de teléfono válido con su código de país.";
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
    <main className="relative isolate min-h-screen px-4 py-8 text-base-content before:pointer-events-none before:fixed before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-primary/5 before:via-base-100 before:to-accent/10 before:content-[''] sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg text-sm text-base-content/60 transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          <ArrowLeft size={16} />
          Volver a explorar
        </Link>

        <header className="mb-8 mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <img
            src="/logo-nautiflow.png"
            alt="NautiFlow"
            className="h-14 w-fit object-contain sm:h-16"
          />

          <div>
            <span className="text-xs font-bold tracking-[0.18em] text-primary">
              PORTAL DE LANCHEROS
            </span>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Registra tu embarcación.
            </h1>

            <p className="mt-3 text-sm text-base-content/70 sm:text-base">
              Forma parte de la comunidad de capitanes de NautiFlow.
            </p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Form */}
          <section className="min-w-0 rounded-2xl border border-base-300/80 bg-base-100 p-5 shadow-md shadow-primary/5 sm:p-8">
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
                <div className="mb-10 w-full">
                  <ul className="steps steps-horizontal w-full">
                    {steps.map((item) => {
                      const active = step === item.number;
                      const completed = step > item.number;
                      const StepIcon = item.icon;

                      return (
                        <li
                          key={item.number}
                          aria-current={active ? "step" : undefined}
                          className={`step ${
                            active || completed ? "step-primary" : ""
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className={`flex h-10 w-10 items-center justify-center
                              rounded-full border-2 transition-all duration-300 ${
                                completed
                                  ? "border-primary bg-primary text-primary-content"
                                  : active
                                    ? "border-primary bg-primary/10 text-primary ring-4 ring-primary/10"
                                    : "border-base-300 bg-base-100 text-base-content/50"
                              }`}
                            >
                              {completed ? (
                                <Check size={20} />
                              ) : (
                                <StepIcon size={20} />
                              )}
                            </div>

                            <span
                              className={`max-w-20 text-center text-[10px] leading-tight sm:max-w-none sm:text-sm ${
                                active
                                  ? "font-bold text-primary"
                                  : completed
                                    ? "font-medium"
                                    : "text-base-content/60"
                              }`}
                            >
                              {item.label}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
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
                    <div className="flex flex-col gap-5">
                      <Field label="Nombre completo">
                        <input
                          className="input input-bordered w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                        <PhoneInput
                          international
                          defaultCountry="AR"
                          countryCallingCodeEditable={false}
                          value={form.phone || undefined}
                          onChange={(value) => update("phone", value ?? "")}
                          placeholder="Ingresa tu número"
                          className="input input-bordered flex w-full items-center gap-2 px-3 focus-within:border-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/20 [&_input]:w-full [&_input]:border-none [&_input]:bg-transparent [&_input]:outline-none"
                        />
                      </Field>
                    </div>
                  )}

                  {/*  2 */}
                  {step === 2 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field label="Nombre de la embarcación">
                        <input
                          className="input input-bordered w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                          className="input input-bordered w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                        label="Zonas de cobertura"
                        className="sm:col-span-2"
                      >
                        <fieldset className="space-y-3">
                          <legend className="mb-2 text-sm text-base-content/70">
                            Selecciona todos los sectores del Delta donde opera
                            la lancha.
                          </legend>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {DELTA_ZONES.map((zone) => (
                              <label
                                key={zone}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary ${
                                  form.zone.includes(zone)
                                    ? "border-primary bg-primary/5"
                                    : "border-base-300 hover:border-primary/50 hover:bg-base-200/60"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="checkbox checkbox-primary"
                                  checked={form.zone.includes(zone)}
                                  onChange={(event) => {
                                    const selected = event.target.checked
                                      ? [...form.zone, zone]
                                      : form.zone.filter(
                                          (item) => item !== zone,
                                        );
                                    update("zone", selected);
                                  }}
                                />
                                <span>{zone}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      </Field>
                    </div>
                  )}

                  {/*  3 */}
                  {step === 3 && (
                    <div className="space-y-7">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            Fotos de la embarcación
                          </span>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {photos.length} de 10 agregadas
                          </span>
                        </div>

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
                    <p
                      role="alert"
                      className="mt-5 rounded-xl border border-error/20 bg-error/10 p-3 text-sm text-error"
                    >
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
          <aside className="flex h-fit flex-col rounded-2xl border border-primary/15 bg-base-100 p-6 shadow-md shadow-primary/5 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-center">
              <div className="mr-1 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BadgeCheck size={27} />
              </div>

              <h3 className="ml-1 text-lg font-bold">Importante</h3>
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
