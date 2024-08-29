import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RequestRecord {
  timestamps: number[];
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requestsMap: Map<string, RequestRecord> = new Map();

  private readonly windowMs: number = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 1000; // 1 second window
  private readonly maxRequests: number = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 3; // Max 3 requests per windowMs

  constructor() {
    // Ensure 'use' is bound to the current context
    this.use = this.use.bind(this);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const currentTime = Date.now();
    let requestRecord = this.requestsMap.get(ip);

    if (!requestRecord) {
      requestRecord = { timestamps: [] };
      this.requestsMap.set(ip, requestRecord);
    }

    // Filter timestamps that are within the time window
    requestRecord.timestamps = requestRecord.timestamps.filter(timestamp => currentTime - timestamp < this.windowMs);

    // Check if the number of requests in the window exceeds the max allowed
    if (requestRecord.timestamps.length >= this.maxRequests) {
      return res.status(429).json({
        message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests, please try again later',
      });
    }

    // Add current timestamp and update the record
    requestRecord.timestamps.push(currentTime);

    next();
  }
}
