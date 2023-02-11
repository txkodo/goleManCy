import {promises as fs} from 'fs'
import path from 'path'

type Project = {
     models:{
          path: string
     }[]
}

async function readProjectFile(jsonPath:string):Promise<Project> {
     const file = await fs.readFile(jsonPath);
     const data = JSON.parse(file.toString())
     return data
}

async function readModelFile(modelPath:string,projectPath:string):Promise<Project> {
     const filePath = path.resolve(path.dirname(projectPath),modelPath)
     console.log(filePath)
     const file = await fs.readFile(filePath);
     const data = JSON.parse(file.toString())
     return data
}

async function convert(jsonPath:string){
     // プロジェクトの読み込み
     const data = await readProjectFile(jsonPath)

     // プロジェクト内の各モデルの読み込み
     const readPromises = data.models.map( model => readModelFile(model.path,jsonPath))
     const d = await Promise.all(readPromises)
     console.log(d)
}

convert("data\\project.json")