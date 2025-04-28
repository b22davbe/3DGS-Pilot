(window as any).Cesium = Cesium;
import * as Cesium from "cesium";
import { ThreeOverlay } from "./three-overlay";
import { GaussianSplatLayer } from "./gaussian-splat-layer";

export class Viewer {
  public cesium!: Cesium.Viewer;
  private threeOverlay!: ThreeOverlay;
  public ready: Promise<void>;

  constructor() {
    // Skapa viewern asynkront och spara ready-promisen
    this.ready = this.createViewer().then(() => {
      this.createOverlay();
      // Kör Three.js-rendering efter att Cesium har renderat 
      this.cesium.scene.postRender.addEventListener(() => {
        this.threeOverlay.render();
      });
    });
  }

  private async createViewer() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MWVmMWFiNi00YWM1LTQxZWUtOTFkYy0xM2M2MmUzYTZjMDIiLCJpZCI6MjgxMDQ1LCJpYXQiOjE3NDEwOTkyNjl9.Ji4X--LQ3PLpuJoBnA-aipNj642E9aSV3SWi-TIP86g";

    // Använd Cesium World Terrain via Ion-asset ID 1
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1);

    this.cesium = new Cesium.Viewer("cesium", {
      terrainProvider: terrainProvider,
    });

    this.cesium.scene.debugShowFramesPerSecond = true;
    this.addOSMBuildings();

    // Exponera Cesium‑viewern globalt för dina Tampermonkey-skript
    (window as any).viewer = this.cesium;
  }

  private createOverlay() {
    this.threeOverlay = new ThreeOverlay(this.cesium.camera);
  }

  public flyTo(
    x: number,
    y: number,
    z: number,
    heading: number,
    pitch: number,
    duration: number
  ): void {
    this.cesium.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(x, y, z),
      orientation: {
        heading: Cesium.Math.toRadians(heading),
        pitch: Cesium.Math.toRadians(pitch),
        roll: 0.0,
      },
      duration: duration,
    });
  }

  public addGaussianSplatLayer(layer: GaussianSplatLayer): void {
    this.threeOverlay.addGaussianSplatLayer(layer);
  }

  private async addOSMBuildings(): Promise<void> {
    try {
      const osmBuildings = await Cesium.Cesium3DTileset.fromIonAssetId(96188);
      this.cesium.scene.primitives.add(osmBuildings);
      // Vänta på att tilesetet är klart innan styling appliceras
      console.log("✅ Cesium OSM Buildings laddades in!");

      // Applicera defaultStyle (om det finns) och döljer Skara Domkyrka
      const extras = osmBuildings.asset.extras;
      if (
        Cesium.defined(extras) &&
        Cesium.defined(extras.ion) &&
        Cesium.defined(extras.ion.defaultStyle)
      ) {
        osmBuildings.style = new Cesium.Cesium3DTileStyle({
          ...extras.ion.defaultStyle,
          show: {
            conditions: [
              // ["${name} === 'Skara Domkyrka'", "false"], // Hide the Church
              ["${name} === 'Sydney Opera House'", "false"], // Hide Sydney Opera House
              ["true", "true"],
            ],
          },
        });
      }
    } catch (error) {
      console.error("❌ Kunde inte ladda OSM Buildings:", error);
    }
  }
}
