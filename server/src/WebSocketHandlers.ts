/*
// none of this is currently used
import type { RawData } from "ws";
import { WSCloseEvent } from "./Enums.js";
import { clients } from "./index.js";
import { Temporal } from "@js-temporal/polyfill";
import { db } from "./SQLite.js";

const printLogLine = (msg: string, asError = false, ...extraData: string[]) => {
  let logLine = `[${Temporal.Now.instant().toString({
    smallestUnit: "millisecond",
  })}] - `; // todo, replace with Temporal
  extraData.length > 0
    ? (logLine += `${msg}: ${extraData.join(" ").trimEnd()}`)
    : (logLine += msg);

  asError ? console.error(logLine) : console.log(logLine);
};

export const handleWsMessage = (data: RawData, isBinary: boolean) => {
  if (isBinary) console.error("Binary data handling not yet implemented");
  else {
    printLogLine(data.toString());
    const messageObject = JSON.parse(data.toString());

    switch (messageObject.type) {
      case "hello":
        break;

      case "message":
        db.all('SELECT nick FROM "connections";', (err, rows) => {
          const users = rows as Record<string, string>[];
          clients.forEach((ws) => {
            ws.send(
              JSON.stringify({
                type: "message",
                timestamp: Temporal.Now.instant().epochSeconds,
                users: users,
                data: messageObject.data,
              })
            );
          });
        });

        break;

      default:
        break;
    }
  }
};

export const handleWsClose = (code: number, reason: Buffer) => {
  const extraData = [
    code.toString(),
    WSCloseEvent[code],
    reason.toString("utf8"),
  ];
  printLogLine("close event", false, ...extraData);
};

export const handleWsError = (err: Error) => {
  printLogLine(
    err.message,
    true,
    ...Object.entries(err).map((x) => `${x[0]}: ${x[1]}`)
  );
};

// export const handleWsPong = () => console.log("pong");
// export const handleWsPing = () => console.log("ping");
 */
