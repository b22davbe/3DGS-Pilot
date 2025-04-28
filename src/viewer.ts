import * as Cesium from "cesium";
import { ThreeOverlay } from "./three-overlay";
import { GaussianSplatLayer } from "./gaussian-splat-layer";

// Exponera Cesium globalt så att andra skript kan nå det
(window as any).Cesium = Cesium;

export class Viewer {
  public cesium!: Cesium.Viewer;
  public threeOverlay!: ThreeOverlay;
  public ready: Promise<void>;

  constructor() {
    // Skapa viewern asynkront och spara en ready-promis
    this.ready = this.createViewer().then(() => {
      this.createOverlay();
      // Kör Three.js-rendering efter att Cesium har renderat klart
      this.cesium.scene.postRender.addEventListener(() => {
        this.threeOverlay.render();
      });
    });
  } 

  private async createViewer() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YmU5ZjJhNy0wMzA3LTQxNGItYTc0Zi0zYWFiZWY2MjE0NTMiLCJpZCI6MjgxMDQ1LCJpYXQiOjE3NDQxOTA3NTd9.ELpvWBvugoiGaQJkcJLmUcLMcN0gnhmgE9jT2BOVgko";

    // Använd Cesium World Terrain via Ion-asset ID 1
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1);

    this.cesium = new Cesium.Viewer("cesium", {
      terrainProvider: terrainProvider,
    });

    this.cesium.scene.debugShowFramesPerSecond = true;

    // Exponera Cesium‑viewern globalt för dina andra skript (t.ex. Tampermonkey)
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

}