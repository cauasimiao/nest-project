import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { Document, HorizontalPositionAlign, HorizontalPositionRelativeFrom, ImageRun, Packer, Paragraph, TextRun, VerticalPositionAlign, VerticalPositionRelativeFrom } from "docx";
import axios from 'axios';
import * as express from 'express';
import officegen = require('officegen');
import path = require('path');
import { saveAs } from 'file-saver';

const download = (url, path) => {
    return new Promise<void>((resolve, reject) => {
        axios({
            url,
            responseType: 'stream',
        }).then(response => {
            response.data.pipe(fs.createWriteStream(path)).on('close', () => {
                resolve();
            });
        }).catch(error => {
            reject(error);
        });
    });
};

@Injectable()
export class SampleService {
    async createDocument(): Promise<any> {
        const URL = 'https://raw.githubusercontent.com/dolanmiu/docx/ccd655ef8be3828f2c4b1feb3517a905f98409d9/demo/images/cat.jpg';
        
        await download(URL, 'cat.jpg');
        
        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph("Hello World"),
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: fs.readFileSync("./cat.jpg"),
                                transformation: {
                                    width: 100,
                                    height: 100,
                                }
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: fs.readFileSync("./cat.jpg"),
                                transformation: {
                                    width: 200,
                                    height: 200,
                                },
                                floating: {
                                    horizontalPosition: {
                                        offset: 1014400,
                                    },
                                    verticalPosition: {
                                        offset: 1014400,
                                    },
                                },
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: fs.readFileSync("./cat.jpg"),
                                transformation: {
                                    width: 200,
                                    height: 200,
                                },
                                floating: {
                                    horizontalPosition: {
                                        relative: HorizontalPositionRelativeFrom.PAGE,
                                        align: HorizontalPositionAlign.RIGHT,
                                    },
                                    verticalPosition: {
                                        relative: VerticalPositionRelativeFrom.PAGE,
                                        align: VerticalPositionAlign.BOTTOM,
                                    },
                                },
                            }),
                        ],
                    }),
                ],
            }],
        });

        const retornoBuffer = await Packer.toBuffer(doc);
        return retornoBuffer
    }
}
