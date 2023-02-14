import { position, rotation, scale } from "../matrix";
import { BlockbenchElement, BlockbenchModel, BlockbenchOutliner } from "./blockbenchModel";
import { JavaModel } from "./javaModel";

type GolemancyPart = {
    origin: position;
    rotation: rotation;
    position: position;
    scale: scale;
    model: JavaModel;
}

type GolemancyOutliner = {
    origin:position;
    rotation: rotation;
    children: (GolemancyOutliner|GolemancyPart)[];
};

const convertModel = (model: BlockbenchModel): GolemancyOutliner => {
    model.outliner;

    const resolveOutliners = (outliners: (BlockbenchOutliner | string)[]): GolemancyOutliner => {
        const state: GolemancyState = {};

        const isBlockbenchOutliner = (x): x is BlockbenchOutliner => "name" in x;
        const isString = (x): x is string => typeof x === "string";

        const children = outliners.filter(isBlockbenchOutliner).map((outliner) => {
            return resolveOutliners(outliner.children);
        });

        const elements = outliners.filter(isString).map((uuid) => {
            const result = model.elements.find((x) => x.uuid === uuid);
            if (result === undefined) {
                throw Error(`missing element uuid: ${uuid}`);
            }
            return result;
        });
    };
};


const mergeElements = (elements:BlockbenchElement[]):GolemancyPart[] => {
    return []
}
