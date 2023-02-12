import { Brand } from "../brand";

export type BlockbenchOutlineUUID = Brand<string, "BlockbenchOutlineUUID">;
export type BlockbenchUV = Brand<[number, number, number, number], "BlockbenchUV">;
export type BlockbenchCoordinate = Brand<[number, number, number], "BlockbenchCoordinate">;
export type BlockbenchRotation = Brand<[number, number, number], "BlockbenchRotation">;
export type BlockbenchTextureID = Brand<string, "BlockbenchTextureID">;

export type BlockbenchFace = {
    uv: BlockbenchUV;
    texture: number;
};

export type BlockbenchElement = {
    name: string;
    box_uv: boolean;
    rescale: boolean;
    locked: boolean;
    from: BlockbenchCoordinate;
    to: BlockbenchCoordinate;
    autouv: number;
    color: number;
    origin: BlockbenchCoordinate;
    rotation?: BlockbenchRotation
    faces: {
        north?: BlockbenchFace;
        east?: BlockbenchFace;
        south?: BlockbenchFace;
        west?: BlockbenchFace;
        up?: BlockbenchFace;
        down?: BlockbenchFace;
    };
    type: "cube";
    uuid: string;
};

export type BlockbenchOutliner = (
    | {
          name: string;
          origin: BlockbenchCoordinate;
          color: number;
          uuid: BlockbenchOutlineUUID;
          export: boolean;
          mirror_uv: boolean;
          isOpen: boolean;
          locked: boolean;
          visibility: boolean;
          autouv: number;
          children: BlockbenchOutliner;
      }
    | string
)[];

export type BlockbenchKeyframe = {
    channel: "rotation" | "position" | "scale";
    data_points: [
        {
            x: string;
            y: string;
            z: string;
        }
    ];
    uuid: string;
    time: number;
    color: number;
    interpolation: "linear" | "catmullrom" | "bezier" | "step";
    bezier_linked: boolean;
    bezier_left_time: [number, number, number];
    bezier_left_value: [number, number, number];
    bezier_right_time: [number, number, number];
    bezier_right_value: [number, number, number];
};

export type BlockbenchAnimator = {
    name: string;
    type: "bone";
    keyframes: BlockbenchKeyframe[];
};

export type BlockbenchParticleKeyframe = {
    channel: "particle";
    data_points: [
        {
            effect: string;
            locator: string;
            script: string;
            file: string;
        }
    ];
    uuid: string;
    time: number;
};

export type BlockbenchSoundKeyframe = {
    channel: "sound";
    data_points: [
        {
            effect: string;
            file: string;
        }
    ];
    uuid: string;
    time: number;
};

export type BlockbenchTimelineKeyframe = {
    channel: "timeline";
    data_points: [
        {
            script: "";
        }
    ];
    uuid: string;
    time: number;
};

export type BlockbenchEffectKeyframe =
    | BlockbenchParticleKeyframe
    | BlockbenchSoundKeyframe
    | BlockbenchTimelineKeyframe;

export type BlockbenchEffectAnimator = {
    name: "Effect";
    type: "effect";
    keyframes: BlockbenchEffectKeyframe[];
};

export type BlockbenchAnimation = {
    uuid: string;
    name: string;
    loop: "once" | "hold" | "loop";
    override: boolean;
    length: number;
    snapping: number;
    selected: boolean;
    anim_time_update: "";
    blend_weight: "";
    start_delay: "";
    loop_delay: "";
    animators: {
        [x: BlockbenchOutlineUUID]: BlockbenchAnimator;
        effects: BlockbenchEffectAnimator;
    };
};

export type BlockbenchTexture = {
    path: string;
    name: string;
    folder: string;
    namespace: string;
    id: BlockbenchTextureID;
    particle: false;

    // 謎
    render_mode: "default";
    render_sides: "auto";
    frame_time: 1;
    frame_order_type: "loop";
    frame_order: "";
    frame_interpolate: boolean;
    visible: boolean;
    mode: "bitmap";
    saved: true;
    // 謎

    uuid: string;
    relative_path: string;
    source: string;
};

export type BlockbenchResolution = {
    width: number;
    height: number;
};

export type BlockbenchModel = {
    meta: {
        format_version: "4.5";
        model_format: string;
        box_uv: boolean;
    };
    name: string;
    model_identifier: string;
    visible_box: [number, number, number];
    variable_placeholders: string;
    variable_placeholder_buttons: [];
    timeline_setups: [];
    unhandled_root_fields: {};
    resolution: BlockbenchResolution;
    elements: BlockbenchElement[];
    outliner: BlockbenchOutliner;
    textures: BlockbenchTexture[];
    animations: BlockbenchAnimation[];
};
