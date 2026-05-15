import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class R2Service {
  private s3: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    this.bucket = process.env.R2_BUCKET_NAME!;
    this.publicUrl = process.env.R2_PUBLIC_URL!;

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId:
          process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey:
          process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'products',
  ): Promise<string> {
    try {
      console.log('=== R2 UPLOAD START ===');
      console.log(
        'File name:',
        file.originalname,
      );
      console.log('File size:', file.size);
      console.log(
        'Mime type:',
        file.mimetype,
      );

      const extension =
        file.originalname.split('.').pop();

      const key =
        `${folder}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${extension}`;

      console.log('Key:', key);
      console.log('Bucket:', this.bucket);

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      console.log('=== R2 UPLOAD SUCCESS ===');

      return `${this.publicUrl}/${key}`;
    } catch (error) {
      console.error('=== R2 UPLOAD ERROR ===');
      console.error(error);
      throw error;
    }
  }

  async deleteFile(
    fileUrl: string,
  ): Promise<void> {
    if (
      !fileUrl.startsWith(
        this.publicUrl,
      )
    ) {
      return;
    }

    const key = fileUrl.replace(
      `${this.publicUrl}/`,
      '',
    );

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}