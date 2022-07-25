import { TextStyle } from "pixi.js";

export default class TitleStyle extends TextStyle {
  constructor(gameWidth: number) {
    super({
      fontFamily: "Roboto",
      fill: "#FFF",
      fontSize: 36,
      wordWrap: true,
      wordWrapWidth: gameWidth / 2 - 100,
    });
  }
}
