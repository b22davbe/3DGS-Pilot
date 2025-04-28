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
