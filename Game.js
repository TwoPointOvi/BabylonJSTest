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
    return GameObject;
}());
var Ground = /** @class */ (function (_super) {
    __extends(Ground, _super);
    function Ground(name, width, height, scene) {
        var _this = _super.call(this) || this;
        _this._mesh = BABYLON.Mesh.CreateGround("Ground", width, height, 2, scene);
        _this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(_this._mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
        return _this;
    }
    return Ground;
}(GameObject));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(name, size, scene) {
        var _this = _super.call(this) || this;
        _this.velocityFactor = 25;
        _this._mesh = BABYLON.Mesh.CreateBox(name, size, scene, true);
        _this._mesh.position.y = 1;
        _this._mesh.physicsImpostor = new BABYLON.PhysicsImpostor(_this._mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 1 }, scene);
        return _this;
    }
    Player.prototype.movePlayerX = function (distance) {
        this._mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(distance * this.velocityFactor, 0, 0));
    };
    Player.prototype.movePlayerY = function (distance) {
        if (this._mesh.position.y <= 2) {
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
        //Add event listener for movement of the box
        document.addEventListener("keydown", function (e) { return _this.handleMoveEvent(e); });
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
    };
    Game.prototype.handleMoveEvent = function (e) {
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
    };
    Game.prototype.runRenderLoop = function () {
        var _this = this;
        // Run the render loop.
        this._engine.runRenderLoop(function () {
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
