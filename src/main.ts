import { GaussianSplatLayer } from "./gaussian-splat-layer";
import { Viewer } from "./viewer";

const viewer = new Viewer();

// Vänta på att viewern är färdig innan du flyger till domkyrkan och laddar in modeller
viewer.ready.then(() => {
  // Fly till Skara Domkyrka med de önskade koordinaterna och orienteringen
  viewer.flyTo(13.43450246, 58.38425682, 407.51, 46.79851, -33.11150, 2);

  function addChurch(viewer: Viewer, lat: number, lon: number, height: number) {
    const churchLayer = new GaussianSplatLayer(
      "./data/Domkyrkan.splat",
      { lat, lon, height },
      {
        x: 1.589647099820901,
        y: 0.2756564998150081,
        z: 2.5602732916424125,
      },
      27.05 // scale
    );
    viewer.addGaussianSplatLayer(churchLayer);
  }
});

// Grid-parametrar
const numRows = 3;         // 1, 2 or 3
const numCols = 3;         // 1, 2 or 3
const totalChurches = numRows * numCols;
const offsetDistance = 100; // avstånd (i meter) mellan kyrkorna
const baseLat = 58.38579551999975;  // baslatitud (ursprunglig kyrkecentral)
const baseLon = 13.44098813000049;   // baslongitud (ursprunglig kyrkecentral)
const baseHeight = 411.34;           // bas höjd
const heading = 46.79851;            // ursprunglig heading
const frontBearing = heading;        // "framåt" = heading
const rightBearing = heading + 90;     // "höger" = heading + 90
