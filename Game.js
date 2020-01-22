var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = /** @class */ (function () {
    function GameObject() {
    }
    GameObject.prototype.getMesh = function () {
        return this._mesh;
    };
    GameObject.prototype.changeFriction = function (frictionVal) {
        this._mesh.physicsImpostor.friction = frictionVal;
    };
    return GameObject;
}());
var Ground = /** @class */ (function (_super) {
    __extends(Ground, _super);
    function Ground(name, width, height, scene) {
        var _this = _super.call(this) || this;
        _this._mesh = BABYLON.Mesh.CreateGround("Ground", width, height, 2, scene);
        _this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(_this._mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.0, friction: 1.0, restitution: 0.0 }, scene);
        return _this;
    }
    return Ground;
}(GameObject));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(name, size, scene) {
        var _this = _super.call(this) || this;
        _this.movementOptions = [false, false, false, false];
        _this.movementSpeed = 0.05;
        _this._mesh = BABYLON.Mesh.CreateBox(name, size, scene, true);
        var myMaterial = new BABYLON.StandardMaterial("Purple", scene);
        myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
        _this._mesh.material = myMaterial;
        _this._mesh.position.y = 1;
        _this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(_this._mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1.0, friction: 0.1, restitution: 1.0 }, scene);
        return _this;
    }
    Player.prototype.changeMovement = function (move, value) {
        this.movementOptions[move] = value;
    };
    Player.prototype.applyMovement = function () {
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
        if (this.movementOptions[3]) {
            movement.z -= this.movementSpeed;
        }
        this._mesh.moveWithCollisions(movement);
    };
    Player.prototype.movePlayerX = function (distance) {
        //this._mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(distance * this.velocityFactor, 0, 0));
        //this._mesh.translate(BABYLON.Vector3.Right(), distance, BABYLON.Space.WORLD);
        if (this._mesh.physicsImpostor.friction != 0) {
            this.changeFriction(0.0);
            this._mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(distance, 0, 0), this._mesh.getAbsolutePosition());
        }
    };
    Player.prototype.movePlayerY = function (distance) {
        if (this._mesh.position.y <= 1.1) {
            this._mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, distance, 0), this._mesh.getAbsolutePosition());
        }
    };
    return Player;
}(GameObject));
var Game = /** @class */ (function () {
    function Game(canvasElement) {
        this._canvas = document.getElementById(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true);
    }
    Game.prototype.createScene = function () {
        var _this = this;
        // Create a basic BJS Scene object.
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0));
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this._scene);
        //Add key event listener for movement of the box
        document.addEventListener("keydown", function (e) { return _this.handlePressEvent(e); });
        document.addEventListener("keyup", function (e) { return _this.handleReleaseEvent(e); });
        // Create a FreeCamera, and set its position to (x:0, y:10, z:-15).
        this._camera = new BABYLON.FreeCamera('FollowCamera', new BABYLON.Vector3(0, 10, -15), this._scene);
        this._ground = new Ground("Ground", 30, 30, this._scene);
        this._player = new Player("Player", 2.0, this._scene);
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._scene.activeCamera = this._camera;
    };
    // Update movement array in Player to determine its movement
    Game.prototype.handlePressEvent = function (e) {
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
    };
    // Update movement array in Player to determine its movement
    Game.prototype.handleReleaseEvent = function (e) {
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
    };
    Game.prototype.runRenderLoop = function () {
        var _this = this;
        // Run the render loop.
        this._engine.runRenderLoop(function () {
            // Apply movement depending on arrows pressed
            _this._player.applyMovement();
            _this._scene.render();
        });
        // The canvas/window resize event handler.
        window.addEventListener('resize', function () {
            _this._engine.resize();
        });
    };
    return Game;
}());
window.addEventListener('DOMContentLoaded', function () {
    // Create the game using the 'renderCanvas'.
    var game = new Game('renderCanvas');
    // Create the scene.
    game.createScene();
    // Start render loop.
    game.runRenderLoop();
});
