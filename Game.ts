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
            { mass: 0.0, friction: 1.0, restitution: 0.0 }, scene);
    }
}

class Player extends GameObject {
    private movementSpeed: number;
    private movementOptions: boolean[];

    constructor(name: string, size: number, scene: BABYLON.Scene) {
        super();
        this.movementOptions = [false, false, false, false];
        this.movementSpeed = 0.05;
        this._mesh = BABYLON.Mesh.CreateBox(name, size, scene, true);

        let myMaterial = new BABYLON.StandardMaterial("Purple", scene);
        myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
        this._mesh.material = myMaterial;

        this._mesh.position.y = 1;
        this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this._mesh, BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 1.0, friction: 0.1, restitution: 1.0 }, scene);
    }

    changeMovement(move: number, value: boolean): void {
        this.movementOptions[move] = value;
    }

    applyMovement(): void {
        var movement = BABYLON.Vector3.Zero();

        if (this.movementOptions[0]) {
            movement.x -= this.movementSpeed;
        }
        if (this.movementOptions[1]) {
            movement.x += this.movementSpeed;
        }

        if (this.movementOptions[2]) {
            movement.z += this.movementSpeed;
        }
        if(this.movementOptions[3]) {
            movement.z -= this.movementSpeed;
        }

        this._mesh.moveWithCollisions(movement);
    }

    movePlayerY(distance: number): void {
        if (this._mesh.position.y <= 1.1) {
            this._mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, distance, 0),
                this._mesh.getAbsolutePosition());
        }
    }
}

class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.FreeCamera;
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

        //Add key event listener for movement of the box
        document.addEventListener("keydown", (e) => this.handlePressEvent(e));
        document.addEventListener("keyup", (e) => this.handleReleaseEvent(e));

        // Create a FreeCamera, and set its position to (x:0, y:10, z:-15).
        this._camera = new BABYLON.FreeCamera('FollowCamera', new BABYLON.Vector3(0, 10,-15), this._scene);

        this._ground = new Ground("Ground", 30, 30, this._scene);
        this._player = new Player("Player", 2.0, this._scene);

        this._camera.setTarget(BABYLON.Vector3.Zero());

        this._scene.activeCamera = this._camera;
    }

    // Update movement array in Player to determine its movement
    handlePressEvent(e): void {
        if (e) {
            if (e.code === "ArrowLeft") {
                this._player.changeMovement(0, true);
            }
            if (e.code === "ArrowRight") {
                this._player.changeMovement(1, true);
            }
            if (e.code === "ArrowUp") {
                this._player.changeMovement(2, true);
            }
            if (e.code === "ArrowDown") {
                this._player.changeMovement(3, true);
            }

            if (e.key === ' ') {
                this._player.movePlayerY(5);
            }
        }
    }

    // Update movement array in Player to determine its movement
    handleReleaseEvent(e): void {
        if (e.code === "ArrowLeft") {
            this._player.changeMovement(0, false);
        }
        if (e.code === "ArrowRight") {
            this._player.changeMovement(1, false);
        }
        if (e.code === "ArrowUp") {
            this._player.changeMovement(2, false);
        }
        if (e.code === "ArrowDown") {
            this._player.changeMovement(3, false);
        }
    }

    runRenderLoop(): void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {
            // Apply movement depending on arrows pressed
            this._player.applyMovement();
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
