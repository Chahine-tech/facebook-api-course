import { Inject, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { CONFIG_OPTIONS } from './constants';
import { ConfigOptions } from '../entities/config-options.entity';
import { type EnvConfig } from '../entities/env-config.entity';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject(CONFIG_OPTIONS) options: ConfigOptions) {
    const envFile = path.resolve(process.cwd(), options.filename);

    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
