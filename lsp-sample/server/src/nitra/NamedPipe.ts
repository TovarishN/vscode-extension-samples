import * as net from 'net';
import * as Rx from 'rxjs';
//import { Observable, timer } from 'rxjs';
import { Message } from './NitraMessages';
import { GetDeserializer } from './NitraDeserialize';
import { DesFun } from './deserializers';

export async function createPipe(name: string): Promise<{
	syncResponse: Rx.Observable<Message>
	, asyncResponse: Rx.Observable<Message>
	, syncRequest: Rx.Observer<Buffer>
}> {
	try {
		let pipeStr = `//./pipe/${name}`;
		let responsePipe = `${pipeStr}-response`;
		let requestPipe = `${pipeStr}-request`;
		let asyncResponsePipe = `${pipeStr}-async-response`;

		let requestObserver = new Rx.Subject<Buffer>();

		process.stdout.write("try connect to response");process.stdout.write('\r\n');

		let connOut = await connect(requestPipe);
		requestObserver.subscribe(data => {
			connOut.write(data);
		});

		let responseAsyncObservable = await createResponsePipe(asyncResponsePipe);

		let responseObservable = await createResponsePipe(responsePipe);

		return { syncResponse: responseObservable, asyncResponse: responseAsyncObservable, syncRequest: requestObserver }
	}
	catch (e) {
		process.stdout.write("error!!! ", e);process.stdout.write('\r\n');
		return { syncResponse: null, syncRequest: null, asyncResponse: null };
	}
}

async function connect(pipe: string): Promise<net.Socket> {
	let socket = net.connect(pipe, () => { process.stdout.write(`${pipe} connection listener!`);process.stdout.write('\r\n'); });
	return new Promise<net.Socket>((resolve, _reject) => {
		socket.on('connect', () => { resolve(socket); });
		socket.on('error', (_ex) => {
			resolve();
		});
	});
}

async function createResponsePipe(pipe: string): Promise<Rx.Observable<Message>> {
	let res = new Rx.Subject<Message>();

	let curMsg: Message | null = null;
	let funStack: DesFun[] = [];

	let conn = await connect(pipe);
	if(!conn)
		throw new Error('connection failure');

	conn.on('data', data => {
		//console.log("async receive: ", data.length, data);
		if (!curMsg) {
			let msgId = data.readInt16LE(0);
			curMsg = <Message>{ MsgId: msgId };
			funStack = GetDeserializer(curMsg);
			return;
		}

		if (funStack && funStack.length > 0) {
			funStack = funStack.shift()(data, funStack);
		}

		if (funStack.length == 0) {
			res.next(curMsg);
			curMsg = null;
		}
	});

	return res.asObservable();
}







