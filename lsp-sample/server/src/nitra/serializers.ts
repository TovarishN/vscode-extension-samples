import { Message } from './NitraMessages';
import Int64 = require('node-int64');

export function SerializeString(str: string): Buffer {
	let buf = Buffer.alloc(str.length + 1);
	buf.writeInt8(str.length, 0);
	buf.write(str, 1);
	return buf;
}
export function SerializeType(arr: Buffer[]): Buffer {
	return Buffer.concat(arr);
}
export function SerializeMessage(msgId: Message["MsgId"], arr: Buffer[]): Buffer {
	return Buffer.concat([SerializeInt16(msgId), SerializeType(arr)]);
}
export function SerializeInt32(num: number): Buffer {
	let buf = Buffer.alloc(4);
	buf.writeInt32LE(num, 0);
	return buf;
}
export function SerializeArr(arr: Buffer[]): Buffer {
	let buf = Buffer.alloc(4);
	buf.writeInt32LE(arr.length, 0);
	return Buffer.concat([buf, ...arr]);
}
export function SerializeBoolean(b: boolean): Buffer {
	let buf = Buffer.alloc(1);
	buf.writeInt8(b ? 1 : 0, 0);
	return buf;
}
export function SerializeInt16(num: number): Buffer {
	let buf = Buffer.alloc(2);
	buf.writeInt16LE(num, 0);
	return buf;
}
export function SerializeInt64(num: number): Buffer {
	let ret = new Int64(num);
	return ret.buffer;
}

export function SerializeUInt32(num: number): Buffer {
	let buf = Buffer.alloc(4);
	buf.writeUInt32LE(num, 0);
	return buf;
}

export function SerializeUInt16(num: number): Buffer {
	let buf = Buffer.alloc(4);
	buf.writeUInt16LE(num, 0);
	return buf;
}

export function SerializeByte(num: number): Buffer {
	let buf = Buffer.alloc(1);
	buf.writeInt8(num, 0);
	return buf;
}

export function SerializeFloat(num: number): Buffer {
	let buf = Buffer.alloc(4);
	buf.writeFloatLE(num, 0);
	return buf;
}

export function SerializeChar(c: string): Buffer {
	let buf = Buffer.alloc(1);
	buf.write(c);
	return buf;
}

export function SerializeDouble(num: number): Buffer {
	let buf = Buffer.alloc(4);
	buf.writeDoubleLE(num, 0);
	return buf;
}