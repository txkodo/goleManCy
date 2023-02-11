import {Brand} from './brand'

export type rotation = Brand<[number, number, number],'rotation'>
export type position = Brand<[number, number, number],'position'>
export type scale = Brand<[number, number, number],'scale'>
export type affin = Brand<[number, number, number, number, number, number, number, number, number, number, number, number],'affin'>;

export const rotation2affin = (rotation:rotation) => {
    const sx = Math.sin(rotation[0])
    const cx = Math.cos(rotation[0])
    const sy = Math.sin(rotation[1])
    const cy = Math.cos(rotation[1])
    const sz = Math.sin(rotation[2])
    const cz = Math.cos(rotation[2])
    return [
        cx*cy*cz-sx*sz , -sx*sy*cz-cx*sz, sy*cz, 0,
        cx*cy*sz-sx*cz , -sx*sy*sz-cx*cz, sy*sz, 0,
        -cx*sy         , sx*sy          , cy   , 0,
    ] as affin
}

export const position2affin = (position:position) => {
    return [
        1,0,0,position[0],
        0,1,0,position[1],
        0,0,1,position[2]
    ] as affin
}

export const scale2affin = (scale:scale) => {
    return [
        scale[0],0,0,0,
        0,scale[1],0,0,
        0,0,scale[2],0,
    ] as affin
}

export const affinMul = (left: affin, right: affin):affin => {
    const result = [0,0,0,left[3],0,0,0,left[7],0,0,0,left[11]] as affin
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
            let sum = 0
            for (let i = 0; i < 3; i++) {
                sum += left[y*4+i]*right[i*4+x]
            }
            result[y*4+x] += sum
        }
    }
    return result
};

export const IDENTITY_AFFIN = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
] as affin

const a1 = [
    1,0,0,1,
    0,1,0,1,
    0,0,1,1
] as affin

const r = affinMul(a1,a1)

console.log(r)