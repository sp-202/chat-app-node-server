import { UAParser } from "ua-parser-js";


class DeviceHelper {

  static getClientDetails(req) {

    // ----------------------------
    // Get IP Address
    // ----------------------------
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      "unknown";
    // Remove IPv6 prefix if present
    if (ip.startsWith('::ffff:')) {
      ip = ip.split('::ffff:')[1];
    }

    // ----------------------------
    // Get User-Agent
    // ----------------------------
    const userAgent = req.headers["user-agent"] || "unknown";

    // ----------------------------
    // Parse Device Info
    // ----------------------------
    const parser = new UAParser();
    parser.setUA(userAgent);
    const ua = parser.getResult();

    return {
      ip,
      deviceType: ua.device.type || "desktop",
      browser: ua.browser.name || "unknown",
      os: ua.os.name || "unknown",
      userAgent
    };
  }
}

export default DeviceHelper;
