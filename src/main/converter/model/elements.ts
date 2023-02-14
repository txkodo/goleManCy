import { position, rotation } from "../matrix";
import {
    BlockbenchCoordinate,
    BlockbenchElement,
    BlockbenchElementRotation,
    BlockbenchFace,
    BlockbenchResolution,
    BlockbenchTexture,
    BlockbenchUV,
} from "./blockbenchModel";
import { JavaCoordinate, JavaElement, JavaFace, JavaTextureID, JavaUV } from "./javaModel";

const blockbenchElementRotationToAffinRotation = (rotation: BlockbenchElementRotation): rotation => {
    return [...rotation] as rotation;
};

const blockbenchCoordinateToJavaCoordinate = (coord: BlockbenchCoordinate) => {
    return [...coord] as JavaCoordinate;
};

const blockbenchCoordinateToAffinPosition = (coordinate: BlockbenchCoordinate): position => {
    return [...coordinate] as position;
};

const convertUV = (uv: BlockbenchUV, resolution: BlockbenchResolution): JavaUV => {
    return [
        (uv[0] / resolution.width) * 16,
        (uv[1] / resolution.height) * 16,
        (uv[2] / resolution.width) * 16,
        (uv[3] / resolution.height) * 16,
    ] as JavaUV;
};

const convertFace = (
    face: BlockbenchFace,
    resolution: BlockbenchResolution,
    textures: BlockbenchTexture[]
): JavaFace => {
    // HACK: as as
    const texture = textures[face.texture].id as string as JavaTextureID;
    const uv = convertUV(face.uv, resolution);
    return { uv, texture };
};

/** blockbenchElementをJavaElementに変換する。角度的に変換できなかった場合undefinedとなる */
const blockbenchElementToJavaElement = (
    element: BlockbenchElement,
    resolution: BlockbenchResolution,
    textures: BlockbenchTexture[]
): JavaElement | undefined => {
    const elem: JavaElement = {
        from: blockbenchCoordinateToJavaCoordinate(element.from),
        to: blockbenchCoordinateToJavaCoordinate(element.from),
        faces: Object.fromEntries(
            Object.entries(element.faces).map(([k, face]) => [k, convertFace(face, resolution, textures)])
        ),
    };

    return elem;
};

type rotatedElement = {
    origin: position;
    rotation: rotation;
    elements: JavaElement[];
};

/** blockbenchElement[]をrotatedElement[]に変換する。複数のelementをまとめられる場合はまとめておく */
export const blockbenchElementsToJavaElements = (
    blockbenchElements: BlockbenchElement[],
    resolution: BlockbenchResolution,
    textures: BlockbenchTexture[]
): rotatedElement[] => {
    const unrotatedElements: rotatedElement = {
        origin: [0, 0, 0] as position,
        rotation: [0, 0, 0] as rotation,
        elements: [],
    };

    const rotatedElements: rotatedElement[] = [unrotatedElements];

    blockbenchElements.forEach((element) => {
        const elem = blockbenchElementToJavaElement(element,resolution,textures);
        if (elem !== undefined) {
            unrotatedElements.elements.push(elem);
        } else {
            const newElement = { ...element } || { rotation: undefined };
            const elem = blockbenchElementToJavaElement(newElement,resolution,textures);

            if (elem === undefined) throw Error("unknown error");
            if (element.rotation === undefined) throw Error("unknown error");

            rotatedElements.push({
                origin: blockbenchCoordinateToAffinPosition(element.origin),
                rotation: blockbenchElementRotationToAffinRotation(element.rotation),
                elements: [elem],
            });
        }
    });

    return rotatedElements;
};
