import { MessageCircle } from "lucide-react";

export default function WhatsAppContact({
  phone,
  boatName,
  className = "",
}: {
  phone: string;
  boatName: string;
  className?: string;
}) {
  const internationalNumber = phone.replace(/\D/g, "");
  if (internationalNumber.length < 8 || internationalNumber.length > 15)
    return null;

  const message = `Hola, quisiera consultar disponibilidad para la lancha ${boatName}.`;
  const href = `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-success btn-sm ${className}`}
      aria-label={`Contactar a ${boatName} por WhatsApp`}
    >
      <MessageCircle size={16} aria-hidden="true" />
      WhatsApp
    </a>
  );
}
