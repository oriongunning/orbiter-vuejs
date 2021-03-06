import MsgCommand from "../../../common/command/MsgCommand";
import Utils from "../../Utils";
import CubeCommand from "../../../common/command/CubeCommand";

window.AFRAME.registerComponent("cube", {
    dependencies: ['material'],
    init: function () {

        const el = this.el;
        const keyState = window.app.gameClient.input.keyState;

        el.addEventListener("click", function (evt) {

            // REMOVE CUBE
            if (keyState.mouseType === 'right') {
                let nid = el.getAttribute('nid');
                let intersected = evt.target;
                let intersectedType = intersected.getAttribute('type');
                if (intersectedType === 'standard') {
                    window.app.gameClient.client.addCommand(new MsgCommand('remove_cube', { nid: nid }));
                    console.log('delete cube', nid)
                }
            }

            // ADD CUBE
            if (keyState.mouseType === 'left') {
                let intersected = window.app.gameClient.cubeHover;
                let intersectedType = intersected?.getAttribute('type');
                if (!intersectedType) return
                let faceIndex = window.app.gameClient.cubeFaceHover;
                let currentPoint = Object.assign({}, intersected.object3D.position); // save original ray point just in case
                let adjustedPoint = Utils.adjustPosition(faceIndex, currentPoint, intersectedType)
                console.log('adjustedPoint ', adjustedPoint)
                window.app.gameClient.client.addCommand(new CubeCommand(adjustedPoint.x, adjustedPoint.y, adjustedPoint.z));
            }

        });

        // ADD HOVER COLOR CHANGE TO CUBES
        const mesh = el.getObject3D('mesh');
        let color = el.getAttribute('material').color;
        mesh.material = [
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
            new window.THREE.MeshLambertMaterial({ color: new window.THREE.Color(color) }),
        ];
        let faceIndex = 0;

        el.addEventListener("mouseenter", function (evt) {
            faceIndex = evt.detail.intersection.face.materialIndex;
            const darkerColor = Utils.darkerColor(color, -0.9);
            // mesh.material[faceIndex] = new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(0xffffff)});
        });

        el.addEventListener("mouseleave", function (evt) {
            // mesh.material[faceIndex] = new window.THREE.MeshLambertMaterial({color: new window.THREE.Color(color)});
        });

    }
});