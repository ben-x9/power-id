import * as bs58 from "bs58"
import * as getRandomValues from "get-random-values"

let epoch = 0
let epochIsSet = false

export type Id = string

/*
Begin timestamps at an offset from the Unix epoch to extend the lifespan of
our GUIDs
*/

export const setEpoch = (val: number) => {
  if (epochIsSet) return
  epoch = val
  epochIsSet = true
}

const int = (float: number) => float | 0

/*
Create a globally unique id
- id is 16 bytes long
- first 12 bytes are randomly generated
- last 4 bytes represent the number of seconds since the epoch
- base 58 format (approx 22 chars)
*/
export default () => {
  const buf = new Uint8Array(16)

  // initialize buffer with high quality randomness
  getRandomValues(buf)

  // add timestamp to end of buffer
  const timestamp = int((Date.now() - epoch) / 1000)
  const buf32 = new Uint32Array(buf.buffer)
  buf32[12 >> 2] = timestamp

  return bs58.encode(buf)
}

/*
Get the creation time of the id as a Unix timestamp
- a unix timestamp is the number of milliseconds since the unix epoch
- timestamp is rounded to the nearest second so it fits within 4 bytes
  inside the id
*/
export const timestamp = (id: string) => {
  const bytes = bs58.decode(id)
  const rawTimestamp =
    bytes[15] << 24 |
    bytes[14] << 16 |
    bytes[13] << 8  |
    bytes[12]
  return epoch + rawTimestamp * 1000
}
