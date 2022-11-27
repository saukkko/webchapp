// https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
// https://www.iana.org/assignments/websocket/websocket.xml#close-code-number

// 1000-2999	Standards Action, Specification Required or IESG Review
// 3000-3999	First Come First Served
// 4000-4999	Reserved for Private Use
export enum WSCloseEvent {
  "Normal Closure" = 1000,
  "Going Away" = 1001,
  "Protocol error" = 1002,
  "Unsupported Data" = 1003,
  "Reserved" = 1004,
  "No Status Rcvd" = 1005,
  "Abnormal Closure" = 1006,
  "Invalid frame payload data" = 1007,
  "Policy Violation" = 1008,
  "Message Too Big" = 1009,
  "Mandatory Ext." = 1010,
  "Internal Error" = 1011,
  "Service Restart" = 1012,
  "Try Again Later" = 1013,
  "Bad Gateway" = 1014,
  "TLS handshake" = 1015,
  // 1016-2999	Unassigned
  "Unauthorized" = 3000,
  // Custom close codes
  "Invalid key" = 4000,
  "Invalid payload" = 4001,
  "Invalid header" = 4002,
  "Token expired" = 4003,
  "Token not yet valid" = 4004,
  "Token issued in the future" = 4005,
  "JWT Error" = 4009,
  "Timed out" = 4010,
  "Server error" = 4999,
}
