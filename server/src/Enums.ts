// https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
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
}
