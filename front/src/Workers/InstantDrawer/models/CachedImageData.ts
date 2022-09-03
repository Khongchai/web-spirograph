import { Vector2 } from "../../../classes/DTOInterfaces/vector2";

/**
 * Creates a snapshot of the current image for panning.
 *
 * We have to include the current information about the image's translation and zoom
 * so that we can offset that from our transformation.
 */
export type CachedImageData = {
  image?: Promise<ImageBitmap>;
  imageTranslation: Vector2;
  imageZoomLevel: number;
};
