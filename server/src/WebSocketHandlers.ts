import type { RawData } from "ws";
import { WSCloseEvent } from "./Enums.js";

const printLogLine = (msg: string, asError = false, ...extraData: string[]) => {
  let logLine = `[${new Date().toISOString()}]`; // todo, replace with Temporal
  logLine += ` - ${msg}`;
  if (extraData) logLine += `: ${extraData.join(" ").trimEnd()}`;

  asError ? console.error(logLine) : console.log(logLine);
};

export const handleWsMessage = (
  data: RawData,
  isBinary: boolean,
  binaryEncoding: BufferEncoding = "base64"
) =>
  isBinary
    ? printLogLine(
        "received binary data",
        false,
        data.toString(binaryEncoding),
        `(${binaryEncoding.toString()})`
      )
    : printLogLine(data.toString());

export const handleWsClose = (code: number, reason: Buffer) => {
  const extraData = [
    code.toString(),
    WSCloseEvent[code],
    reason.toString("utf8"),
  ];
  printLogLine("close event", false, ...extraData);
};

export const handleWsError = (err: Error) =>
  printLogLine(err.message, true, ...Object.values(err));
