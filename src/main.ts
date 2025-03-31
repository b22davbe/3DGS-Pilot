import { GaussianSplatLayer } from "./gaussian-splat-layer";
import { Viewer } from "./viewer";

const viewer = new Viewer();

// Vänta på att viewern är färdig innan du flyger till domkyrkan och laddar in modeller
viewer.ready.then(() => {
  // Fly till Skara Domkyrka med de önskade koordinaterna och orienteringen
  viewer.flyTo(13.43450246, 58.38425682, 407.51, 46.79851, -33.11150, 2);

  // Ladda in Opera House-lagret (för verifiering)
  function loadOperaHouse() {
    const operaHouseLayer = new GaussianSplatLayer(
      "./data/Sydney.splat",  // Vägen till modellen
      {
        lon: 151.21519000000004,
        lat: -33.859195000000696,
        height: -16,
      },
      {
        x: 2.1650596257576185,
        y: -0.04732982932177055,
        z: -0.8175728862675601,
      },
      91.15
    );
    viewer.addGaussianSplatLayer(operaHouseLayer);
  }

  loadOperaHouse();
});
