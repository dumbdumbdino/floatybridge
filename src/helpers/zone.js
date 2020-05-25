export default class Zone {
    constructor(scene) {
        this.renderZone = () => {
            let dropZone = scene.add.zone(650, 450, 650, 450).setRectangleDropZone(600, 400);
            dropZone.setData({ cards: 0 });
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xffffff);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height)
        }
    }
}