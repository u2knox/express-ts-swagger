import { Router } from "express";

import { useFileService } from "../services/fileService";
import path from "path";

export const userFileService = () => {
  const router = Router();

  const { getFile } = useFileService();

  router.get("/:id", async (req, res) => {
    try {
      const file = await getFile(parseInt(req.params.id));
      res.sendFile(
        file.path,
        {
          root: path.join(process.cwd()),
          headers: {
            "Content-Type": file.mimetype,
          },
        },
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
    } catch {
      res.sendStatus(404);
    }
  });

  return router;
};
