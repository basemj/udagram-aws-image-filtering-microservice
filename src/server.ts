import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async (): Promise<void> => {
  // Init the Express application
  const app: express.Application = express();

  // Set the network port
  const port: string = process.env.PORT || "8082";

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  interface IQuery {
    image_url: string;
  }

  app.get("/filteredimage", async (req: Request, res: Response) => {
    const { image_url }: IQuery = req.query;

    if (!image_url) {
      return res.status(400).send("image_url not provided");
    }

    return filterImageFromURL(image_url)
      .then((filteredImage: string) => {
        return res.sendFile(filteredImage, () => {
          console.log("Sent:", filteredImage);
          deleteLocalFiles([filteredImage]);
        });
      })
      .catch(() => res.status(500).send("make sure the image url is correct"));
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
