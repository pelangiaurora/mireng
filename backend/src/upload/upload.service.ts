import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class UploadService {
  private readonly s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId:
        process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey:
        process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  async uploadFile(
    file: Express.Multer.File,
  ) {
    const key =
      'products/' +
      Date.now() +
      '-' +
      file.originalname;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return (
      process.env.R2_PUBLIC_URL +
      '/' +
      key
    );
  }
}
