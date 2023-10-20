import { Controller, Get, Header, Res, Response } from '@nestjs/common';
import { SampleService } from './sample.service';
import * as express from 'express';
import * as fs from "fs";
import axios from 'axios';
const officegen = require('officegen')

@Controller('sample')
export class SampleController {

  constructor(private readonly sampleService: SampleService) { }

  @Get()
  async getHello(@Res() res): Promise<any> {
    const buffer = await this.sampleService.createDocument();
    console.log(buffer)
    // Configura os cabeçalhos para o download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=documento.docx');
    res.send(buffer);
  }
}
