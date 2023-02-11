import {Brand} from "../brand"

export type JavaCoordinate = Brand<[number,number,number],"JavaCoordinate">
export type JavaUV = Brand<[number,number,number,number],"JavaUV">
export type JavaTextureID = Brand<string,"JavaUV">

export type JavaFace = {
    uv: JavaUV;
    texture: JavaTextureID;
}

export type JavaElement = {
    from: JavaCoordinate;
    to: JavaCoordinate;
    rotation?: {
        angle: -45 | -22.5 | 0 | 22.5 | 45;
        axis: "x" | "y" | "z";
        origin: JavaCoordinate;
    };
    faces: {
        north?: JavaFace;
        east?: JavaFace
        south?: JavaFace
        west?: JavaFace;
        up?: JavaFace;
        down?: JavaFace;
    };
}

export type JavaModel = {
    texture_size: [number, number];
    textures: { [x: JavaTextureID]: string };
    elements: JavaElement[]
};
