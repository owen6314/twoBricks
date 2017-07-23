
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
canvas.width = window.width;
canvas.height = window.height;
var createScene = function () 
{
    /*
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3.White();
        //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 5), scene);
        var camera = new BABYLON.ArcRotateCamera("arcCamera",BABYLON.Tools.ToRadians(45),BABYLON.Tools.ToRadians(45),10.0,box.position,scene);
        camera.setTarget(BABYLON.Vector3.Zero());  
        var box = BABYLON.Mesh.CreateBox("name",4.0,scene);
        var box2 = BABYLON.Mesh.CreateBox("name",4.0,scene);
        return scene;
    */
    var scene = new BABYLON.Scene(engine);
    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0,100,100),scene);
    var camera = new BABYLON.ArcRotateCamera("camera",0,0.8,100,BABYLON.Vector3.Zero(),scene);
    var sphere1 = new BABYLON.Mesh.CreateSphere("Sphere1",10.0,6.0,scene);
    sphere1.position.x = -40;
    return scene;
}
var scene = createScene();
//循环
engine.runRenderLoop(function () {
    scene.render();
  });
/*
    // This targets the camera to scene origin
                       

    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);

    // This creates a light, aiming 0,1,0 - to the sky.
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Dim the light a small amount
    light.intensity = .5;

    // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

    // Leave this function
    return scene;

  };  // End of createScene function

window.addEventListener("resize", function () {
    engine.resize();
  });*/