import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Executor } from './executor/executor.service';

interface PipelineConfig {
  stages: Stage[];
}

interface Stage {
  name: string;
  steps: Step[];
}

interface Step {
  name: string;
  type: string;
  config: any;
}

@Injectable()
export class AiPoweredDevOpsPipelineGenerator {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<any>,
    private readonly executor: Executor,
  ) {}

  async generatePipeline(projectId: string): Promise<string> {
    const project = await this.projectModel.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const pipelineConfig: PipelineConfig = {
      stages: [],
    };

    // AI-powered pipeline generation logic goes here
    // For demonstration purposes, we'll generate a simple pipeline
    pipelineConfig.stages.push({
      name: 'Build',
      steps: [
        {
          name: ' Build and compile code',
          type: 'script',
          config: {
            script: 'npm run build',
          },
        },
      ],
    });

    pipelineConfig.stages.push({
      name: 'Test',
      steps: [
        {
          name: 'Run unit tests',
          type: 'script',
          config: {
            script: 'npm run test',
          },
        },
      ],
    });

    const pipelineYaml = yaml.dump(pipelineConfig);
    const pipelineId = uuidv4();
    fs.writeFileSync(`pipelines/${pipelineId}.yaml`, pipelineYaml);

    return `Pipeline generated successfully! ID: ${pipelineId}`;
  }
}