import { Injectable } from '@angular/core';
import { Logger } from 'aws-amplify';
const logger = new Logger('DeliveryService');

@Injectable()
export class IdService {
    generateId() {
        var len = 16;
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charLength = chars.length;
        var result = "";
        let randoms = window.crypto.getRandomValues(new Uint32Array(len));
        for (var i = 0; i < len; i++) {
          result += chars[randoms[i] % charLength];
        }
        return result.toLowerCase();
      }
}