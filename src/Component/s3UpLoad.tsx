import { PutObjectCommand, S3Client, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import {v4 as uuidv4} from 'uuid';
import url from 'url'
const bucketName ='parkvic-app'
const region  = "ap-southeast-2"
const keyPrefix = "parkvic/lambda/"
const path_prefix = "https://parkvic-app.s3.ap-southeast-2.amazonaws.com/"
const s3client = new S3Client({
    credentials: {
        accessKeyId: 'AKIAZ5LGHIVTBRFLBPH7',
        secretAccessKey: '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',
    },
    region:region
})

export default async function s3Upload(files: File[]) {
    
    const keyPostfix = uuidv4()
    const temp_url = url.resolve(keyPrefix, keyPostfix) + "/"

    let imageList : string[] = []
    for(const file of files){
        const key = url.resolve(temp_url,file.name)
        
        const command  = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: file,
            ContentType: file.type,
        })
        command.middlewareStack.add((next, context) => async (args) => {
            // @ts-ignore
            args.request.headers["Access-Control-Allow-Origin"] = "*";
            // @ts-ignore
            args.request.headers["Access-Control-Allow-Headers"] = "Content-Type, Origin";
            // @ts-ignore
            args.request.headers["Access-Control-Allow-Methods"] = "PUT";
            
            const result = await next(args);
            // result.response contains data returned from next middleware.
            return result;
          }, {
            step: "finalizeRequest"
        })
        

        imageList = [...imageList, url.resolve(path_prefix, key)]
        try {
            const response =  await s3client.send(command)
        }
        catch(errMsg) {
            console.log("error while uploading images: " + errMsg)
            throw new Error("Upload image failed")
        }
    }

    return imageList
}