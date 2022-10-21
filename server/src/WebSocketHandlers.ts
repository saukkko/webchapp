import type { RawData, WebSocket } from "ws";
import { WSCloseEvent } from "./Enums.js";
import { Temporal } from "@js-temporal/polyfill";

const printLogLine = (msg: string, asError = false, ...extraData: string[]) => {
  let logLine = `[${new Date().toISOString()}] - `; // todo, replace with Temporal
  extraData.length > 0
    ? (logLine += `${msg}: ${extraData.join(" ").trimEnd()}`)
    : (logLine += msg);

  asError ? console.error(logLine) : console.log(logLine);
};

export const handleWsMessage = (
  ws: WebSocket,
  data: RawData,
  isBinary: boolean,
  binaryEncoding: BufferEncoding = "base64"
) => {
  if (isBinary) {
    printLogLine(
      "received binary data",
      false,
      data.toString(binaryEncoding),
      `(${binaryEncoding.toString()})`
    );
    ws.send(data.toString(binaryEncoding));
  } else {
    printLogLine(data.toString());
    ws.send(data.toString());
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
