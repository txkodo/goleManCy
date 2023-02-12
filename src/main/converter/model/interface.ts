import { Brand } from "../brand";
import { affin } from "../matrix";
import { JavaModel } from "./javaModel";

export type PartID = Brand<string, "BlockID">;
export type GroupID = Brand<string, "GroupID">;
export type AnimationID = Brand<string, "AnimationID">;
export type ModelID = Brand<string, "ModelID">;
export type TextureID = Brand<string, "TextureID">;

export type state = { [x: GroupID]: affin };

export interface IGolemancyAnimation {
    id: AnimationID;
    length: number;
    getState: (time: number) => state;
}

export interface IGolemancyModel {
    id: ModelID;
    exportJavaModel: (textures: { [x: TextureID]: string }) => { [x: PartID]: JavaModel };
    applyState: (state: state) => { [x: PartID]: affin };
    textures: { [x: TextureID]: Buffer };
    animaions: IGolemancyAnimation[];
}
