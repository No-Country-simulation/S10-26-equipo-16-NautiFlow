import { Api } from "./Api";

type RegistrationPayload = {
  captain: string;
  phone: string;
  name: string;
  capacity: string;
  zone: string;
  photos: File[];
  documents: { name: string; file: File }[];
};

function uploadFile(url: string, file: File) {
  const body = new FormData();
  body.append("file", file);
  return Api.post(url, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export const BoatOperatorService = {
  async registerOperatorAndBoat(data: RegistrationPayload) {
    const formattedPhone = data.phone.startsWith("+")
      ? data.phone
      : `+57${data.phone}`;

    const license = data.documents.find((document) =>
      document.name.toLowerCase().includes("licencia"),
    );
    const backgroundCheck = data.documents.find((document) =>
      document.name.toLowerCase().includes("antecedentes"),
    );
    const insurance = data.documents.find((document) =>
      document.name.toLowerCase().includes("seguro"),
    );

    if (!license || !backgroundCheck || !insurance) {
      throw new Error("Debes seleccionar licencia, antecedentes y seguro.");
    }

    // El backend entrega el UUID que se usa para asociar los archivos.
    const operatorResponse = await Api.post("/boat-operators", {
      nombre: data.captain,
      telefono: formattedPhone,
    });
    const operatorId: string = operatorResponse.data.id;

    await Promise.all([
      uploadFile(
        `/boat-operator-files/operators/${operatorId}/documents/licencia`,
        license.file,
      ),
      uploadFile(
        `/boat-operator-files/operators/${operatorId}/documents/antecedentes-penales`,
        backgroundCheck.file,
      ),
    ]);

    const boatResponse = await Api.post(`/boat-operators/${operatorId}/boats`, {
      nombreEmbarcacion: data.name,
      capacidad: Number(data.capacity),
      zonaCobertura: data.zone,
    });
    const boatId: string = boatResponse.data.id;

    await uploadFile(
      `/boat-operator-files/boats/${boatId}/insurance`,
      insurance.file,
    );

    // Subirlas en serie para que cada petición agregue la foto anterior ya guardada.
    for (const photo of data.photos) {
      await uploadFile(`/boat-operator-files/boats/${boatId}/photos`, photo);
    }

    return {
      operator: (await Api.get(`/boat-operators/${operatorId}`)).data,
      boat: (await Api.get(`/boat-operators/boats/${boatId}`)).data,
    };
  },

  async getOperators() {
    const response = await Api.get("/boat-operators");
    return response.data;
  },
};
