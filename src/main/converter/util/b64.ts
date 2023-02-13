export const base64ToBuffer = (base64: string): Buffer => {
    const source = base64.replace(/^data:[a-z0-9_/-]*;base64,/,"");
    const buffer = Buffer.from(source, "base64");
    return buffer;
};
