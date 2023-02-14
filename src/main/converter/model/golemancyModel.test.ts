import { promises as fs } from "fs"
import { GolemancyModel } from "./golemancyModel"

const test = async () => {
    const file = await fs.readFile('data\\ta.bbmodel')
    const bbmodel = JSON.parse(file.toString())
    const model = new GolemancyModel(bbmodel)
    const textureMap = Object.fromEntries(Object.keys(model.textures).map(k => [k,k]))
    const result = model.exportJavaModel(textureMap)
    console.log(JSON.stringify(result,null,2))
}

test()
