import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: "Nenhum arquivo fornecido" });
    }

    const result = await cloudinary.v2.uploader.upload(file, {
      folder: "profile_pictures",
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Erro no upload:", error);
    return res.status(500).json({ error: "Falha ao enviar imagem", details: error.message });
  }
}
