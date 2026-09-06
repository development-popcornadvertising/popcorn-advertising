import type { StaticImageData } from "next/image";

import cocaCola from "@/assets/clients/coca-cola.png";
import deloitte from "@/assets/clients/deloitte.png";
import ford from "@/assets/clients/ford.png";
import lg from "@/assets/clients/lg.png";
import marlboro from "@/assets/clients/marlboro.png";
import microsoft from "@/assets/clients/microsoft.png";
import starbucks from "@/assets/clients/starbucks.png";
import toyota from "@/assets/clients/toyota.png";

export interface Client {
  /** Brand name. Doubles as the React key and the image's alt text. */
  name: string;
  logo: StaticImageData;
  /**
   * Rendered width in pixels, taken from the comp. The logos are not
   * optically normalised there, so each carries its own width rather than
   * a shared height: matching heights would make Starbucks' wordmark
   * enormous next to Ford's oval.
   */
  width: number;
}

/**
 * The client logo wall, in the comp's order.
 *
 * ⚠️  Every file here is a 1x raster at the size the comp renders it, so
 *     these will be soft on a 2x display. Ask the client for SVG or 2x
 *     versions; nothing else needs to change when they arrive.
 */
export const clients = [
  { name: "Microsoft", logo: microsoft, width: 177 },
  { name: "Toyota", logo: toyota, width: 183 },
  { name: "Marlboro", logo: marlboro, width: 117 },
  { name: "Coca-Cola", logo: cocaCola, width: 135 },
  { name: "Starbucks", logo: starbucks, width: 181 },
  { name: "Deloitte", logo: deloitte, width: 168 },
  { name: "Ford", logo: ford, width: 97 },
  { name: "LG", logo: lg, width: 133 },
] as const satisfies readonly Client[];
