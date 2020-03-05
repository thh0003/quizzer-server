/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * 
 */

'use strict';
const winston = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');

class systemLog {

    constructor(logName, type="Global", project_id="portfolio-shark") {

        this.winstonLog = new LoggingWinston({
            projectID: project_id,
            keyFilename: process.env.gCloudAPIKey
        });
        this.sysLogger = winston.createLogger({
            level: 'info',
            transports: [
              new winston.transports.Console(),
              // Add Stackdriver Logging
              this.winstonLog,
            ],
          });
    }

/*
    when using write Log Entry please use the following format for logEntry
    {
        "location" : "file name / module name",
        "function" : "method or function name",
        "msg" : "what you want to log"
    }

*/

    async writeLogEntry(logEntry) {

        
        // Prepare the entry
//        const entry = this.sysLogger.entry(this.resource, logEntry);

        // See
        // https://googlecloudplatform.github.io/google-cloud-node/#/docs/logging/latest/logging/log?method=write

        await this.sysLogger.info(logEntry);
        console.log(`Wrote: ${logEntry}`);

        // [END logging_write_log_entry_advanced]
    }

    async writeErrorEntry(logEntry) {

        
        // Prepare the entry
//        const entry = this.sysLogger.entry(this.resource, logEntry);

        // See
        // https://googlecloudplatform.github.io/google-cloud-node/#/docs/logging/latest/logging/log?method=write

        await this.sysLogger.error(logEntry);
        console.error(`Error: ${logEntry}`);

        // [END logging_write_log_entry_advanced]
    }
}

module.exports = systemLog;