import { GaussianSplatLayer } from "./gaussian-splat-layer";
import { Viewer } from "./viewer";

/**
 * Hjälpfunktion: Beräknar en ny lat/lon från en given startpunkt,
 * ett avstånd (i meter) och en bearing (grader)
 */
function destinationPoint(lat: number, lon: number, distance: number, bearing: number) {
  const R = 6378137; // Jordens radie i meter
  const rad = Math.PI / 180;
  const lat1 = lat * rad;
  const lon1 = lon * rad;
  const brng = bearing * rad;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(brng)
  );
  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(distance / R) * Math.cos(lat1),
    Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
  );
  return { lat: lat2 / rad, lon: lon2 / rad };
}

/**
 * Hjälpfunktion: Lägger till en kyrka (Gaussian Splat‑lager) vid angiven position.
 */
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

// Skapa viewer
const viewer = new Viewer();

viewer.ready.then(() => {
  // Flyger till en övergripande vy
  viewer.flyTo(13.43450246, 58.38425682, 407.51, heading, -33.11150, 2);

  // Placera kyrkorna i en grid
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      let pos = { lat: baseLat, lon: baseLon };

      if (col > 0) {
        pos = destinationPoint(pos.lat, pos.lon, col * offsetDistance, rightBearing);
      }
      if (row > 0) {
        pos = destinationPoint(pos.lat, pos.lon, row * offsetDistance, frontBearing);
      }
      addChurch(viewer, pos.lat, pos.lon, baseHeight);
    }
  }

  // Använd en räknare för domkyrkaLoaded-eventen för att avgöra när alla kyrkor är färdigladdade.
  waitForChurchesLoaded(() => {
    console.log("Alla kyrkor är färdigladdade!");
    document.dispatchEvent(new CustomEvent("allChurchesLoaded"));
    // Här kan du starta dina test eller dispatcha ett annat event
  });
});

/**
 * Väntar på att totalt antal (totalChurches) domkyrkaLoaded-event ska ha dispatchats.
 */
function waitForChurchesLoaded(callback: () => void) {
  let loadedCount = 0;
  const handler = () => {
    loadedCount++;
    console.log("domkyrkaLoaded event count:", loadedCount);
    if (loadedCount >= totalChurches) {
      document.removeEventListener("domkyrkaLoaded", handler);
      callback();
    }
  };
  document.addEventListener("domkyrkaLoaded", handler);
}
