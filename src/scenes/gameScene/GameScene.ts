import { Container, Loader, Sprite, Texture } from "pixi.js";
import { SceneManager, IScene } from "../sceneManager/SceneManager";
import { Background } from "./background/Background";
import { Bird } from "./bird/Bird";
import { Pipes } from "./pipes/Pipes";
import { UI } from "./ui/UI";
import birdAtlas from "../../resources/bird.json";

export class GameScene extends Container implements IScene {
    private _gameWidth: number;
    private _gameHeight: number;
    private _ui: UI;
    private _background: Background;
    private _bird: Bird;
    private _pipes: Pipes;
    protected _manager: SceneManager;

    constructor(manager: SceneManager, gameWidth: number, gameHeight: number) {
        super();
        this._gameWidth = gameWidth;
        this._gameHeight = gameHeight;

        const envTextures = Loader.shared.resources["environment"].textures!;

        const bcgTexture = envTextures["background.png"];
        this._background = new Background(
            bcgTexture,
            this._gameWidth,
            this._gameHeight
        );

        const birdTextures = this.getBirdTextures();
        this._bird = new Bird(birdTextures);

        this._pipes = new Pipes(envTextures, this);

        this._ui = new UI(this);

        this.compose();
        this._manager = manager;
    }

    public get gameWidth(): number {
        return this._gameWidth;
    }

    public get gameHeight(): number {
        return this._gameHeight;
    }

    public update(delta: number): void {
        this._background.update(delta);
        this._bird.updateBird();
        this._pipes.update(delta);
        this.onBirdCollision();
    }

    public updateScoreByOne() {
        const currentScore = this._ui.score;
        this._ui.updateScore(currentScore + 1);
    }

    private compose(): void {
        this.addChild(this._background);
        this.addChild(this._bird);
        this.addChild(this._pipes);
        this.addChild(this._ui);
    }

    private onBirdCollision(): void {
        const pipes = this._pipes.pipesSprites;

        for (let i = 0; i < pipes.length; i++) {
            const bird = this._bird;
            const damaged = this.checkCollision(bird, pipes[i]);
            if (damaged) {
                SceneManager.stop();
                this._ui.showLoseScreen();
            }
        }
    }

    private checkCollision(firstObj: Sprite, secondObj: Sprite): boolean {
        const firstObjBounds = firstObj.getBounds();
        const secondObjBounds = secondObj.getBounds();

        return firstObjBounds.intersects(secondObjBounds);
    }

    private getBirdTextures(): Texture[] {
        const birdSheet = Loader.shared.resources["bird"].textures!;

        const animationFrames = birdAtlas.animations.frame;

        let birdTextures = [];

        for (let i = 0; i < animationFrames.length; i++) {
            const texture = birdSheet[animationFrames[i]];
            birdTextures.push(texture);
        }

        return birdTextures;
    }
}
