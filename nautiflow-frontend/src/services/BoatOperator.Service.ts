import { Api } from "./Api";

export const BoatOperatorService = {
  async registerOperatorAndBoat(data: {
    captain: string;
    phone: string;
    name: string;
    capacity: string;
    zone: string;
    photos: File[];
    documents: { name: string; file: File }[];
  }) {
    // 1. Formatear el teléfono para cumplir con @IsPhoneNumber('CO')
    const formattedPhone = data.phone.startsWith("+")
      ? data.phone
      : `+57${data.phone}`;

    // Extraer documentos específicos si existen
    const licenciaDoc = data.documents.find((d) =>
      d.name.toLowerCase().includes("licencia"),
    );
    const antecedentesDoc = data.documents.find((d) =>
      d.name.toLowerCase().includes("antecedentes"),
    );
    const seguroDoc = data.documents.find((d) =>
      d.name.toLowerCase().includes("seguro"),
    );

    // TODO: subida de archivos (Cloudinary/S3/NestJS), reemplaza URLs simuladas por la subida real.
    const licenciaUrl = licenciaDoc
      ? `https://storage.nautiflow.com/docs/${licenciaDoc.file.name}`
      : "https://ejemplo.com/licencia.pdf";
    const antecedentesUrl = antecedentesDoc
      ? `https://storage.nautiflow.com/docs/${antecedentesDoc.file.name}`
      : undefined;
    const seguroUrl = seguroDoc
      ? `https://storage.nautiflow.com/docs/${seguroDoc.file.name}`
      : undefined;
    const fotosUrl =
      data.photos.length > 0
        ? `https://storage.nautiflow.com/photos/${data.photos[0].name}`
        : undefined;

    // Crear el operador de embarcación en NestJS (POST /boat-operators)
    const operatorResponse = await Api.post("/boat-operators", {
      nombre: data.captain,
      telefono: formattedPhone,
      licenciaUrl,
      antecedentesPenalesUrl: antecedentesUrl,
    });

    const operatorId = operatorResponse.data.id; // UUID retornado por NestJS

    // Crear la embarcación asociada (POST /boat-operators/:id/boats)
    const boatResponse = await Api.post(`/boat-operators/${operatorId}/boats`, {
      nombreEmbarcacion: data.name,
      capacidad: Number(data.capacity), // Convertir a number por @IsInt()
      zonaCobertura: data.zone,
      seguroUrl,
      fotosUrl,
    });

    return {
      operator: operatorResponse.data,
      boat: boatResponse.data,
    };
  },

  async getOperators() {
    const response = await Api.get("/boat-operators");
    return response.data;
  },
};
