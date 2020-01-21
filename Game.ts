class GameObject {
    protected _mesh: BABYLON.Mesh;

    constructor() {
    }

    getMesh(): BABYLON.Mesh {
        return this._mesh;
    }
}

class Ground extends GameObject {
    constructor(name: string, width: number, height: number,  scene:BABYLON.Scene) {
        super();
        this._mesh = BABYLON.Mesh.CreateGround("Ground", width, height, 2, scene);
        this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this._mesh, BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0 }, scene);
    }
}

class Player extends GameObject {
    private velocityFactor: number;

    constructor(name: string, size: number, scene: BABYLON.Scene) {
        super();
        this.velocityFactor = 25;
        this._mesh = BABYLON.Mesh.CreateBox(name, size, scene, true);
        this._mesh.position.y = 1;
        this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this._mesh, BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1, restitution: 1 }, scene);
    }

    movePlayerX(distance: number): void {
        this._mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(distance * this.velocityFactor, 0, 0));
    }

    movePlayerY(distance: number): void {
        if (this._mesh.position.y <= 2) {
            this._mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, distance, 0),
                this._mesh.getAbsolutePosition());
        }
    }
}

class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.FollowCamera;
    private _player: Player;
    private _ground: Ground;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene(): void {
        // Create a basic BJS Scene object.
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0));

        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);

        //Add event listener for movement of the box
        document.addEventListener("keydown", (e) => this.handleMoveEvent(e));

        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        //this._camera = new BABYLON.FreeCamera('FollowCamera', new BABYLON.Vector3(0, 0,-10), this._scene);
        this._camera = new BABYLON.FollowCamera("FollowCamera", new BABYLON.Vector3(0, 5, -15), this._scene);

        this._ground = new Ground("Ground", 25, 6, this._scene);
        this._player = new Player("Player", 2.0, this._scene);

        this._camera.lockedTarget = this._player.getMesh();
        this._camera.radius = -10;
        this._camera.heightOffset = 0;
        this._camera.noRotationConstraint = true;
        this._camera.setTarget(BABYLON.Vector3.Zero());

        this._scene.activeCamera = this._camera;
    }

    handleMoveEvent(e): void {
        if (e) {
            if (e.code === "ArrowLeft" || e.key === 'a') {
                this._player.movePlayerX(-0.1);
            }
            if (e.code === "ArrowRight" || e.key === 'd') {
                this._player.movePlayerX(0.1);
            }
            if (e.code === "ArrowUp" || e.key === ' ') {
                this._player.movePlayerY(5);
            }
        }
    }

    runRenderLoop(): void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    let game = new Game('renderCanvas');

    // Create the scene.
    game.createScene();

    // Start render loop.
    game.runRenderLoop();
});
