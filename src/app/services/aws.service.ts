import { Injectable } from "@angular/core";
import { environment } from "@root/environment";
import S3 from "aws-sdk/clients/s3";

export interface Photo {
  base64: string;
  objectKey: string;
}

export interface PhotoStatus {
  send: number;
  fail: number;
  isComplete: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AWSS3Service {
  protected static s3: S3;

  /**
   * Initialize S3
   * @param res ParseConfig: S3UserAccessKey
   * **/
  public static initialize() {
    this.s3 = new S3({
      region: environment.aws.region,
      credentials: {
        accessKeyId: environment.aws.accessKey,
        secretAccessKey: environment.aws.secretAccessKey,
      },
    });
  }

  /**
   *  Base64 string
   * @param bucketName name of bucket
   * @param objectKey name of file
   * @param base64Image only base64 string
   */
  public static async uploadImageArrayBuffer(
    bucketName: string,
    objectKey: string,
    buffer: ArrayBuffer
  ) {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: `image/png`,
      CacheControl: "no-cache",
    };
    return new Promise(async (resolve, reject) => {
      await this.s3.upload(params)
        .promise()
        .then(() => {
          resolve(`https://${bucketName}.s3.eu-west-3.amazonaws.com/${objectKey}`);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  public static async base64ToArrayBuffer(base64: string): Promise<ArrayBuffer> {
    return fetch(base64)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => arrayBuffer);
  }
  /**
   *  Base64 string
   * @param bucketName name of bucket
   * @param objectKey name of file
   * @param base64Image only base64 string
   */
  public static async uploadImageBase64(
    bucketName: string,
    objectKey: string,
    base64Image: string
  ) {
    const buffer = await AWSS3Service.base64ToArrayBuffer(base64Image);
    if (buffer == undefined) throw new Error("Error to convert base64 to arrayBuffer");
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: `image/png`,
      CacheControl: "no-cache",
    };
    return new Promise((resolve, reject) => {
      this.s3
        .upload(params)
        .promise()
        .then(() => {
          resolve(`https://${bucketName}.s3.eu-west-3.amazonaws.com/${objectKey}`);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Get file data
   * @param bucketName name of bucket
   * @param objectKey name of file
   * @returns Buffer
   * **/
  public static async getFileData(bucketName: string, objectKey: string) {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
    };
    const getObjectResponse = await this.s3.getObject(params).promise();
    // Retorna o conteúdo do arquivo como um buffer
    return getObjectResponse.Body as Buffer;
  }

  public static async listFiles(bucketName: string, delimiter: string = undefined, maxKeys = 1000) {
    const params: any = {
      Bucket: bucketName,
      MaxKeys: maxKeys,
    };
    if (delimiter) params.Delimiter = delimiter;
    return await this.s3.listObjectsV2(params).promise();
  }

  /**
   * Get number of files
   * @param folderPrefix name of folder
   * @param bucketName name of bucket (optional - default: environment.bucketName)
   * @returns number
   * **/
  public static async getNumberOfFiles(
    folderPrefix: string,
    bucketName: string
  ): Promise<number> {
    const params: any = {
      Bucket: bucketName,
      Prefix: folderPrefix,
    };
    const response = await this.s3.listObjectsV2(params).promise();
    return response.Contents?.length || 0;
  }

  /**
   * Delete file
   * @param bucketName name of bucket
   * @param objectKey name of file
   * **/
  public static async deleteFile(bucketName: string, objectKey: string) {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
    };
    return await this.s3.deleteObject(params).promise();
  }

  /**
   * Upload files
   * @param bucketName name of bucket
   * @param objectKeys name of files
   * returns array of errors
   * **/
  public static async uploadPhotos(bucketName: string, photos: Photo[], status: PhotoStatus): Promise<Photo[]> {
    const imagesFail: Photo[] = [];
    const images = [...photos];
    for await (let photo of images) {
      if (photo.objectKey.includes(bucketName)) continue;
      try {
        await AWSS3Service.uploadImageBase64(
          bucketName,
          photo.objectKey,
          photo.base64
        ).then((objectKey: string) => {
          photo.objectKey = objectKey;
          status.send++;
        })
          .catch(() => {
            status.fail++;
            imagesFail.push(photo);
            photos.splice(photos.indexOf(photo), 1);
          });
      }
      catch (e) {
        status.fail++;
        imagesFail.push(photo);
        photos.splice(photos.indexOf(photo), 1);
      };
    }

    status.send = photos.length;
    status.fail = imagesFail.length;
    return imagesFail;
  }
}
