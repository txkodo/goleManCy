import { Buffer } from 'buffer'
import { affin, rotation, rotation2affin } from "../matrix";
import { IGolemancyAnimation, IGolemancyModel, ModelID, PartID, TextureID, state } from "./interface";
import { JavaModel, JavaElement, JavaCoordinate, JavaFace, JavaUV, JavaTextureID } from "./javaModel";
import {
    BlockbenchElement,
    BlockbenchModel,
    BlockbenchCoordinate,
    BlockbenchFace,
    BlockbenchResolution,
    BlockbenchUV,
    BlockbenchTexture,
    BlockbenchRotation,
} from "./blockbenchModel";
import { base64ToBuffer } from '../../util/b64';

class PartIDmap {
    head: number = 0;
    map: { [uuid: string]: PartID } = {};
    constructor() {
        this.head = 0;
    }

    getPartID = (uuid: string) => {
        if (this.map[uuid] === undefined) {
            const id = this.head.toString() as PartID;
            this.map[uuid] = id;
            this.head += 1;
            return id;
        }
        return this.map[uuid];
    };
}

const blockbenchCoordinateToJavaCoordinate = (coord: BlockbenchCoordinate) => {
    return [...coord] as JavaCoordinate;
};

const blockbenchUVToJavaUV = (uv: BlockbenchUV, resolution: BlockbenchResolution): JavaUV => {
    return [
        (uv[0] / resolution.width) * 16,
        (uv[1] / resolution.height) * 16,
        (uv[2] / resolution.width) * 16,
        (uv[3] / resolution.height) * 16,
    ] as JavaUV;
};

const blockbenchRotationToAffinRotation = (rotation: BlockbenchRotation): rotation => {
    return [...rotation] as rotation;
};

export class GolemancyModel implements IGolemancyModel {
    id: ModelID;
    textures: { [x: TextureID]: Buffer };
    animaions: IGolemancyAnimation[];

    private partIDMap = new PartIDmap();
    private javaModel: { [x: PartID]: JavaModel };
    private textureMap: { [x: TextureID]: string };
    private partAffinMap: { [id: PartID]: affin } = {};

    constructor(blockbenchModel: BlockbenchModel) {
        this.id = blockbenchModel.model_identifier as ModelID;

        this.textureMap = {};

        this.javaModel = this.constructJavaModels(
            blockbenchModel.elements,
            blockbenchModel.resolution,
            blockbenchModel.textures
        );

        this.textures = this.constructTextures(blockbenchModel.textures);

        // TODO: animationの読み込み
        this.animaions = [];
    }

    applyState(state: state): { [x: PartID]: affin }{
        return {};
    };

    private constructJavaModels(
        elements: BlockbenchElement[],
        resolution: BlockbenchResolution,
        textures: BlockbenchTexture[]
    ): { [x: PartID]: JavaModel }{
        const constructJavaFace = (face: BlockbenchFace): JavaFace => {
            // HACK: as as
            const texture = textures[face.texture].id as string as JavaTextureID;
            const uv = blockbenchUVToJavaUV(face.uv, resolution);
            return { uv, texture };
        };

        const constructJavaModel = (element: BlockbenchElement): [PartID, JavaModel] => {
            const elem: JavaElement = {
                from: blockbenchCoordinateToJavaCoordinate(element.from),
                to: blockbenchCoordinateToJavaCoordinate(element.from),
                faces: Object.fromEntries(
                    Object.entries(element.faces).map(([k, face]) => [k, constructJavaFace(face)])
                ),
            };

            const result: JavaModel = {
                elements: [elem],
                textures: this.textureMap,
                texture_size: [0, 0],
            };

            const rot = element.rotation ?? ([0, 0, 0] as BlockbenchRotation);
            let affin = rotation2affin(blockbenchRotationToAffinRotation(rot));

            const id = this.partIDMap.getPartID(element.uuid);
            this.partAffinMap[id] = affin;

            return [id, result];
        };

        return Object.fromEntries(elements.map(constructJavaModel));
    };

    private constructTextures(textures:BlockbenchTexture[]):{ [x: TextureID]: Buffer }{
        const entries = textures.map( texture => [texture.id,base64ToBuffer(texture.source)])

        return Object.fromEntries(entries)
    }

    exportJavaModel(textures: { [x: TextureID]: string }){
        Object.entries(textures).forEach(([k,v]) => {
            this.textureMap[k] = v;
        });
        return this.javaModel;
    };
}
